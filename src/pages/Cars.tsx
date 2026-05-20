import { useMemo, useState } from "react";
import CarCard from "@/components/CarCard";
import { useI18n } from "@/i18n/I18nProvider";
import { useFleet } from "@/lib/fleet";

const categories = ["All", "Sedan", "Hatchback", "Luxury", "Pickup", "Sports"] as const;

const Cars = () => {
  const { t } = useI18n();
  const cars = useFleet();
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () => (filter === "All" ? cars : cars.filter((c) => c.category === filter)),
    [cars, filter],
  );

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/50">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_28%,hsl(var(--primary)/0.14),transparent_30%),radial-gradient(circle_at_82%_16%,hsl(0_0%_100%/0.06),transparent_24%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background)/0.92)_62%,hsl(var(--background))_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-40 bg-[linear-gradient(90deg,transparent,hsl(var(--primary)/0.14),transparent)] opacity-70 blur-3xl sm:block" />
        <div className="pointer-events-none absolute -right-28 top-16 z-0 hidden h-80 w-[42rem] rotate-[-12deg] rounded-full border border-primary/20 bg-primary/[0.03] blur-[1px] md:block" />
        <div className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-1/2 md:block">
          <div className="absolute right-[-7rem] top-24 h-[32rem] w-[32rem] rounded-full border border-white/10" />
          <div className="absolute right-[-3rem] top-32 h-[24rem] w-[24rem] rounded-full border border-primary/15" />
          <div className="absolute right-20 top-28 h-[18rem] w-[18rem] rounded-full bg-[conic-gradient(from_140deg,transparent,hsl(var(--primary)/0.16),transparent_38%)] opacity-80 blur-sm" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.055] [background-image:linear-gradient(115deg,transparent_0_42%,hsl(0_0%_100%)_42.3%,transparent_42.8%_57%,hsl(0_0%_100%)_57.4%,transparent_58%)] [background-size:240px_100%] sm:opacity-[0.08]" />

        <div className="container relative z-10 pt-16 sm:pt-24 pb-10 sm:pb-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
            <div>
              <div className="font-mono-label text-primary mb-4">{t("cars.tag")} &middot; {cars.length} {t("cars.cars")}</div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl max-w-4xl leading-[0.88] text-balance">{t("cars.title")}</h1>
              <p className="mt-7 text-lg text-muted-foreground max-w-xl leading-relaxed">{t("cars.sub")}</p>
            </div>

            <div className="glass-panel hidden rounded-2xl p-5 lg:block">
              <div className="font-mono-label text-primary">{t("fleet.tag")}</div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { value: cars.length, label: t("cars.cars") },
                  { value: categories.length - 1, label: t("details.specs.category") },
                  { value: filtered.length, label: t(`cat.${filter}`) },
                  { value: "24/7", label: t("contact.whatsapp") },
                ].map((item) => (
                  <div key={`${item.label}-${item.value}`} className="rounded-xl border border-border/60 bg-background/42 p-4">
                    <div className="home-number-font text-3xl leading-none text-foreground">{item.value}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono-label rounded-full border px-4 py-2 transition-smooth ${
                  filter === cat
                    ? "bg-gradient-amber text-primary-foreground border-transparent shadow-glow"
                    : "border-border/80 bg-card/50 text-muted-foreground hover:border-primary hover:text-foreground sm:backdrop-blur"
                }`}
              >
                {t(`cat.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10 sm:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{t("cars.empty")}</p>
        )}
      </section>
    </>
  );
};

export default Cars;
