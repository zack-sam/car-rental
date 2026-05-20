import { useState } from "react";
import { useI18n, type Lang } from "@/i18n/I18nProvider";

const options: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

const LanguageGate = ({ onChosen }: { onChosen: () => void }) => {
  const { setLang, t } = useI18n();
  const [hover, setHover] = useState<Lang | null>(null);

  const choose = (l: Lang) => {
    setLang(l);
    onChosen();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6 animate-fade-up">
      <div className="absolute inset-0 bg-gradient-card opacity-60" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative max-w-2xl w-full text-center">
        <img src="/logo.svg" alt="Alaoui Car Rental logo" className="w-20 h-20 mx-auto object-contain mb-8" />
        <div className="font-mono-label text-primary mb-4">Alaoui Car Rental</div>
        <h1 className="font-display text-4xl md:text-6xl mb-3 text-balance">{t("lang.welcome")}</h1>
        <p className="text-muted-foreground mb-12">{t("lang.sub")}</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {options.map((o) => (
            <button
              key={o.code}
              onClick={() => choose(o.code)}
              onMouseEnter={() => setHover(o.code)}
              onMouseLeave={() => setHover(null)}
              dir={o.code === "ar" ? "rtl" : "ltr"}
              className={`group relative p-8 rounded-sm border transition-smooth text-center ${
                hover === o.code
                  ? "border-primary bg-secondary shadow-glow"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="font-display text-3xl mb-2">{o.native}</div>
              <div className="font-mono-label text-muted-foreground group-hover:text-primary transition-smooth">
                {o.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageGate;
