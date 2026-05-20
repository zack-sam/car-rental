import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Gauge, MapPin, Shield, Sparkles, KeyRound } from "lucide-react";
import CarCard from "@/components/CarCard";
import { useI18n } from "@/i18n/I18nProvider";
import { useFleet } from "@/lib/fleet";

const Home = () => {
  const { t } = useI18n();
  const cars = useFleet();
  const showcaseCar = cars[8] ?? cars[0];
  const featuredCars = cars.slice(0, 3);

  return (
    <>
      <section className="relative -mt-24 min-h-[92svh] overflow-hidden sm:-mt-20">
        <img
          src="/media/car-rental-background.gif"
          alt="Spinning luxury car wheel"
          width={426}
          height={240}
          className="home-hero-gif"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background)/0.86)_34%,hsl(var(--background)/0.34)_72%,hsl(var(--background)/0.64)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="container relative z-10 flex min-h-[92svh] items-center pt-14">
          <div className="max-w-3xl animate-fade-up">
            <div className="eyebrow-pill font-mono-label mb-8">{t("hero.tag")} <ArrowRight className="h-3.5 w-3.5 text-primary" /></div>
            <h1 className="hero-headline-font text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.86] text-balance">
              {t("hero.title1")} <em className="text-primary not-italic">{t("hero.title2")}</em>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">{t("hero.sub")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/cars" className="btn-primary px-6 py-4 sm:px-8 font-mono-label transition-smooth">
                {t("hero.cta1")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/booking" className="btn-secondary px-6 py-4 sm:px-8 font-mono-label transition-smooth">
                {t("hero.cta2")}
              </Link>
            </div>
            <div className="mt-10 sm:mt-14 grid grid-cols-3 max-w-xl border-y border-foreground/15 divide-x divide-foreground/15">
              {[
                { value: t("home.showcase.s1"), label: t("home.showcase.s1l") },
                { value: t("home.showcase.s2"), label: t("home.showcase.s2l") },
                { value: t("home.showcase.s3"), label: t("home.showcase.s3l") },
              ].map((stat) => (
                <div key={stat.label} className="py-5 px-4 first:pl-0">
                  <div className="home-number-font text-2xl md:text-3xl text-primary">{stat.value}</div>
                  <div className="mt-1 text-xs text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-24 grid md:grid-cols-4 gap-5 border-b border-border/50 page-enter">
        {[
          { icon: Sparkles, label: t("phil.curated"), text: t("phil.curatedT") },
          { icon: KeyRound, label: t("phil.door"), text: t("phil.doorT") },
          { icon: Shield, label: t("phil.allin"), text: t("phil.allinT") },
          { icon: Calendar, label: t("phil.flex"), text: t("phil.flexT") },
        ].map(({ icon: Icon, label, text }, index) => (
          <div key={label} className="editorial-card space-y-3 p-6 reveal-up" style={{ animationDelay: `${index * 90}ms` }}>
            <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div className="font-mono-label text-primary">{label}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      <section className="container py-16 sm:py-24 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-center border-b border-border/50">
        <div className="reveal-up">
          <div className="font-mono-label text-primary mb-4">{t("home.showcase.tag")}</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.9] text-balance">{t("home.showcase.title")}</h2>
          <p className="mt-7 text-muted-foreground leading-relaxed max-w-xl">{t("home.showcase.body")}</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Gauge, label: t("home.showcase.s1l"), value: t("home.showcase.s1") },
              { icon: Shield, label: t("home.showcase.s2l"), value: t("home.showcase.s2") },
              { icon: MapPin, label: t("home.showcase.s3l"), value: t("home.showcase.s3") },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="editorial-card p-5">
                <Icon className="w-5 h-5 text-primary mb-5" strokeWidth={1.5} />
                <div className="home-number-font text-2xl text-foreground">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border/70 shadow-elegant reveal-up delay-150">
          <img src={showcaseCar.image} alt={`${showcaseCar.brand} ${showcaseCar.name}`} className="aspect-[16/11] w-full object-cover image-drift" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-7 pt-24">
            <div className="font-mono-label text-primary mb-2">{showcaseCar.brand}</div>
            <div className="car-name-font text-5xl font-bold leading-none">{showcaseCar.name}</div>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="font-mono-label text-primary mb-3">{t("fleet.tag")}</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl leading-none">{t("fleet.title")}</h2>
          </div>
          <Link to="/cars" className="hidden md:inline-flex items-center gap-2 font-mono-label hover:text-primary transition-smooth">
            {t("fleet.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((c, index) => (
            <div key={c.id} className="reveal-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CarCard car={c} />
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="editorial-card relative overflow-hidden p-6 sm:p-12 md:p-20 reveal-up">
          <div className="relative max-w-2xl">
            <div className="font-mono-label text-primary mb-4">{t("cta.tag")}</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-none">{t("cta.title")}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t("cta.sub")}</p>
            <Link to="/booking" className="btn-primary px-6 py-4 sm:px-8 font-mono-label transition-smooth">
              {t("cta.btn")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
