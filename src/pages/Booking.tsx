import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AlertTriangle, CalendarDays, CarFront, Check, CheckCircle2, ChevronDown, Mail, MapPin, Phone, ReceiptText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/I18nProvider";
import { CONTACT } from "@/lib/contact";
import { useCurrency } from "@/lib/currency";
import { useFleet } from "@/lib/fleet";
import {
  addBooking,
  findConflict,
  getBookingData,
  getBookingsForCar,
  type AvailabilityRecord,
  type Booking as BookingRecord,
} from "@/lib/bookings";

const MOROCCO_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes",
  "Oujda", "Kenitra", "Tetouan", "Sale", "Mohammedia", "El Jadida", "Nador",
  "Beni Mellal", "Khouribga", "Safi", "Essaouira", "Ouarzazate", "Errachidia",
  "Taza", "Settat", "Larache", "Khemisset", "Guelmim", "Berrechid",
  "Taroudant", "Dakhla", "Laayoune", "Ifrane", "Chefchaouen", "Al Hoceima",
  "Tiznit", "Sidi Ifni", "Berkane", "Taourirt", "Sefrou", "Azrou",
  "Midelt", "Tan-Tan", "Zagora", "Fnideq", "Martil", "Asilah",
];

const MILEAGE_OPTIONS = [
  { value: "0-200", label: "0 - 200 km" },
  { value: "201-500", label: "201 - 500 km" },
  { value: "501-1000", label: "501 - 1000 km" },
  { value: "1001-2000", label: "1001 - 2000 km" },
  { value: "2000+", label: "2000+ km" },
];

