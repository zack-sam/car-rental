import { Globe } from "lucide-react";
import { useI18n, type Lang } from "@/i18n/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const labels: Record<Lang, string> = { en: "EN", fr: "FR", ar: "AR" };
const natives: Record<Lang, string> = { en: "English", fr: "Français", ar: "العربية" };

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 font-mono-label text-foreground/70 hover:text-primary transition-smooth">
        <Globe className="w-4 h-4" />
        {labels[lang]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        {(["en", "fr", "ar"] as Lang[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className={`cursor-pointer ${lang === l ? "text-primary" : ""}`}
            dir={l === "ar" ? "rtl" : "ltr"}
          >
            {natives[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
