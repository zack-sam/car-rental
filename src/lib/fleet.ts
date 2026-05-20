import { useEffect, useState } from "react";
import { cars as defaultCars, type Car } from "@/data/cars";

export type NewCarInput = {
  name: string;
  brand: string;
  category: Car["category"];
  pricePerDay: number;
  image?: string;
  gallery?: string[];
  seats: number;
  transmission: Car["transmission"];
  fuel: Car["fuel"];
  topSpeed: number;
};

const FLEET_KEY = "admin-fleet-cars";
const FLEET_EVENT = "fleet-updated";

export const fallbackCarImage = defaultCars[0].image;

export function getFleet(): Car[] {
  if (typeof window === "undefined") return defaultCars;
  const saved = localStorage.getItem(FLEET_KEY);
  if (!saved) return defaultCars;

  try {
    const parsed = JSON.parse(saved) as Car[];
    return parsed.length ? parsed : defaultCars;
  } catch {
    return defaultCars;
  }
}

export function getFleetCar(id: string) {
  return getFleet().find((car) => car.id === id);
}

export function saveFleet(cars: Car[]) {
  localStorage.setItem(FLEET_KEY, JSON.stringify(cars));
  window.dispatchEvent(new Event(FLEET_EVENT));
}

export function updateFleetCarPrice(carId: string, pricePerDay: number) {
  const updated = getFleet().map((car) => (car.id === carId ? { ...car, pricePerDay } : car));
  saveFleet(updated);
  return updated;
}

export function addFleetCar(input: NewCarInput) {
  const idBase = `${input.brand}-${input.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const existing = getFleet();
  const id = uniqueCarId(idBase || "new-car", existing);
  const created: Car = {
    id,
    name: input.name,
    brand: input.brand,
    category: input.category,
    pricePerDay: input.pricePerDay,
    image: input.image?.trim() || fallbackCarImage,
    gallery: input.gallery?.filter(Boolean),
    seats: input.seats,
    transmission: input.transmission,
    fuel: input.fuel,
    topSpeed: input.topSpeed,
    technical: {
      engine: "To update",
      power: "To update",
      consumption: "To update",
      luggage: "To update",
    },
    description: `${input.brand} ${input.name} is available for rental. Update this description from the codebase when you want richer public details.`,
    features: ["Air conditioning", "Bluetooth", "Clean interior", "Basic insurance"],
  };

  const updated = [...existing, created];
  saveFleet(updated);
  return created;
}

export function resetFleet() {
  saveFleet(defaultCars);
}

export function useFleet() {
  const [fleet, setFleet] = useState<Car[]>(() => getFleet());

  useEffect(() => {
    const refresh = () => setFleet(getFleet());
    window.addEventListener(FLEET_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(FLEET_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return fleet;
}

function uniqueCarId(base: string, fleet: Car[]) {
  const existing = new Set(fleet.map((car) => car.id));
  if (!existing.has(base)) return base;

  let index = 2;
  while (existing.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}
