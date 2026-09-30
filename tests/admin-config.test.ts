import { describe, it, expect } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";

const CONTENT_DIR = join(process.cwd(), "src/content");
const CONFIG_PATH = join(process.cwd(), "public/admin/config.yml");

type Field = {
  name?: string;
  widget?: string;
  required?: boolean;
  value_type?: string;
  media_library?: { config?: { max_file_size?: number } };
  fields?: Field[];
  field?: Field;
};

type Collection = {
  name: string;
  label: string;
  folder?: string;
  files?: { name: string; file: string; fields?: Field[] }[];
  fields?: Field[];
};

type Config = {
  collections: Collection[];
  media_library?: { name?: string };
};

async function loadConfig(): Promise<Config> {
  return parse(await readFile(CONFIG_PATH, "utf8")) as Config;
}

async function contentDirs(): Promise<string[]> {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

function fieldsOf(collection: Collection): Field[] {
  if (collection.files?.length === 1) return collection.files[0].fields ?? [];
  return collection.fields ?? [];
}

/** Alle Schluessel eines JSON-Objekts, rekursiv durch Arrays hindurch. */
function jsonKeys(value: unknown, prefix = ""): Set<string> {
  const keys = new Set<string>();
  if (Array.isArray(value)) {
    for (const item of value) jsonKeys(item, prefix).forEach((k) => keys.add(k));
    return keys;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      keys.add(path);
      jsonKeys(nested, path).forEach((k) => keys.add(k));
    }
  }
  return keys;
}

/** Alle Pfade, die die Decap-Felder eines Collections-Eintrags abdecken. */
function fieldPaths(fields: Field[], prefix = ""): Set<string> {
  const paths = new Set<string>();
  for (const field of fields) {
    if (!field.name) continue;
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    paths.add(path);
    if (field.widget === "object" && field.fields) {
      fieldPaths(field.fields, path).forEach((p) => paths.add(p));
    }
    if (field.widget === "list" && field.fields) {
      fieldPaths(field.fields, path).forEach((p) => paths.add(p));
    }
    if (field.widget === "list" && field.field) {
      fieldPaths([field.field], path).forEach((p) => paths.add(p));
    }
  }
  return paths;
}

async function filesOf(collection: Collection): Promise<string[]> {
  if (collection.files?.length) {
    return collection.files.map((f) => join(process.cwd(), f.file));
  }
  if (!collection.folder) return [];
  const dir = join(process.cwd(), collection.folder);
  const entries = await readdir(dir);
  return entries.filter((f) => f.endsWith(".json")).map((f) => join(dir, f));
}

