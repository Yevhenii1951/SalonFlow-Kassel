export const salon = {
  name: "SalonFlow Kassel",
  city: "Kassel",
  tagline: "Farbe, Schnitt und Styling mit klarer Beratung.",
  bookingUrl: "https://example.com/termin-buchen",
  phone: "+49 561 000000",
  email: "termin@salonflow-kassel.example",
  address: {
    street: "Friedrich-Ebert-Strasse 48",
    postalCode: "34117",
    city: "Kassel",
  },
  hours: [
    ["Mo", "geschlossen"],
    ["Di-Fr", "09:00-19:00"],
    ["Sa", "09:00-15:00"],
  ],
};

export const navItems = [
  { label: "Leistungen", href: "/leistungen/" },
  { label: "Preise", href: "/preise/" },
  { label: "Galerie", href: "/galerie/" },
  { label: "Team", href: "/team/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Kontakt", href: "/kontakt/" },
];

export const services = [
  {
    title: "Balayage",
    slug: "balayage-kassel",
    summary: "Weiche Farbverlaeufe, Beratung vorab und Pflegeplan fuer zuhause.",
    price: "ab 145 EUR",
    duration: "ca. 2,5-4 Std.",
    featured: true,
  },
  {
    title: "Damenhaarschnitt",
    slug: "damenhaarschnitt",
    summary: "Schnitt, Styling und Empfehlungen passend zu Alltag und Haarstruktur.",
    price: "ab 54 EUR",
    duration: "ca. 60 Min.",
    featured: true,
  },
  {
    title: "Herrenhaarschnitt",
    slug: "herrenhaarschnitt",
    summary: "Praeziser Schnitt mit Stylingfinish und unkomplizierter Beratung.",
    price: "ab 34 EUR",
    duration: "ca. 40 Min.",
    featured: true,
  },
  {
    title: "Coloration",
    slug: "coloration",
    summary: "Ansatz, Glossing oder komplette Farbveraenderung nach Beratung.",
    price: "ab 72 EUR",
    duration: "ca. 90-150 Min.",
    featured: false,
  },
  {
    title: "Brautstyling",
    slug: "brautstyling",
    summary: "Probe, Frisur und Make-up fuer Hochzeitstage in Kassel und Umgebung.",
    price: "ab 189 EUR",
    duration: "nach Aufwand",
    featured: false,
  },
  {
    title: "Pflegebehandlung",
    slug: "pflegebehandlung",
    summary: "Intensive Pflege fuer strapaziertes, trockenes oder coloriertes Haar.",
    price: "ab 28 EUR",
    duration: "ca. 20 Min.",
    featured: false,
  },
];

export const priceGroups = [
  {
    name: "Schnitt & Styling",
    items: [
      ["Damenhaarschnitt inkl. Styling", "ab 54 EUR"],
      ["Herrenhaarschnitt", "ab 34 EUR"],
      ["Waschen & Foehnen", "ab 32 EUR"],
    ],
  },
  {
    name: "Farbe",
    items: [
      ["Ansatzfarbe", "ab 58 EUR"],
      ["Glossing", "ab 42 EUR"],
      ["Balayage inkl. Beratung", "ab 145 EUR"],
    ],
  },
  {
    name: "Events",
    items: [
      ["Brautstyling Probe", "ab 89 EUR"],
      ["Brautstyling Hochzeitstag", "ab 189 EUR"],
      ["Abendstyling", "ab 64 EUR"],
    ],
  },
];

export const team = [
  {
    name: "Mara",
    role: "Coloristin",
    focus: "Balayage, Blond, Glossing",
  },
  {
    name: "Lea",
    role: "Stylistin",
    focus: "Schnitt, Beratung, Pflege",
  },
  {
    name: "Nora",
    role: "Make-up & Events",
    focus: "Brautstyling, Abendlook",
  },
];

export const testimonials = [
  "Sehr klare Beratung und ein Ergebnis, das auch nach Wochen noch gut aussieht.",
  "Online-Termin war schnell erledigt, Preise waren vorher verstaendlich.",
  "Ruhiger Salon, gute Empfehlungen und keine Hektik beim ersten Besuch.",
];

export const gallery = [
  {
    title: "Modernes Saloninterieur",
    category: "Salon",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    alt: "Moderner Friseursalon mit Spiegeln und Stylingstuehlen",
  },
  {
    title: "Beratung am Platz",
    category: "Beratung",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    alt: "Salonbereich mit Produkten und Kundentermin",
  },
  {
    title: "Farbservice",
    category: "Farbe",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
    alt: "Friseurarbeit an coloriertem Haar",
  },
  {
    title: "Stylingfinish",
    category: "Styling",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    alt: "Styling mit Foehn im Friseursalon",
  },
];

export const faqs = [
  {
    question: "Kann ich online einen Termin buchen?",
    answer:
      "Ja. In diesem Portfolio-Projekt fuehrt der Buchungsbutton zu einem externen Booking-Mock. In einem echten Kundenprojekt koennte dort StudioBookr, Treatwell, Shore oder ein anderer Anbieter angebunden werden.",
  },
  {
    question: "Warum stehen viele Preise mit 'ab'?",
    answer:
      "Farbe und Styling haengen von Haarlaenge, Ausgangsfarbe, Aufwand und Pflegebedarf ab. Die genaue Empfehlung entsteht in der Beratung.",
  },
  {
    question: "Ist das ein echter Salon?",
    answer:
      "Nein. SalonFlow Kassel ist ein realistisches Trainingsprojekt fuer Portfolio, SDD und lokale Webentwicklung.",
  },
];

export const schema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: salon.name,
  telephone: salon.phone,
  email: salon.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: salon.address.street,
    postalCode: salon.address.postalCode,
    addressLocality: salon.address.city,
    addressCountry: "DE",
  },
  url: "https://salonflow-kassel.example",
  priceRange: "EUR",
};
