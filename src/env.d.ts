/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BOOKING_PROVIDER?: string;
  readonly PUBLIC_BOOKING_URL?: string;
  readonly PUBLIC_BOOKING_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