const Booking = () => {
  const { t } = useI18n();
  const { format } = useCurrency();
  const cars = useFleet();
  const [params] = useSearchParams();
  const initialCar = params.get("car") ?? cars[0].id;
  const selectedCarId = cars.some((c) => c.id === initialCar) ? initialCar : cars[0].id;

  const [carId] = useState(selectedCarId);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [location, setLocation] = useState(MOROCCO_CITIES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mileage, setMileage] = useState("0-200");
  const [payment, setPayment] = useState("cash");
  const [hasLicense, setHasLicense] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const car = cars.find((c) => c.id === carId) ?? cars[0];
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let alive = true;
    setIsLoadingBookings(true);

    getBookingData()
      .then((loaded) => {
        if (alive) {
          setBookings(loaded.bookings);
          setAvailability(loaded.availability);
        }
      })
      .finally(() => {
        if (alive) setIsLoadingBookings(false);
      });

    return () => {
      alive = false;
    };
  }, [submitted]);

  const days = useMemo(() => {
    if (!pickup || !dropoff) return 0;
    const d = (new Date(dropoff).getTime() - new Date(pickup).getTime()) / 86400000;
    return Math.max(0, Math.round(d));
  }, [pickup, dropoff]);
  const total = days * car.pricePerDay;

  const carBookings = useMemo(() => getBookingsForCar(bookings, carId), [bookings, carId]);
  const conflict = useMemo(
    () => (pickup && dropoff && days > 0 ? findConflict(bookings, availability, carId, pickup, dropoff) : undefined),
    [bookings, availability, carId, pickup, dropoff, days],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoadingBookings || isSubmitting) return;

    if (days <= 0) {
      toast({ title: t("book.invalid.title"), description: t("book.invalid.desc") });
      return;
    }
    if (!hasLicense) {
      toast({ title: t("book.license.required.title"), description: t("book.license.required.desc") });
      return;
    }
    const conflictBooking = findConflict(bookings, availability, carId, pickup, dropoff);
    if (conflictBooking) {
      toast({
        title: t("book.unavailable.title"),
        description: t("book.unavailable.desc")
          .replace("{from}", conflictBooking.pickup)
          .replace("{to}", conflictBooking.dropoff),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addBooking({
        carId,
        carName: car.name,
        carBrand: car.brand,
        carCategory: car.category,
        pricePerDay: car.pricePerDay,
        pickup,
        dropoff,
        days,
        name,
        email,
        phone,
        location,
        mileage,
        payment,
        total,
        status: "Pending",
        licenseConfirmed: hasLicense,
      });
      setBookings((current) => [...current, created]);
      setSubmitted(true);
      const dayWord = days > 1 ? t("book.days_plural") : t("book.day");
      toast({ title: t("book.toast.title"), description: `${car.name} · ${days} ${dayWord} · ${location}` });
    } catch {
      toast({
        title: t("book.sync.error.title"),
        description: t("book.sync.error.desc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const dayWord = days > 1 ? t("book.days_plural") : t("book.day");
    return (
      <div className="container py-12 sm:py-16 md:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          <section className="space-y-8 reveal-up">
            <div className="eyebrow-pill font-mono-label">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-amber">
                <Check className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-sm">{t("book.success.badge")}</span>
            </div>

            <div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[0.86] mb-5">{t("book.success.title")}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("book.success.message")
                  .replace("{car}", `${car.brand} ${car.name}`)
                  .replace("{email}", email)}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <SuccessStep number="1" title={t("book.success.step1.title")} body={t("book.success.step1.body")} />
              <SuccessStep number="2" title={t("book.success.step2.title")} body={t("book.success.step2.body")} />
              <SuccessStep number="3" title={t("book.success.step3.title")} body={t("book.success.step3.body")} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={CONTACT.phoneHref} className="btn-primary px-6 py-3 font-mono-label transition-smooth">
                <Phone className="h-4 w-4" />
                {t("book.success.callBtn")}
              </a>
              <Link to="/cars" className="btn-secondary px-6 py-3 font-mono-label transition-smooth">
                <CarFront className="h-4 w-4" />
                {t("book.success.moreCarsBtn")}
              </Link>
            </div>
          </section>

          <aside className="editorial-card p-5 md:p-6 reveal-up">
            <div className="flex items-start gap-4 border-b border-border pb-5 mb-5">
              <img src={car.image} alt={car.name} className="h-24 w-32 rounded-sm object-cover" loading="lazy" />
              <div className="min-w-0">
                <div className="font-mono-label text-primary mb-1">{t("book.success.summary")}</div>
                <h2 className="car-name-font text-3xl font-bold leading-tight">{car.name}</h2>
                <p className="text-sm text-muted-foreground">{car.brand} · {t(`cat.${car.category}`)}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <SummaryRow icon={<CalendarDays className="h-4 w-4" />} label={t("book.pickup")} value={pickup} />
              <SummaryRow icon={<CalendarDays className="h-4 w-4" />} label={t("book.dropoff")} value={dropoff} />
              <SummaryRow icon={<ReceiptText className="h-4 w-4" />} label={t("book.days")} value={`${days} ${dayWord}`} />
              <SummaryRow icon={<MapPin className="h-4 w-4" />} label={t("book.city")} value={location} />
              <SummaryRow icon={<Mail className="h-4 w-4" />} label={t("book.email")} value={email} />
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>{t("book.rate")}</span>
                <span className="text-foreground">{format(car.pricePerDay)}{t("common.day")}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono-label text-muted-foreground">{t("common.total")}</span>
                <span className="home-number-font text-3xl text-primary">{format(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-primary/25 bg-primary/10 p-4 text-sm text-muted-foreground">
              <span className="text-foreground">{t("book.success.contactTitle")}</span> {t("book.success.contactDesc")}
              <div className="mt-3 flex flex-col gap-2 text-foreground">
                <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" /><span className="contact-ltr">{CONTACT.phone}</span></a>
                <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4 text-primary" /><span className="contact-ltr">{CONTACT.email}</span></a>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" />WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden py-10 sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,hsl(var(--primary)/0.16),transparent_28%),radial-gradient(circle_at_84%_18%,hsl(0_0%_100%/0.07),transparent_24%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background)/0.94)_58%,hsl(var(--background))_100%)]" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full border border-primary/15 bg-primary/[0.035] blur-[1px]" />
      <div className="absolute right-[-10rem] top-8 hidden h-[34rem] w-[34rem] rounded-full border border-white/10 md:block" />
      <div className="absolute right-[-5rem] top-20 hidden h-[25rem] w-[25rem] rounded-full border border-primary/15 md:block" />
      <div className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-0 opacity-[0.075] [background-image:linear-gradient(115deg,transparent_0_43%,hsl(0_0%_100%)_43.3%,transparent_43.8%_56%,hsl(0_0%_100%)_56.4%,transparent_57%)] [background-size:260px_100%]" />

      <div className="container relative">
      <div className="eyebrow-pill font-mono-label mb-6">{t("book.tag")}</div>
      <h1 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[0.86] mb-10 sm:mb-14">{t("book.title")}</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="editorial-card flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 reveal-up">
            <div className="flex items-center gap-4">
              <img src={car.image} alt={car.name} className="w-24 h-16 object-cover rounded-sm" loading="lazy" />
              <div>
                <div className="font-mono-label text-primary mb-1">{t("book.choose")}</div>
                <div className="car-name-font text-2xl font-bold leading-tight">{car.name}</div>
                <div className="text-sm text-muted-foreground">{car.brand} · {format(car.pricePerDay)}{t("common.day")}</div>
              </div>
            </div>
            <Link to="/cars" className="btn-secondary px-5 py-3 font-mono-label transition-smooth">
              {t("fleet.viewAll")}
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label={t("book.pickup")}>
              <DateField value={pickup} min={today} onChange={setPickup} label={t("book.pickup")} />
            </Field>
            <Field label={t("book.dropoff")}>
              <DateField value={dropoff} min={pickup || today} onChange={setDropoff} label={t("book.dropoff")} />
            </Field>
          </div>

          {pickup && dropoff && days > 0 && (
            conflict ? (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive p-4 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {t("book.unavailable.desc")
                    .replace("{from}", conflict.pickup)
                    .replace("{to}", conflict.dropoff)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 text-primary p-4 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t("book.available.ok")}</span>
              </div>
            )
          )}

          {carBookings.length > 0 && (
            <div className="editorial-card p-4">
              <div className="font-mono-label text-muted-foreground mb-3 text-xs">
                {t("book.unavailable.list")} — {car.name}
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {carBookings.map((b) => (
                  <li key={b.id} className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
                    {b.pickup} → {b.dropoff}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Field label={t("book.city")}>
            <ThemedSelect value={location} onChange={setLocation} options={MOROCCO_CITIES.map((city) => ({ value: city, label: city }))} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label={t("book.name")}>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Ahmed Alaoui" />
            </Field>
            <Field label={t("book.email")}>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="jane@studio.com" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label={t("book.phone")}>
              <input required type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field contact-ltr" placeholder="+212 6 12 34 56 78" pattern="[0-9+\s\-]{8,20}" />
            </Field>
            <Field label={t("book.mileage")}>
              <ThemedSelect value={mileage} onChange={setMileage} options={MILEAGE_OPTIONS} />
            </Field>
          </div>

          <Field label={t("book.payment")}>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { value: "cash", label: t("book.pay.cash") },
                { value: "tpe", label: t("book.pay.tpe") },
                { value: "transfer", label: t("book.pay.transfer") },
              ].map((p) => (
                <label key={p.value} className={`cursor-pointer rounded-xl border p-4 text-sm text-center transition-smooth ${payment === p.value ? "border-primary bg-secondary text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                  <input type="radio" name="payment" className="sr-only" checked={payment === p.value} onChange={() => setPayment(p.value)} />
                  {p.label}
                </label>
              ))}
            </div>
          </Field>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasLicense}
              onChange={(e) => setHasLicense(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary cursor-pointer"
            />
            <span className="text-sm text-foreground">{t("book.license")}</span>
          </label>
        </div>

        <aside className="lg:sticky lg:top-28 self-start">
          <div className="editorial-card p-6">
            <img src={car.image} alt={car.name} className="w-full aspect-[4/3] object-cover rounded-sm mb-6" loading="lazy" />
            <div className="font-mono-label text-primary mb-1">{t(`cat.${car.category}`)}</div>
            <h3 className="car-name-font text-3xl font-bold">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.brand}</p>

            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <Row label={t("book.rate")} value={format(car.pricePerDay)} />
              <Row label={t("book.days")} value={String(days || "-")} />
              <Row label={t("book.insurance")} value={t("common.included")} />
              <Row label={t("book.delivery")} value={t("common.included")} />
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-baseline justify-between">
              <span className="font-mono-label text-muted-foreground">{t("common.total")}</span>
              <span className="home-number-font text-2xl text-primary">{format(total)}</span>
            </div>

            <button
              type="submit"
              disabled={!!conflict || isLoadingBookings || isSubmitting}
              className="btn-primary mt-6 w-full px-6 py-4 font-mono-label transition-smooth disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {conflict
                ? t("book.unavailable.title")
                : isSubmitting
                  ? t("book.sync.submitting")
                  : t("book.confirm")}
            </button>
          </div>
        </aside>
      </form>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: hsl(var(--input) / 0.78);
          border: 1px solid hsl(var(--border) / 0.86);
          color: hsl(var(--foreground));
          padding: 0.875rem 1rem;
          border-radius: 0.85rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: hsl(var(--primary)); }
        .select-shell {
          position: relative;
          border-radius: 0.95rem;
          background:
            linear-gradient(hsl(var(--input) / 0.86), hsl(var(--input) / 0.86)) padding-box,
            linear-gradient(135deg, hsl(var(--primary) / 0.58), hsl(var(--border) / 0.65)) border-box;
          border: 1px solid transparent;
          box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.04);
        }
        .select-field {
          width: 100%;
          min-height: 3.35rem;
          appearance: none;
          border: 0;
          background: transparent;
          color: hsl(var(--foreground));
          padding: 0.875rem 3rem 0.875rem 1rem;
          font-size: 0.95rem;
          outline: none;
        }
        .select-field option {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
        }
        .select-icon {
          pointer-events: none;
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--primary));
        }
        [dir="rtl"] .select-field {
          padding-left: 3rem;
          padding-right: 1rem;
        }
        [dir="rtl"] .select-icon {
          left: 1rem;
          right: auto;
        }
        .date-field {
          position: relative;
          width: 100%;
        }
        .date-trigger {
          width: 100%;
          min-height: 3.35rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border: 1px solid hsl(var(--border) / 0.86);
          border-radius: 0.85rem;
          background: linear-gradient(180deg, hsl(var(--card) / 0.72), hsl(var(--background) / 0.72));
          color: hsl(var(--foreground));
          padding: 0.875rem 1rem;
          text-align: start;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
        }
        .date-trigger:hover,
        .date-trigger:focus-visible,
        .date-trigger.is-open {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 1px hsl(var(--primary) / 0.2), 0 16px 40px -28px hsl(var(--primary));
        }
        .date-trigger-placeholder {
          color: hsl(var(--muted-foreground));
        }
        .date-field-icon {
          color: hsl(var(--primary));
          flex: 0 0 auto;
        }
        .date-popover {
          position: absolute;
          z-index: 70;
          top: calc(100% + 0.75rem);
          inset-inline-start: 0;
          width: min(22rem, calc(100vw - 2rem));
          border: 1px solid hsl(var(--primary) / 0.35);
          border-radius: 1rem;
          background: linear-gradient(160deg, hsl(var(--card)), hsl(var(--background)));
          box-shadow: 0 28px 80px -35px hsl(0 0% 0% / 0.9), 0 0 0 1px hsl(var(--border));
          padding: 1rem;
          transform-origin: top;
          animation: calendar-pop 0.18s ease-out both;
        }
        .date-popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .date-month-label {
          font-family: 'Sora', sans-serif;
          font-size: 1rem;
          color: hsl(var(--foreground));
        }
        .date-nav {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .date-nav button {
          width: 2.25rem;
          height: 2.25rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid hsl(var(--border));
          border-radius: 0.7rem;
          color: hsl(var(--muted-foreground));
          background: hsl(var(--background) / 0.55);
        }
        .date-nav button:hover {
          color: hsl(var(--primary));
          border-color: hsl(var(--primary) / 0.45);
        }
        .date-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.35rem;
        }
        .date-weekday {
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--muted-foreground));
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .date-day {
          aspect-ratio: 1;
          min-width: 0;
          border: 1px solid transparent;
          border-radius: 0.7rem;
          color: hsl(var(--foreground));
          background: transparent;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .date-day:hover:not(:disabled) {
          border-color: hsl(var(--primary) / 0.45);
          background: hsl(var(--primary) / 0.12);
          color: hsl(var(--primary));
        }
        .date-day.is-outside {
          color: hsl(var(--muted-foreground) / 0.45);
        }
        .date-day.is-today {
          border-color: hsl(var(--primary) / 0.35);
        }
        .date-day.is-selected {
          background: var(--gradient-amber);
          color: hsl(var(--primary-foreground));
          box-shadow: 0 12px 30px -18px hsl(var(--primary));
        }
        .date-day:disabled {
          cursor: not-allowed;
          color: hsl(var(--muted-foreground) / 0.25);
          text-decoration: line-through;
        }
        .date-popover-footer {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          border-top: 1px solid hsl(var(--border));
          margin-top: 1rem;
          padding-top: 0.85rem;
        }
        .date-popover-footer button {
          color: hsl(var(--primary));
          font-size: 0.8rem;
          font-weight: 700;
        }
        @keyframes calendar-pop {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="font-mono-label text-primary block mb-3">{label}</span>
    {children}
  </label>
);

const ThemedSelect = ({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) => (
  <div className="select-shell">
    <select value={value} onChange={(event) => onChange(event.target.value)} className="select-field">
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <ChevronDown className="select-icon h-4 w-4" />
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-muted-foreground">
    <span>{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);

const DateField = ({
  value,
  min,
  onChange,
  label,
}: {
  value: string;
  min: string;
  onChange: (value: string) => void;
  label: string;
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(value ? fromISO(value) : fromISO(min)));

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    setVisibleMonth(monthStart(value ? fromISO(value) : fromISO(min)));
  }, [min, value]);

  const minDate = fromISO(min);
  const selectedDate = value ? fromISO(value) : undefined;
  const days = getCalendarDays(visibleMonth);

  const selectDate = (date: Date) => {
    const next = toISO(date);
    if (next < min) return;
    onChange(next);
    setIsOpen(false);
  };

  return (
    <div className="date-field" ref={wrapperRef}>
      <button
        type="button"
        className={`date-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={label}
        aria-expanded={isOpen}
      >
        <span className={value ? "" : "date-trigger-placeholder"}>
          {value ? formatDateLabel(fromISO(value)) : label}
        </span>
        <CalendarDays className="date-field-icon h-5 w-5" />
      </button>

      {isOpen && (
        <div className="date-popover" role="dialog" aria-label={label}>
          <div className="date-popover-header">
            <div className="date-month-label">{formatMonthLabel(visibleMonth)}</div>
            <div className="date-nav">
              <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))} aria-label="Previous month">
                <span aria-hidden="true">‹</span>
              </button>
              <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))} aria-label="Next month">
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>

          <div className="date-grid">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <div key={day} className="date-weekday">{day}</div>
            ))}
            {days.map((date) => {
              const iso = toISO(date);
              const isOutside = date.getMonth() !== visibleMonth.getMonth();
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              const isToday = isSameDay(date, new Date());
              const isDisabled = iso < toISO(minDate);

              return (
                <button
                  type="button"
                  key={iso}
                  disabled={isDisabled}
                  onClick={() => selectDate(date)}
                  className={`date-day ${isOutside ? "is-outside" : ""} ${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="date-popover-footer">
            <button type="button" onClick={() => onChange("")}>Clear</button>
            <button type="button" onClick={() => selectDate(minDate)}>Earliest</button>
          </div>
        </div>
      )}
    </div>
  );
};

function fromISO(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarDays(month: Date) {
  const first = monthStart(month);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

const SuccessStep = ({ number, title, body }: { number: string; title: string; body: string }) => (
  <div className="rounded-sm border border-border bg-card/50 p-4">
    <div className="font-mono-label text-primary mb-3">{number}</div>
    <div className="font-display text-xl mb-1">{title}</div>
    <p className="text-sm text-muted-foreground">{body}</p>
  </div>
);

const SummaryRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 rounded-sm border border-border/70 bg-background/35 px-3 py-3">
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
    <span className="text-right text-foreground font-medium break-words">{value || "-"}</span>
  </div>
);

export default Booking;