describe("Decap-Konfiguration", () => {
  it("ist valides YAML mit Collections", async () => {
    const config = await loadConfig();
    expect(Array.isArray(config.collections)).toBe(true);
    expect(config.collections.length).toBeGreaterThan(0);
  });

  /**
   * Ausgangsfehler war: 'reviews' und 'priceRules' gab es in content.config.ts,
   * aber nicht in der Decap-Konfiguration. Der Rechner und die Bewertungen
   * waren damit nicht pflegbar. Dieser Test verhindert das rueckwirkend.
   */
  it("registriert jede Content-Collection", async () => {
    const config = await loadConfig();
    const targets = config.collections.flatMap((c) =>
      c.folder ? [c.folder] : (c.files ?? []).map((f) => f.file),
    );

    for (const dir of await contentDirs()) {
      expect(
        targets.some((t) => t.includes(`content/${dir}`)),
        `src/content/${dir} fehlt in config.yml`,
      ).toBe(true);
    }
  });

  it("kennt kein Content-Verzeichnis, das es nicht mehr gibt", async () => {
    const config = await loadConfig();
    const dirs = await contentDirs();

    for (const collection of config.collections) {
      for (const target of collection.folder
        ? [collection.folder]
        : (collection.files ?? []).map((f) => f.file)) {
        const dir = target.split("content/")[1]?.split("/")[0];
        if (dir) expect(dirs, `config.yml zeigt auf ${dir}`).toContain(dir);
      }
    }
  });

  it("deckt jeden Schluessel im Inhalt mit einem Feld ab", async () => {
    const config = await loadConfig();

    for (const collection of config.collections) {
      const covered = fieldPaths(fieldsOf(collection));

      for (const file of await filesOf(collection)) {
        const json = JSON.parse(await readFile(file, "utf8"));
        const name = file.split("/").pop();

        for (const key of jsonKeys(json)) {
          if ([...covered].some((c) => c === key || c.startsWith(`${key}.`))) continue;
          expect.fail(`${collection.name}/${name}: Schluessel "${key}" hat kein Feld in config.yml`);
        }
      }
    }
  });

  it("speichert Preise als Zahl, nicht als String", async () => {
    const config = await loadConfig();
    const calculator = config.collections.find((c) => c.name === "calculator");
    const numberFields: string[] = [];

    const walk = (fields: Field[], prefix = "") => {
      for (const field of fields) {
        if (!field.name) continue;
        const path = prefix ? `${prefix}.${field.name}` : field.name;
        if (field.widget === "number" && !field.value_type) {
          numberFields.push(path);
        }
        if (field.fields) walk(field.fields, path);
        if (field.field) walk([field.field], path);
      }
    };
    walk(fieldsOf(calculator ?? { name: "calculator", label: "" }));

    expect(numberFields, "ohne value_type speichert Decap Zahlen als String").toEqual([]);
  });

  it("nutzt fuer Bilder den image-Widget", async () => {
    const config = await loadConfig();
    const imageNames = ["heroImage", "galleryImages", "photo", "image"];
    const asString: string[] = [];

    const walk = (fields: Field[], prefix = "", collection = "") => {
      for (const field of fields) {
        if (!field.name) continue;
        const path = prefix ? `${prefix}.${field.name}` : field.name;
        const isImageField =
          imageNames.includes(field.name) ||
          (field.field !== undefined && field.field.name !== undefined && imageNames.includes(field.field.name));
        if (isImageField && field.widget === "string") {
          asString.push(`${collection}: ${path}`);
        }
        if (field.fields) walk(field.fields, path, collection);
        if (field.field) walk([field.field], path, collection);
      }
    };

    for (const collection of config.collections) {
      walk(fieldsOf(collection), "", collection.label);
    }

    expect(asString, "Bildfelder als string zwingen zum manuellen URL-Eintragen").toEqual([]);
  });

  /**
   * Produktionsbug vom 2026-09-30: ein globales
   *
   *   media_library:
   *     config:
   *       max_file_size: 6000000
   *
   * laesst den Editor mit "Config Errors: 'media_library' must have
   * required property 'name'" abbrechen, die Redaktionsseite ist tot.
   * media_library waehlt das Backend der Mediathek (default,
   * cloudinary, uploadcare) und verlangt darum ein name. Die
   * Standard-Mediathek wird gar nicht angegeben.
   */
  it("gibt media_library nicht global ohne name an", async () => {
    const config = await loadConfig();
    const media = config.media_library;

    if (media !== undefined) {
      expect(
        media.name,
        "globales media_library waehlt ein Mediathek-Backend und braucht ein name",
      ).toBeTruthy();
    }
  });

  /**
   * Die 6-MB-Grenze gehoert an jedes Bildfeld einzeln, nicht an eine
   * globale media_library. Sonst gilt sie fuer gar nichts, ohne dass
   * Decap sich beschwert.
   */
  it("begrenzt jedes Bildfeld auf 6 MB", async () => {
    const config = await loadConfig();
    const unlimited: string[] = [];

    const walk = (fields: Field[], prefix = "", collection = "") => {
      for (const field of fields) {
        if (!field.name) continue;
        const path = prefix ? `${prefix}.${field.name}` : field.name;
        if (field.widget === "image" && field.media_library?.config?.max_file_size !== 6000000) {
          unlimited.push(`${collection}: ${path}`);
        }
        if (field.fields) walk(field.fields, path, collection);
        if (field.field) walk([field.field], path, collection);
      }
    };

    for (const collection of config.collections) {
      walk(fieldsOf(collection), "", collection.label);
    }

    expect(unlimited, "ohne max_file_size am Feld ist das Upload-Limit wirkungslos").toEqual(
      [],
    );
  });
});
