import clio from "@/assets/car-clio.jpg";
import corsa from "@/assets/car-corsa.jpg";
import logan from "@/assets/car-logan.jpg";
import sandero from "@/assets/car-sandero.jpg";
import peugeot208 from "@/assets/car-208.jpg";
import mercA from "@/assets/car-merc-a.jpg";
import mercS from "@/assets/car-merc-s.jpg";
import raptor from "@/assets/car-raptor.jpg";
import rs3 from "@/assets/car-rs3.jpg";
import a6 from "@/assets/car-a6.jpg";
import a8 from "@/assets/car-a8.jpg";

export type Car = {
  id: string;
  name: string;
  brand: string;
  category: "Sedan" | "Hatchback" | "Luxury" | "Pickup" | "Sports";
  pricePerDay: number;
  image: string;
  gallery?: string[];
  seats: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  topSpeed: number;
  technical: {
    engine: string;
    power: string;
    consumption: string;
    luggage: string;
  };
  description: string;
  features: string[];
};

export const cars: Car[] = [
  {
    id: "clio-5",
    name: "Clio 5",
    brand: "Renault",
    category: "Hatchback",
    pricePerDay: 390,
    image: clio,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 200,
    technical: {
      engine: "1.0 TCe",
      power: "90 hp",
      consumption: "5.2 L/100 km",
      luggage: "391 L",
    },
    description: "A nimble city hatchback with sharp lines and modern tech. Perfect for navigating Moroccan streets with style and efficiency.",
    features: ["Touchscreen infotainment", "Rear camera", "Cruise control", "Bluetooth", "LED headlights"],
  },
  {
    id: "opel-corsa",
    name: "Corsa",
    brand: "Opel",
    category: "Hatchback",
    pricePerDay: 380,
    image: corsa,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 207,
    technical: {
      engine: "1.2 Turbo",
      power: "100 hp",
      consumption: "5.1 L/100 km",
      luggage: "309 L",
    },
    description: "Compact, efficient, and surprisingly refined. The Corsa brings German engineering to everyday Moroccan driving.",
    features: ["Apple CarPlay", "Lane assist", "Auto climate", "Keyless entry", "Parking sensors"],
  },
  {
    id: "dacia-logan",
    name: "Logan",
    brand: "Dacia",
    category: "Sedan",
    pricePerDay: 290,
    image: logan,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 175,
    technical: {
      engine: "1.0 SCe",
      power: "73 hp",
      consumption: "5.6 L/100 km",
      luggage: "528 L",
    },
    description: "Morocco's favorite sedan. Spacious, reliable, and unbeatable value for long-distance comfort.",
    features: ["Spacious trunk", "ABS + ESP", "Isofix mounts", "Manual AC", "Electric windows"],
  },
  {
    id: "dacia-sandero",
    name: "Sandero",
    brand: "Dacia",
    category: "Hatchback",
    pricePerDay: 320,
    image: sandero,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 170,
    technical: {
      engine: "1.0 SCe",
      power: "73 hp",
      consumption: "5.4 L/100 km",
      luggage: "328 L",
    },
    description: "The practical choice that never compromises. A versatile hatchback ready for city commutes and weekend getaways.",
    features: ["Generous boot space", "MediaNav system", "Rear bench fold", "Power steering", "Central locking"],
  },
  {
    id: "peugeot-208",
    name: "208",
    brand: "Peugeot",
    category: "Hatchback",
    pricePerDay: 450,
    image: peugeot208,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 215,
    technical: {
      engine: "1.2 PureTech",
      power: "130 hp",
      consumption: "5.4 L/100 km",
      luggage: "311 L",
    },
    description: "Bold French design meets advanced technology. The 208 turns every drive into a statement.",
    features: ["3D i-Cockpit", "Wireless charging", "Active safety brake", "Ambient lighting", "Panoramic roof"],
  },
  {
    id: "mercedes-a",
    name: "Class A",
    brand: "Mercedes-Benz",
    category: "Hatchback",
    pricePerDay: 790,
    image: mercA,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 230,
    technical: {
      engine: "1.3 Turbo",
      power: "163 hp",
      consumption: "6.0 L/100 km",
      luggage: "355 L",
    },
    description: "The entry to Mercedes luxury. A premium hatchback with a stunning interior and commanding road presence.",
    features: ["MBUX voice control", "Ambient lighting", "Dual-zone climate", "Blind spot assist", "Premium audio"],
  },
  {
    id: "mercedes-s",
    name: "Class S",
    brand: "Mercedes-Benz",
    category: "Luxury",
    pricePerDay: 1490,
    image: mercS,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 250,
    technical: {
      engine: "3.0 I6",
      power: "435 hp",
      consumption: "8.2 L/100 km",
      luggage: "550 L",
    },
    description: "The benchmark of automotive excellence. Arrive anywhere in Morocco with unmatched grace and presence.",
    features: ["Air suspension", "Massage seats", "Rear entertainment", "Night vision", "Burmester audio"],
  },
  {
    id: "ford-raptor",
    name: "Raptor",
    brand: "Ford",
    category: "Pickup",
    pricePerDay: 890,
    image: raptor,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 170,
    technical: {
      engine: "3.0 V6 EcoBoost",
      power: "288 hp",
      consumption: "11.5 L/100 km",
      luggage: "1564 L",
    },
    description: "Built for Morocco's diverse terrain. From Atlas mountains to Sahara dunes, the Raptor conquers all.",
    features: ["4WD terrain modes", "Fox suspension", "Trail control", "Towing package", "Off-road tyres"],
  },
  {
    id: "audi-rs3",
    name: "RS3",
    brand: "Audi",
    category: "Sports",
    pricePerDay: 1190,
    image: rs3,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 250,
    technical: {
      engine: "2.5 TFSI",
      power: "400 hp",
      consumption: "8.8 L/100 km",
      luggage: "282 L",
    },
    description: "A five-cylinder symphony of performance. The RS3 delivers track-honed thrills with everyday usability.",
    features: ["Quattro AWD", "Virtual cockpit", "Sport exhaust", "Carbon inlays", "Launch control"],
  },
  {
    id: "audi-a6",
    name: "A6",
    brand: "Audi",
    category: "Sedan",
    pricePerDay: 890,
    image: a6,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 245,
    technical: {
      engine: "2.0 TFSI",
      power: "245 hp",
      consumption: "7.0 L/100 km",
      luggage: "530 L",
    },
    description: "Executive elegance redefined. The A6 is the perfect companion for business trips across Morocco.",
    features: ["MMI touch response", "Matrix LED", "Four-zone climate", "Adaptive cruise", "Head-up display"],
  },
  {
    id: "audi-a8",
    name: "A8",
    brand: "Audi",
    category: "Luxury",
    pricePerDay: 1390,
    image: a8,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 250,
    technical: {
      engine: "3.0 TFSI",
      power: "340 hp",
      consumption: "8.0 L/100 km",
      luggage: "505 L",
    },
    description: "Flagship luxury that moves in silence. The A8 offers first-class travel for discerning passengers.",
    features: ["Predictive air suspension", "Rear relaxation seats", "Fragrance system", "Laser headlights", "Bang & Olufsen audio"],
  },
];

export const getCar = (id: string) => cars.find((c) => c.id === id);
