import type { Lang } from "@/i18n/I18nProvider";
import type { Car } from "@/data/cars";

const carDescriptions: Record<Lang, Record<string, string>> = {
  en: {
    "clio-5": "A nimble city hatchback with sharp lines and modern tech. Perfect for navigating Moroccan streets with style and efficiency.",
    "opel-corsa": "Compact, efficient, and surprisingly refined. The Corsa brings German engineering to everyday Moroccan driving.",
    "dacia-logan": "Morocco's favorite sedan. Spacious, reliable, and unbeatable value for long-distance comfort.",
    "dacia-sandero": "The practical choice that never compromises. A versatile hatchback ready for city commutes and weekend getaways.",
    "peugeot-208": "Bold French design meets advanced technology. The 208 turns every drive into a statement.",
    "mercedes-a": "The entry to Mercedes luxury. A premium hatchback with a stunning interior and commanding road presence.",
    "mercedes-s": "The benchmark of automotive excellence. Arrive anywhere in Morocco with unmatched grace and presence.",
    "ford-raptor": "Built for Morocco's diverse terrain. From Atlas mountains to Sahara dunes, the Raptor conquers all.",
    "audi-rs3": "A five-cylinder symphony of performance. The RS3 delivers track-honed thrills with everyday usability.",
    "audi-a6": "Executive elegance redefined. The A6 is the perfect companion for business trips across Morocco.",
    "audi-a8": "Flagship luxury that moves in silence. The A8 offers first-class travel for discerning passengers.",
  },
  fr: {
    "clio-5": "Une citadine agile aux lignes modernes et aux technologies pratiques. Parfaite pour circuler dans les rues marocaines avec style et efficacité.",
    "opel-corsa": "Compacte, efficace et étonnamment raffinée. La Corsa apporte l'ingénierie allemande à la conduite quotidienne au Maroc.",
    "dacia-logan": "La berline préférée au Maroc. Spacieuse, fiable et très avantageuse pour les longs trajets confortables.",
    "dacia-sandero": "Le choix pratique sans compromis. Une citadine polyvalente prête pour les trajets urbains et les week-ends.",
    "peugeot-208": "Un design français affirmé avec une technologie avancée. La 208 transforme chaque trajet en vraie présence.",
    "mercedes-a": "L'entrée dans l'univers Mercedes. Une compacte premium avec un bel intérieur et une présence forte sur la route.",
    "mercedes-s": "La référence du luxe automobile. Arrivez partout au Maroc avec élégance, confort et présence.",
    "ford-raptor": "Conçu pour les terrains variés du Maroc. Des montagnes de l'Atlas aux pistes du Sahara, le Raptor avance avec assurance.",
    "audi-rs3": "Une performance cinq cylindres au caractère unique. La RS3 offre des sensations sportives tout en restant utilisable au quotidien.",
    "audi-a6": "L'élégance exécutive revisitée. L'A6 est idéale pour les déplacements professionnels à travers le Maroc.",
    "audi-a8": "Un luxe haut de gamme qui roule dans le silence. L'A8 offre un voyage de première classe aux passagers exigeants.",
  },
  ar: {
    "clio-5": "سيارة مدينة خفيفة بخطوط عصرية وتقنيات عملية. مناسبة للتنقل في شوارع المغرب بأناقة وكفاءة.",
    "opel-corsa": "سيارة مدمجة واقتصادية ومريحة أكثر مما تتوقع. تقدم كورسا جودة ألمانية للقيادة اليومية في المغرب.",
    "dacia-logan": "واحدة من أكثر السيارات العملية في المغرب. واسعة وموثوقة وبقيمة ممتازة للرحلات الطويلة.",
    "dacia-sandero": "اختيار عملي بدون تعقيد. سيارة متعددة الاستعمالات مناسبة للتنقل داخل المدينة ونهاية الأسبوع.",
    "peugeot-208": "تصميم فرنسي جريء مع تقنيات حديثة. تجعل 208 كل رحلة أكثر حضورا وتميزا.",
    "mercedes-a": "مدخل أنيق إلى عالم مرسيدس. هاتشباك فاخرة بمقصورة جميلة وحضور قوي على الطريق.",
    "mercedes-s": "معيار الفخامة في عالم السيارات. تصل بها إلى أي مكان في المغرب براحة وأناقة وحضور.",
    "ford-raptor": "مصممة لتنوع طرق المغرب. من جبال الأطلس إلى مسارات الصحراء، رابتور جاهزة للمغامرة.",
    "audi-rs3": "أداء رياضي بمحرك خماسي الأسطوانات وشخصية قوية. تمنح RS3 متعة قيادة عالية مع استعمال يومي مريح.",
    "audi-a6": "أناقة تنفيذية بتجربة قيادة راقية. A6 خيار مناسب لرحلات العمل والتنقل بين المدن المغربية.",
    "audi-a8": "فخامة رائدة وقيادة هادئة. توفر A8 تجربة سفر من الدرجة الأولى للركاب الباحثين عن الراحة.",
  },
};

const fallbackDescriptions: Record<Lang, (car: Car) => string> = {
  en: (car) => `${car.brand} ${car.name} is available for rental with clear daily pricing and basic insurance included.`,
  fr: (car) => `${car.brand} ${car.name} est disponible à la location avec un tarif journalier clair et une assurance de base incluse.`,
  ar: (car) => `${car.brand} ${car.name} متاحة للكراء بسعر يومي واضح وتأمين أساسي مشمول.`,
};

export function getLocalizedCarDescription(car: Car, lang: Lang) {
  return carDescriptions[lang][car.id] ?? carDescriptions.en[car.id] ?? fallbackDescriptions[lang](car);
}
