import { useI18n, type Lang } from "@/i18n/I18nProvider";

const localeMap: Record<Lang, string> = {
  en: "en-MA",
  fr: "fr-MA",
  ar: "ar-MA",
};

const currencyLabel: Record<Lang, string> = {
  en: "MAD",
  fr: "MAD",
  ar: "درهم",
};

export const useCurrency = () => {
  const { lang } = useI18n();
  const format = (amount: number) => {
    const num = new Intl.NumberFormat(localeMap[lang], {
      maximumFractionDigits: 0,
    }).format(amount);
    return `${num} ${currencyLabel[lang]}`;
  };
  return { format, label: currencyLabel[lang] };
};
