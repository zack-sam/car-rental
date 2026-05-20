import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Car } from "@/data/cars";
import { useI18n } from "@/i18n/I18nProvider";
import { useCurrency } from "@/lib/currency";

const CarCard = ({ car }: { car: Car }) => {
  const { t } = useI18n();
  const { format } = useCurrency();

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/65 bg-gradient-card shadow-[inset_0_1px_0_hsl(0_0%_100%/0.04)] hover:border-primary/45 transition-smooth"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          loading="lazy"
          width={1280}
          height={896}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono-label text-primary mb-2">{t(`cat.${car.category}`)}</div>
            <h3 className="car-name-font text-3xl font-bold leading-none">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.brand}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-smooth" />
        </div>
        <div className="mt-6 flex items-end justify-between border-t border-border/50 pt-4">
          <div>
            <div className="font-mono-label text-muted-foreground">{t("common.from")}</div>
            <div className="home-number-font text-2xl leading-none text-primary">
              {format(car.pricePerDay)}
              <span className="text-sm text-muted-foreground">{t("common.day")}</span>
            </div>
          </div>
          <div className="text-right rtl:text-left text-xs text-muted-foreground">
            <div>
              {car.seats} {t("common.seats")} · {t(`trans.${car.transmission}`)}
            </div>
            <div>
              {t(`fuel.${car.fuel}`)} · {car.topSpeed} km/h
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
