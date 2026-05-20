import { useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { getLocalizedCarDescription } from "@/lib/carContent";
import { useFleet } from "@/lib/fleet";

const SITE_NAME = "Alaoui Car Rental";
const DEFAULT_URL = "https://alaouicarrental.com";
const DEFAULT_DESCRIPTION =
  "Alaoui Car Rental offers simple car rental in Morocco with clean vehicles, clear prices, and delivery in Casablanca, Marrakech, Rabat, and other Moroccan cities.";
const AEO_SUMMARY =
  "Alaoui Car Rental is a Morocco car rental agency based in Casablanca. It offers economy, sedan, luxury, pickup, SUV, hybrid, electric, and sports rental cars with online booking requests, WhatsApp support, and delivery in major Moroccan cities.";
const KEYWORDS = [
  "car rental Morocco",
  "location voiture Maroc",
  "كراء السيارات المغرب",
  "car rental Casablanca",
  "location voiture Casablanca",
  "car rental Marrakech",
  "airport car rental Morocco",
  "luxury car rental Morocco",
  "SUV rental Morocco",
  "electric car rental Morocco",
  "hybrid car rental Morocco",
  "rental cars Rabat",
  "Alaoui Car Rental",
  "Morocco airport car rental",
  "daily car rental Morocco",
];

type SeoData = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const Seo = () => {
  const location = useLocation();
  const params = useParams();
  const cars = useFleet();
  const { lang } = useI18n();

  const seo = useMemo<SeoData>(() => {
    const path = location.pathname;
    const car = path.startsWith("/cars/") ? cars.find((item) => item.id === params.id) : undefined;

    if (path.startsWith("/admin")) {
      return {
        title: "Admin dashboard | Alaoui Car Rental",
        description: "Personnel dashboard for Alaoui Car Rental.",
        path,
        robots: "noindex, nofollow",
      };
    }

    if (car) {
      const carDescription = getLocalizedCarDescription(car, lang);
      return {
        title: `${car.brand} ${car.name} rental in Morocco | Alaoui Car Rental`,
        description: `Rent the ${car.brand} ${car.name} in Morocco from ${car.pricePerDay} MAD per day. ${carDescription}`,
        path,
      };
    }

    const routeMap: Record<string, SeoData> = {
      "/": {
        title: "Alaoui Car Rental | Car rental in Morocco",
        description: DEFAULT_DESCRIPTION,
        path,
      },
      "/cars": {
        title: "Rental cars in Morocco | Alaoui Car Rental fleet",
        description: "Browse clean economy, sedan, luxury, pickup, and sports rental cars available in Morocco with clear daily prices.",
        path,
      },
      "/booking": {
        title: "Book a rental car in Morocco | Alaoui Car Rental",
        description: "Request a rental car booking in Morocco, select dates, delivery city, payment method, and vehicle details.",
        path,
      },
      "/about": {
        title: "About Alaoui Car Rental | Morocco car rental team",
        description: "Learn about Alaoui Car Rental, a Moroccan rental service with clean cars, clear prices, and local delivery.",
        path,
      },
      "/contact": {
        title: "Contact Alaoui Car Rental | Phone, WhatsApp, Instagram",
        description: "Contact Alaoui Car Rental by phone, WhatsApp, email, Instagram, or map location for car rental support in Morocco.",
        path,
      },
    };

    return routeMap[path] ?? {
      title: "Alaoui Car Rental | Car rentals in Morocco",
      description: DEFAULT_DESCRIPTION,
      path,
    };
  }, [cars, lang, location.pathname, params.id]);

  useEffect(() => {
    const origin = window.location.origin.includes("localhost") ? DEFAULT_URL : window.location.origin;
    const canonicalUrl = `${origin}${seo.path === "/" ? "/" : seo.path}`;
    const imageUrl = `${origin}/logo.svg`;
    const robots = seo.robots ?? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("abstract", AEO_SUMMARY);
    setMeta("subject", "Car rental agency in Morocco");
    setMeta("classification", "Auto rental, vehicle hire, travel services");
    setMeta("keywords", KEYWORDS.join(", "));
    setMeta("author", SITE_NAME);
    setMeta("robots", robots);
    setMeta("geo.region", "MA");
    setMeta("geo.placename", "Casablanca, Morocco");
    setMeta("geo.position", "33.5731;-7.5898");
    setMeta("ICBM", "33.5731, -7.5898");
    setMeta("language", "English, French, Arabic");
    setMeta("coverage", "Morocco");
    setMeta("distribution", "global");
    setMeta("rating", "general");
    setMeta("reply-to", "contact@alaouicarrental.com");
    setMeta("application-name", SITE_NAME);
    setMeta("theme-color", "#d99a32");

    setProperty("og:site_name", SITE_NAME);
    setProperty("og:title", seo.title);
    setProperty("og:description", seo.description);
    setProperty("og:type", "website");
    setProperty("og:url", canonicalUrl);
    setProperty("og:image", imageUrl);
    setProperty("og:locale", "en_US");
    setProperty("og:locale:alternate", "fr_FR");
    setProperty("og:locale:alternate", "ar_MA");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", imageUrl);

    setLink("canonical", canonicalUrl);
    setAlternate("en", canonicalUrl);
    setAlternate("fr", canonicalUrl);
    setAlternate("ar", canonicalUrl);
    setAlternate("x-default", canonicalUrl);
    setJsonLd(buildJsonLd(origin, canonicalUrl, cars));
  }, [cars, seo]);

  return null;
};

function setMeta(name: string, content: string) {
  const selector = `meta[name="${name}"]`;
  const tag = document.head.querySelector<HTMLMetaElement>(selector) ?? document.createElement("meta");
  tag.setAttribute("name", name);
  tag.setAttribute("content", content);
  if (!tag.parentElement) document.head.appendChild(tag);
}

function setProperty(property: string, content: string) {
  const selector = `meta[property="${property}"]`;
  const tag = document.head.querySelector<HTMLMetaElement>(selector) ?? document.createElement("meta");
  tag.setAttribute("property", property);
  tag.setAttribute("content", content);
  if (!tag.parentElement) document.head.appendChild(tag);
}

function setLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  const tag = document.head.querySelector<HTMLLinkElement>(selector) ?? document.createElement("link");
  tag.setAttribute("rel", rel);
  tag.setAttribute("href", href);
  if (!tag.parentElement) document.head.appendChild(tag);
}

