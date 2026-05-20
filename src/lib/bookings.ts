export type Booking = {
  id: string;
  carId: string;
  carName?: string;
  carBrand?: string;
  carCategory?: string;
  pricePerDay?: number;
  pickup: string;
  dropoff: string;
  days?: number;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  mileage?: string;
  payment?: string;
  total?: number;
  status?: string;
  licenseConfirmed?: boolean;
  createdAt: string;
};

export type BookingInput = Omit<Booking, "id" | "createdAt">;

export type AvailabilityRecord = {
  carId: string;
  quantity: number;
  status: string;
};

export type BookingData = {
  bookings: Booking[];
  availability: AvailabilityRecord[];
};

const KEY = "bookings";
const ENDPOINT = import.meta.env.VITE_RESERVATIONS_SHEET_ENDPOINT as string | undefined;

const seed: Booking[] = [
  { id: "seed-1", carId: "clio-5", pickup: addDays(2), dropoff: addDays(5), createdAt: new Date().toISOString() },
  { id: "seed-2", carId: "mercedes-s", pickup: addDays(1), dropoff: addDays(8), createdAt: new Date().toISOString() },
  { id: "seed-3", carId: "audi-rs3", pickup: addDays(4), dropoff: addDays(10), createdAt: new Date().toISOString() },
  { id: "seed-4", carId: "ford-raptor", pickup: addDays(0), dropoff: addDays(3), createdAt: new Date().toISOString() },
];

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function createLocalBooking(b: BookingInput): Booking {
  return {
    ...b,
    id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
}

function normalizeBooking(raw: Partial<Booking>): Booking | undefined {
  if (!raw.carId || !raw.pickup || !raw.dropoff) return undefined;

  return {
    id: String(raw.id || `sheet-${raw.carId}-${raw.pickup}-${raw.dropoff}`),
    carId: String(raw.carId),
    carName: raw.carName ? String(raw.carName) : undefined,
    carBrand: raw.carBrand ? String(raw.carBrand) : undefined,
    carCategory: raw.carCategory ? String(raw.carCategory) : undefined,
    pricePerDay: typeof raw.pricePerDay === "number" ? raw.pricePerDay : Number(raw.pricePerDay || 0) || undefined,
    pickup: String(raw.pickup),
    dropoff: String(raw.dropoff),
    days: typeof raw.days === "number" ? raw.days : Number(raw.days || 0) || undefined,
    name: raw.name ? String(raw.name) : undefined,
    email: raw.email ? String(raw.email) : undefined,
    phone: raw.phone ? String(raw.phone) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    mileage: raw.mileage ? String(raw.mileage) : undefined,
    payment: raw.payment ? String(raw.payment) : undefined,
    total: typeof raw.total === "number" ? raw.total : Number(raw.total || 0) || undefined,
    status: raw.status ? String(raw.status) : undefined,
    licenseConfirmed: raw.licenseConfirmed === true || String(raw.licenseConfirmed).toLowerCase() === "true",
    createdAt: raw.createdAt ? String(raw.createdAt) : new Date().toISOString(),
  };
}

function normalizeAvailability(raw: Partial<AvailabilityRecord>): AvailabilityRecord | undefined {
  if (!raw.carId) return undefined;
  return {
    carId: String(raw.carId),
    quantity: Math.max(0, Number(raw.quantity || 0)),
    status: String(raw.status || "Indisponible"),
  };
}

function getLocalBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

function saveLocalBooking(b: Booking): Booking {
  if (typeof window === "undefined") return b;
  const all = getLocalBookings();
  all.push(b);
  localStorage.setItem(KEY, JSON.stringify(all));
  return b;
}

function fetchJsonp(url: string): Promise<BookingData> {
  return new Promise((resolve, reject) => {
    const callbackName = `__bookings_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Reservation sheet request timed out"));
    }, 10000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as Window & Record<string, unknown>)[callbackName];
    };

    (window as Window & Record<string, unknown>)[callbackName] = (payload: { bookings?: Partial<Booking>[]; availability?: Partial<AvailabilityRecord>[] }) => {
      cleanup();
      resolve({
        bookings: (payload.bookings || []).map(normalizeBooking).filter(Boolean) as Booking[],
        availability: (payload.availability || []).map(normalizeAvailability).filter(Boolean) as AvailabilityRecord[],
      });
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Reservation sheet request failed"));
    };

    script.src = `${url}${separator}callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

function sendJsonp(url: string, params: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const callbackName = `__reservation_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const search = new URLSearchParams({ ...params, callback: callbackName });
    const separator = url.includes("?") ? "&" : "?";
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Reservation sheet save timed out"));
    }, 10000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as Window & Record<string, unknown>)[callbackName];
    };

    (window as Window & Record<string, unknown>)[callbackName] = (payload: { ok?: boolean; error?: string }) => {
      cleanup();
      if (payload.ok) {
        resolve();
      } else {
        reject(new Error(payload.error || "Reservation sheet save failed"));
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Reservation sheet save failed"));
    };

    script.src = `${url}${separator}${search.toString()}`;
    document.body.appendChild(script);
  });
}

export function isSheetConfigured() {
  return !!ENDPOINT;
}

export async function getBookings(): Promise<Booking[]> {
  return (await getBookingData()).bookings;
}

export async function getBookingData(): Promise<BookingData> {
  const fallback = { bookings: getLocalBookings(), availability: [] };
  if (!ENDPOINT || typeof document === "undefined") return fallback;
  try {
    return await fetchJsonp(ENDPOINT);
  } catch {
    return fallback;
  }
}

export function getBookingsForCar(bookings: Booking[], carId: string): Booking[] {
  return bookings.filter((b) => b.carId === carId);
}

export function getAvailabilityForCar(availability: AvailabilityRecord[], carId: string): AvailabilityRecord {
  return availability.find((item) => item.carId === carId) ?? {
    carId,
    quantity: 1,
    status: "Disponible",
  };
}

export async function addBooking(b: BookingInput): Promise<Booking> {
  const created = createLocalBooking(b);

  if (ENDPOINT) {
    const body = new URLSearchParams({ action: "createReservation" });
    Object.entries(created).forEach(([key, value]) => {
      if (value !== undefined) body.set(key, String(value));
    });

    if (typeof document === "undefined") {
      await fetch(ENDPOINT, { method: "POST", body });
    } else {
      await sendJsonp(ENDPOINT, Object.fromEntries(body.entries()));
    }
  }

  return saveLocalBooking(created);
}

function isAvailableStatus(status: string) {
  return ["disponible", "available", "oui", "yes"].includes(status.trim().toLowerCase());
}

function overlaps(booking: Booking, pickup: string, dropoff: string) {
  return pickup < booking.dropoff && booking.pickup < dropoff;
}

export function isRangeAvailable(bookings: Booking[], availability: AvailabilityRecord[], carId: string, pickup: string, dropoff: string): boolean {
  if (!pickup || !dropoff) return false;
  const control = getAvailabilityForCar(availability, carId);
  if (!isAvailableStatus(control.status) || control.quantity <= 0) return false;
  return getBookingsForCar(bookings, carId).filter((b) => overlaps(b, pickup, dropoff)).length < control.quantity;
}

export function findConflict(bookings: Booking[], availability: AvailabilityRecord[], carId: string, pickup: string, dropoff: string): Booking | undefined {
  if (!pickup || !dropoff) return undefined;
  const control = getAvailabilityForCar(availability, carId);
  if (!isAvailableStatus(control.status) || control.quantity <= 0) {
    return {
      id: `availability-${carId}`,
      carId,
      pickup,
      dropoff,
      name: control.status,
      createdAt: new Date().toISOString(),
    };
  }

  const overlapping = getBookingsForCar(bookings, carId).filter((b) => overlaps(b, pickup, dropoff));
  return overlapping.length >= control.quantity ? overlapping[0] : undefined;
}
