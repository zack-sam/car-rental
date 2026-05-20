import { ArrowRight, Calendar, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { CONTACT } from "@/lib/contact";

const Contact = () => {
  const { t } = useI18n();

  const cards = [
    {
      icon: MessageCircle,
      label: t("contact.whatsapp"),
      value: CONTACT.whatsapp,
      href: CONTACT.whatsappHref,
    },
    {
      icon: Mail,
      label: t("contact.email"),
      value: CONTACT.email,
      href: CONTACT.emailHref,
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: CONTACT.phone,
      href: CONTACT.phoneHref,
    },
    {
      icon: Instagram,
      label: t("contact.instagram"),
      value: CONTACT.instagram,
      href: CONTACT.instagramHref,
    },
  ];

  return (
    <div className="page-enter relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_15%_24%,hsl(var(--primary)/0.17),transparent_30%),radial-gradient(circle_at_88%_12%,hsl(0_0%_100%/0.07),transparent_22%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background)/0.94)_62%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-40 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="pointer-events-none absolute left-[-8rem] top-32 h-80 w-80 rounded-full border border-primary/15 bg-primary/[0.035] blur-[1px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-20 hidden h-[34rem] w-[34rem] rounded-full border border-white/10 md:block" />
      <div className="pointer-events-none absolute right-[-5rem] top-32 hidden h-[25rem] w-[25rem] rounded-full border border-primary/15 md:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] opacity-[0.07] [background-image:linear-gradient(115deg,transparent_0_43%,hsl(0_0%_100%)_43.3%,transparent_43.8%_56%,hsl(0_0%_100%)_56.4%,transparent_57%)] [background-size:260px_100%]" />

      <section className="container relative z-10 pt-16 sm:pt-24 pb-12 sm:pb-14">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-end">
          <div>
            <div className="eyebrow-pill font-mono-label mb-6">{t("contact.tag")}</div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-8xl max-w-4xl text-balance leading-[0.86]">
              {t("contact.title")}
            </h1>
            <p className="mt-7 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t("contact.sub")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {cards.map(({ icon: Icon, label, value, href }, index) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="editorial-card reveal-up group p-5 transition-smooth hover:border-primary/50 hover:bg-secondary/70"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <Icon className="w-5 h-5 text-primary mb-5" strokeWidth={1.5} />
                <div className="font-mono-label text-muted-foreground mb-2 group-hover:text-primary transition-smooth">
                  {label}
                </div>
                <div className="contact-ltr text-sm text-foreground break-words">{value}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container relative z-10 pb-20 sm:pb-28 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-72 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.09),transparent_62%)] blur-3xl" />
        <div className="order-2 space-y-6 lg:order-1">
          <div className="editorial-card p-7 reveal-up">
            <Calendar className="w-6 h-6 text-primary mb-6" strokeWidth={1.5} />
            <div className="font-mono-label text-primary mb-5">{t("contact.hours")}</div>
            <div className="space-y-4">
              <Row label={t("contact.hours.week")} value={t("contact.hours.weekTime")} />
              <Row label={t("contact.hours.sun")} value={t("contact.hours.sunTime")} />
            </div>
          </div>

          <div className="editorial-card p-7 reveal-up delay-100">
            <MapPin className="w-6 h-6 text-primary mb-6" strokeWidth={1.5} />
            <div className="font-mono-label text-primary mb-4">{t("contact.location")}</div>
            <p className="text-muted-foreground leading-relaxed">{t("contact.address")}</p>
          </div>
        </div>

        <a
          href={CONTACT.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative order-1 min-h-[360px] overflow-hidden rounded-2xl border border-border/70 bg-secondary reveal-up delay-200 sm:min-h-[440px] lg:order-2"
          aria-label={t("contact.mapPreview")}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_36%_36%,hsl(var(--primary)/0.18),transparent_26%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--background)))]" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(hsl(0_0%_100%/0.18)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.18)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="absolute left-[18%] top-[22%] h-24 w-24 rounded-full border border-primary/35" />
          <div className="absolute right-[18%] top-[34%] h-32 w-32 rounded-full border border-white/10" />
          <div className="absolute left-[28%] right-[18%] top-1/2 h-1 -translate-y-1/2 rotate-[-14deg] rounded-full bg-primary/45 shadow-glow" />
          <MapPin className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-full text-primary drop-shadow-[0_12px_24px_hsl(var(--primary)/0.35)]" strokeWidth={1.6} />
          <iframe
            title={t("contact.location")}
            src="https://www.google.com/maps?q=Boulevard%20Anfa%2C%20Casablanca%2C%20Morocco&output=embed"
            className="absolute inset-0 h-full w-full opacity-80 grayscale-[0.2] contrast-110 mix-blend-screen"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/75 to-transparent p-7 pt-24">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-5 py-4 text-sm font-medium backdrop-blur transition-smooth group-hover:text-primary">
              <ArrowRight className="w-4 h-4" />
              {t("contact.mapPreview")}
            </div>
          </div>
        </a>
      </section>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-6 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="contact-ltr font-medium text-foreground">{value}</span>
  </div>
);

export default Contact;