function setAlternate(lang: string, href: string) {
  const selector = `link[rel="alternate"][hreflang="${lang}"]`;
  const tag = document.head.querySelector<HTMLLinkElement>(selector) ?? document.createElement("link");
  tag.setAttribute("rel", "alternate");
  tag.setAttribute("hreflang", lang);
  tag.setAttribute("href", href);
  if (!tag.parentElement) document.head.appendChild(tag);
}

function setJsonLd(data: unknown) {
  const id = "structured-data";
  const tag = document.getElementById(id) ?? document.createElement("script");
  tag.id = id;
  tag.setAttribute("type", "application/ld+json");
  tag.textContent = JSON.stringify(data);
  if (!tag.parentElement) document.head.appendChild(tag);
}

function buildJsonLd(origin: string, canonicalUrl: string, cars: ReturnType<typeof useFleet>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRental",
        "@id": `${origin}/#business`,
        name: SITE_NAME,
        url: origin,
        logo: `${origin}/logo.svg`,
        image: `${origin}/logo.svg`,
        description: DEFAULT_DESCRIPTION,
        telephone: "+212 5 22 00 01 88",
        email: "contact@alaouicarrental.com",
        priceRange: "290-1490 MAD per day",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Boulevard Anfa",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
        areaServed: ["Casablanca", "Marrakech", "Rabat", "Tangier", "Agadir", "Morocco"],
        knowsAbout: [
          "car rental in Morocco",
          "airport car delivery",
          "luxury car rental",
          "SUV rental",
          "electric car rental",
          "hybrid car rental",
          "daily and long-term vehicle hire",
        ],
        sameAs: ["https://www.instagram.com/alaoui.carrental/"],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "20:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "10:00",
            closes: "16:00",
          },
        ],
        makesOffer: {
          "@type": "OfferCatalog",
          name: "Rental car fleet",
          itemListElement: cars.map((car) => ({
            "@type": "Offer",
            price: car.pricePerDay,
            priceCurrency: "MAD",
            availability: "https://schema.org/InStock",
            itemOffered: {
              "@type": "Car",
              name: `${car.brand} ${car.name}`,
              brand: car.brand,
              vehicleTransmission: car.transmission,
              fuelType: car.fuel,
              numberOfSeats: car.seats,
              image: car.image,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        inLanguage: ["en", "fr", "ar"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${origin}/cars?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: document.title,
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#business` },
      },
      {
        "@type": "FAQPage",
        "@id": `${origin}/#aeo-faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Where can I rent a car in Morocco?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alaoui Car Rental offers car rental in Morocco with service in Casablanca, Marrakech, Rabat, Tangier, Agadir, and airport delivery on request.",
            },
          },
          {
            "@type": "Question",
            name: "Can I book a rental car online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Customers can choose a vehicle, select pickup and drop-off dates, add contact details, and send an online booking request.",
            },
          },
          {
            "@type": "Question",
            name: "Does Alaoui Car Rental offer luxury, hybrid, or electric cars?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The fleet supports economy, sedan, luxury, pickup, sports, hybrid, and electric vehicle options depending on availability.",
            },
          },
        ],
      },
      {
        "@type": "SpeakableSpecification",
        "@id": `${origin}/#speakable`,
        cssSelector: ["h1", "meta[name='description']"],
      },
    ],
  };
}

export default Seo;
