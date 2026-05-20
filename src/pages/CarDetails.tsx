import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Gauge, Users, Fuel, Cog } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useCurrency } from "@/lib/currency";
import { useFleet } from "@/lib/fleet";
import { getLocalizedCarDescription } from "@/lib/carContent";

const CarDetails = () => {
  const { t, lang } = useI18n();
  const { format } = useCurrency();
  const { id } = useParams();
  const cars = useFleet();
  const car = cars.find((item) => item.id === id);
  if (!car) return <Navigate to="/cars" replace />;
  const description = getLocalizedCarDescription(car, lang);
  const gallery = car.gallery?.length ? car.gallery : [car.image];

  const specs = [
    { icon: Users, label: t("details.specs.seats"), value: car.seats },
    { icon: Cog, label: t("details.specs.trans"), value: t(`trans.${car.transmission}`) },
    { icon: Fuel, label: t("details.specs.fuel"), value: t(`fuel.${car.fuel}`) },
    { icon: Gauge, label: t("details.specs.top"), value: `${car.topSpeed} km/h` },
  ];

  const technicalRows = [
    { label: t("details.specs.category"), value: t(`cat.${car.category}`) },
    { label: t("details.specs.seats"), value: String(car.seats) },
    { label: t("details.specs.trans"), value: t(`trans.${car.transmission}`) },
    { label: t("details.specs.fuel"), value: t(`fuel.${car.fuel}`) },
    { label: t("details.specs.top"), value: `${car.topSpeed} km/h` },
    { label: t("details.specs.engine"), value: car.technical.engine },
    { label: t("details.specs.power"), value: car.technical.power },
    { label: t("details.specs.consumption"), value: car.technical.consumption },
    { label: t("details.specs.luggage"), value: car.technical.luggage },
  ];

  return (
    <article className="container py-12 sm:py-16">
      <Link to="/cars" className="inline-flex items-center gap-2 font-mono-label text-muted-foreground hover:text-primary transition-smooth mb-10">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </Link>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-secondary shadow-elegant">
            <img src={car.image} alt={`${car.brand} ${car.name}`} width={1280} height={896} className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((image) => (
                <img key={image} src={image} alt={`${car.brand} ${car.name}`} className="aspect-[4/3] rounded-xl border border-border/70 object-cover" loading="lazy" />
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-2 lg:sticky lg:top-28 self-start space-y-8">
          <div>
            <div className="font-mono-label text-primary mb-3">{t(`cat.${car.category}`)} · {car.brand}</div>
            <h1 className="car-name-font text-5xl font-bold leading-[0.92] sm:text-6xl md:text-8xl">{car.name}</h1>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-border py-6">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <div>
                  <div className="font-mono-label text-muted-foreground text-[0.6rem]">{label}</div>
                  <div className="text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="font-mono-label text-primary mb-4">{t("common.included")}</div>
            <ul className="space-y-2">
              {car.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="editorial-card p-6">
            <div className="font-mono-label text-primary mb-5">{t("details.specs.title")}</div>
            <dl className="grid gap-3">
              {technicalRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-6 border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="text-sm text-foreground text-right rtl:text-left">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="editorial-card p-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="font-mono-label text-muted-foreground">{t("common.from")}</div>
                <div className="home-number-font text-3xl text-primary">{format(car.pricePerDay)}<span className="text-base text-muted-foreground">{t("common.day")}</span></div>
              </div>
            </div>
            <Link
              to={`/booking?car=${car.id}`}
              className="btn-primary w-full px-6 py-4 font-mono-label transition-smooth"
            >
              {t("details.reserve")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default CarDetails;
