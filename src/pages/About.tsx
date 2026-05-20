import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import heroCar from "@/assets/homepage-background.png";
import { useFleet } from "@/lib/fleet";
import { useI18n, type Lang } from "@/i18n/I18nProvider";

const aboutCopy: Record<Lang, {
  eyebrow: string;
  headline: string;
  intro: string;
  stats: Array<{ value: string; label: string }>;
  storyTag: string;
  storyTitle: string;
  storyBody: string[];
  milestones: Array<{ year: string; title: string; body: string }>;
  chooseTag: string;
  chooseTitle: string;
  reasons: Array<{ title: string; body: string; icon: typeof Trophy }>;
  counters: Array<{ label: string; value: number; suffix: string }>;
  reviewsTag: string;
  reviewsTitle: string;
  reviews: Array<{ name: string; city: string; review: string }>;
  fleetTag: string;
  fleetTitle: string;
  categories: Array<{ title: string; body: string; icon: typeof Trophy }>;
  ctaTag: string;
  ctaTitle: string;
  ctaBody: string;
  book: string;
  contact: string;
}> = {
  en: {
    eyebrow: "About Alaoui Car Rental",
    headline: "More Than Car Rentals - We Create Experiences.",
    intro: "We are a Morocco-based rental agency built for travelers who want more than keys. From clean vehicles to airport delivery and fast support, every detail is prepared for a smoother journey.",
    stats: [
      { value: "Since 2018", label: "Built in Morocco" },
      { value: "500+", label: "Cars" },
      { value: "10,000+", label: "Trips" },
      { value: "4.9/5", label: "Rating" },
    ],
    storyTag: "Our Story",
    storyTitle: "Created from a passion for cars, travel, and reliable service.",
    storyBody: [
      "Alaoui Car Rental was created because renting a car should feel simple, elegant, and trustworthy. We saw travelers losing time with unclear prices, late handovers, and poorly prepared vehicles, so we built an agency focused on the full experience.",
      "Since 2018, our team has grown from a local launch into a service trusted by visitors, families, business travelers, and drivers exploring Morocco from city streets to long scenic roads.",
    ],
    milestones: [
      { year: "2018", title: "Agency launched", body: "A small Casablanca team started with clean cars, clear prices, and human service." },
      { year: "2020", title: "Airport delivery", body: "We expanded to airport handovers in Casablanca, Marrakech, and Rabat." },
      { year: "2022", title: "Premium fleet growth", body: "Luxury, SUV, economy, and sports options joined the fleet." },
      { year: "Today", title: "Experience-first rentals", body: "Every booking is shaped around comfort, timing, support, and the journey." },
    ],
    chooseTag: "Why Choose Us",
    chooseTitle: "Everything around the rental is designed to feel effortless.",
    reasons: [
      { icon: Trophy, title: "Premium vehicles", body: "Carefully selected cars for business trips, family travel, weekends, and special arrivals." },
      { icon: Wallet, title: "Affordable pricing", body: "Clear daily rates with practical options for short-term and longer rentals." },
      { icon: Headphones, title: "24/7 support", body: "Fast help by phone and WhatsApp before, during, and after your rental." },
      { icon: Plane, title: "Airport delivery", body: "Smooth handovers at major Moroccan airports and city meeting points." },
      { icon: Zap, title: "Fast booking", body: "Choose a car, send your request, and receive a quick confirmation from the team." },
    ],
    counters: [
      { label: "Happy clients", value: 8500, suffix: "+" },
      { label: "Trips completed", value: 10000, suffix: "+" },
      { label: "Vehicles available", value: 500, suffix: "+" },
      { label: "Years of experience", value: 8, suffix: "" },
    ],
    reviewsTag: "Customer Reviews",
    reviewsTitle: "Drivers come back for the service.",
    reviews: [
      { name: "Ahmed Alaoui", city: "Casablanca", review: "The car was ready on time, perfectly clean, and the WhatsApp confirmation made the whole booking feel easy." },
      { name: "Sara Benali", city: "Marrakech", review: "We rented for a weekend trip. The price was clear, delivery was fast, and the return was simple." },
      { name: "Youssef El Idrissi", city: "Rabat", review: "Professional service for a business trip. The team answered quickly and the vehicle felt premium." },
    ],
    fleetTag: "Fleet Categories",
    fleetTitle: "Choose the car category that matches your journey.",
    categories: [
      { title: "Luxury", body: "Executive comfort", icon: Sparkles },
      { title: "SUV", body: "Road-ready power", icon: ShieldCheck },
      { title: "Economy", body: "Smart daily value", icon: CarFront },
      { title: "Sports", body: "Performance drive", icon: Zap },
    ],
    ctaTag: "Final CTA",
    ctaTitle: "Ready for Your Next Journey?",
    ctaBody: "Select your car, send your request, and our team will prepare the right vehicle for your route, timing, and destination.",
    book: "Book Now",
    contact: "Contact",
  },
  fr: {
    eyebrow: "À propos d'Alaoui Car Rental",
    headline: "Plus qu'une location de voiture - nous créons des expériences.",
    intro: "Nous sommes une agence marocaine pensée pour les voyageurs qui veulent plus que des clés. Voitures propres, livraison à l'aéroport et assistance rapide : chaque détail prépare un trajet plus fluide.",
    stats: [
      { value: "Depuis 2018", label: "Créé au Maroc" },
      { value: "500+", label: "Voitures" },
      { value: "10 000+", label: "Trajets" },
      { value: "4.9/5", label: "Note" },
    ],
    storyTag: "Notre histoire",
    storyTitle: "Née d'une passion pour les voitures, le voyage et le service fiable.",
    storyBody: [
      "Alaoui Car Rental a été créée parce que louer une voiture doit être simple, élégant et fiable. Nous avons vu des voyageurs perdre du temps avec des prix flous, des remises en retard et des véhicules mal préparés.",
      "Depuis 2018, l'équipe est passée d'un lancement local à un service de confiance pour visiteurs, familles, professionnels et conducteurs qui explorent le Maroc.",
    ],
    milestones: [
      { year: "2018", title: "Lancement de l'agence", body: "Une petite équipe à Casablanca commence avec des voitures propres, des prix clairs et un service humain." },
      { year: "2020", title: "Livraison aéroport", body: "Déploiement des remises à l'aéroport à Casablanca, Marrakech et Rabat." },
      { year: "2022", title: "Flotte premium", body: "Des options luxe, SUV, économiques et sportives rejoignent la flotte." },
      { year: "Aujourd'hui", title: "Location orientée expérience", body: "Chaque réservation est pensée autour du confort, du timing et de l'assistance." },
    ],
    chooseTag: "Pourquoi nous choisir",
    chooseTitle: "Toute l'expérience de location est conçue pour être fluide.",
    reasons: [
      { icon: Trophy, title: "Véhicules premium", body: "Des voitures sélectionnées pour les voyages d'affaires, familles, week-ends et arrivées spéciales." },
      { icon: Wallet, title: "Prix accessibles", body: "Tarifs journaliers clairs avec options pratiques pour courtes et longues durées." },
      { icon: Headphones, title: "Support 24/7", body: "Aide rapide par téléphone et WhatsApp avant, pendant et après la location." },
      { icon: Plane, title: "Livraison aéroport", body: "Remises simples dans les principaux aéroports marocains et points de rendez-vous." },
      { icon: Zap, title: "Réservation rapide", body: "Choisissez une voiture, envoyez la demande, recevez une confirmation rapide." },
    ],
    counters: [
      { label: "Clients satisfaits", value: 8500, suffix: "+" },
      { label: "Trajets réalisés", value: 10000, suffix: "+" },
      { label: "Véhicules disponibles", value: 500, suffix: "+" },
      { label: "Années d'expérience", value: 8, suffix: "" },
    ],
    reviewsTag: "Avis clients",
    reviewsTitle: "Les conducteurs reviennent pour le service.",
    reviews: [
      { name: "Ahmed Alaoui", city: "Casablanca", review: "La voiture était prête à l'heure, très propre, et la confirmation sur WhatsApp a rendu la réservation simple." },
      { name: "Sara Benali", city: "Marrakech", review: "Nous avons loué pour un week-end. Le prix était clair, la livraison rapide, et le retour s'est fait facilement." },
      { name: "Youssef El Idrissi", city: "Rabat", review: "Service professionnel pour un déplacement d'affaires. L'équipe répond vite et la voiture était au niveau attendu." },
    ],
    fleetTag: "Catégories de flotte",
    fleetTitle: "Choisissez la catégorie qui correspond à votre trajet.",
    categories: [
      { title: "Luxe", body: "Confort exécutif", icon: Sparkles },
      { title: "SUV", body: "Puissance prête pour la route", icon: ShieldCheck },
      { title: "Économique", body: "Valeur intelligente au quotidien", icon: CarFront },
      { title: "Sport", body: "Conduite performance", icon: Zap },
    ],
    ctaTag: "Prochaine étape",
    ctaTitle: "Prêt pour votre prochain trajet ?",
    ctaBody: "Choisissez votre voiture, envoyez votre demande, et notre équipe prépare le véhicule adapté à votre route, votre horaire et votre destination.",
    book: "Réserver",
    contact: "Contact",
  },
  ar: {
    eyebrow: "حول Alaoui Car Rental",
    headline: "أكثر من كراء سيارات - نحن نصنع تجربة سفر.",
    intro: "نحن وكالة مغربية للكراء موجهة للمسافرين الذين يريدون أكثر من مجرد مفاتيح. سيارات نظيفة، توصيل إلى المطار، ودعم سريع لتجربة أسهل.",
    stats: [
      { value: "منذ 2018", label: "تأسست في المغرب" },
      { value: "+500", label: "سيارة" },
      { value: "+10,000", label: "رحلة" },
      { value: "4.9/5", label: "تقييم" },
    ],
    storyTag: "قصتنا",
    storyTitle: "انطلقت من شغف بالسيارات والسفر والخدمة الموثوقة.",
    storyBody: [
      "تأسست Alaoui Car Rental لأن كراء السيارة يجب أن يكون سهلا وراقيا وموثوقا. لاحظنا أن المسافرين يضيعون الوقت مع أسعار غير واضحة وتسليم متأخر وسيارات غير مجهزة.",
      "منذ 2018، تطور فريقنا من انطلاقة محلية إلى خدمة يثق بها الزوار والعائلات ورجال الأعمال والسائقون الذين يستكشفون المغرب.",
    ],
    milestones: [
      { year: "2018", title: "انطلاق الوكالة", body: "بدأ فريق صغير في الدار البيضاء بوعد واضح: سيارات نظيفة، أسعار واضحة، وخدمة إنسانية." },
      { year: "2020", title: "توصيل المطار", body: "وسعنا التسليم في مطارات الدار البيضاء ومراكش والرباط." },
      { year: "2022", title: "نمو الأسطول الفاخر", body: "أضفنا سيارات فاخرة وSUV واقتصادية ورياضية لتناسب مختلف الرحلات." },
      { year: "اليوم", title: "كراء يركز على التجربة", body: "كل حجز يتم تنظيمه حسب الراحة والوقت والدعم وطبيعة الرحلة." },
    ],
    chooseTag: "لماذا تختارنا",
    chooseTitle: "كل تفاصيل الكراء مصممة لتكون سهلة وواضحة.",
    reasons: [
      { icon: Trophy, title: "سيارات فاخرة", body: "سيارات مختارة لرحلات العمل والعائلة ونهاية الأسبوع والاستقبال الخاص." },
      { icon: Wallet, title: "أسعار مناسبة", body: "أسعار يومية واضحة وخيارات عملية للكراء القصير والطويل." },
      { icon: Headphones, title: "دعم 24/7", body: "مساعدة سريعة عبر الهاتف وواتساب قبل الكراء وأثناءه وبعده." },
      { icon: Plane, title: "توصيل المطار", body: "تسليم سلس في أهم المطارات المغربية ونقاط اللقاء داخل المدن." },
      { icon: Zap, title: "حجز سريع", body: "اختر السيارة، أرسل الطلب، وتوصل بتأكيد سريع من الفريق." },
    ],
    counters: [
      { label: "عملاء سعداء", value: 8500, suffix: "+" },
      { label: "رحلات مكتملة", value: 10000, suffix: "+" },
      { label: "سيارات متاحة", value: 500, suffix: "+" },
      { label: "سنوات خبرة", value: 8, suffix: "" },
    ],
    reviewsTag: "آراء الزبناء",
    reviewsTitle: "زبناء كيرجعو لينا حيث الخدمة واضحة ومريحة.",
    reviews: [
      { name: "Ahmed Alaoui", city: "كازا", review: "الطوموبيل كانت واجدة فالوقت ونقية بزاف، والتأكيد فالواتساب خلا كلشي ساهل." },
      { name: "Sara Benali", city: "مراكش", review: "كريناها للويكاند. الثمن كان واضح، التوصيل جا بسرعة، والرجوع داز بلا صداع." },
      { name: "Youssef El Idrissi", city: "الرباط", review: "خدمة زوينة واحترافية فواحد السفر ديال الخدمة. جاوبونا دغيا والطوموبيل كانت فالمستوى." },
    ],
    fleetTag: "فئات السيارات",
    fleetTitle: "اختر الفئة المناسبة لرحلتك.",
    categories: [
      { title: "فاخرة", body: "راحة تنفيذية", icon: Sparkles },
      { title: "SUV", body: "قوة جاهزة للطريق", icon: ShieldCheck },
      { title: "اقتصادية", body: "قيمة ذكية يومية", icon: CarFront },
      { title: "رياضية", body: "قيادة بأداء عال", icon: Zap },
    ],
    ctaTag: "الخطوة التالية",
    ctaTitle: "جاهز لرحلتك القادمة؟",
    ctaBody: "اختر سيارتك، أرسل الطلب، وسنجهز السيارة المناسبة لمسارك ووقتك ووجهتك.",
    book: "احجز الآن",
    contact: "اتصل بنا",
  },
};

const About = () => {
  const { lang, dir } = useI18n();
  const copy = aboutCopy[lang];
  const cars = useFleet();
  const [activeReview, setActiveReview] = useState(0);
  const featured = cars[8] ?? cars[0];
  const categoryImages = [
    cars.find((car) => car.category === "Luxury")?.image ?? featured.image,
    cars.find((car) => car.category === "Pickup")?.image ?? featured.image,
    cars.find((car) => car.category === "Hatchback")?.image ?? featured.image,
    cars.find((car) => car.category === "Sports")?.image ?? featured.image,
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % copy.reviews.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [copy.reviews.length]);

  const heroStats = useMemo(() => copy.stats, [copy.stats]);

  return (
    <>
      <section className="relative -mt-24 flex min-h-[92svh] items-end overflow-hidden sm:-mt-20">
        <img
          src={heroCar}
          alt="Luxury rental cars"
          className="absolute inset-0 h-full w-full object-cover opacity-42 blur-[0.5px] rtl:[transform:scaleX(-1)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_44%,transparent_0%,hsl(var(--background)/0.22)_34%,hsl(var(--background)/0.72)_72%),linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background)/0.92)_42%,hsl(var(--background)/0.62)_100%)] rtl:bg-[radial-gradient(circle_at_28%_44%,transparent_0%,hsl(var(--background)/0.22)_34%,hsl(var(--background)/0.72)_72%),linear-gradient(270deg,hsl(var(--background))_0%,hsl(var(--background)/0.92)_42%,hsl(var(--background)/0.62)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/88 to-transparent" />
        <div className="container relative z-10 pb-14 sm:pb-20 md:pb-28">
          <div className="max-w-5xl">
            <div className="eyebrow-pill font-mono-label mb-7">{copy.eyebrow}</div>
            <h1 className="max-w-4xl text-balance text-4xl leading-[0.96] sm:text-5xl md:text-7xl lg:text-8xl">{copy.headline}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">{copy.intro}</p>
            <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/70 bg-background/45 p-4 backdrop-blur-md">
                  <div className="home-number-font text-xl text-primary md:text-2xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 border-b border-border/50 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <div className="font-mono-label mb-4 text-primary">{copy.storyTag}</div>
          <h2 className="text-balance text-4xl leading-[0.9] sm:text-5xl md:text-7xl">{copy.storyTitle}</h2>
          {copy.storyBody.map((paragraph) => (
            <p key={paragraph} className="mt-6 leading-relaxed text-muted-foreground">{paragraph}</p>
          ))}
        </div>
        <div className="grid gap-4">
          {copy.milestones.map((item, index) => (
            <article key={item.year} className="editorial-card reveal-up p-5" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="grid gap-4 sm:grid-cols-[minmax(9rem,auto)_1fr]">
                <div className="home-number-font break-words text-2xl leading-tight text-primary">{item.year}</div>
                <div>
                  <h3 className="car-name-font text-2xl font-bold leading-none">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container border-b border-border/50 py-16 sm:py-24">
        <div className="mb-10 max-w-3xl">
          <div className="font-mono-label mb-4 text-primary">{copy.chooseTag}</div>
          <h2 className="text-balance text-4xl leading-[0.9] sm:text-5xl md:text-7xl">{copy.chooseTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {copy.reasons.map(({ icon: Icon, title, body }, index) => (
            <article key={title} className="editorial-card reveal-up p-6" style={{ animationDelay: `${index * 70}ms` }}>
              <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="car-name-font mt-8 text-2xl font-bold leading-none">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container border-b border-border/50 py-16 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.counters.map((counter, index) => (
            <CounterCard key={counter.label} {...counter} delay={index * 100} />
          ))}
        </div>
      </section>

      <section className="container grid gap-10 border-b border-border/50 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="font-mono-label mb-4 text-primary">{copy.reviewsTag}</div>
          <h2 className="text-balance text-4xl leading-[0.9] sm:text-5xl md:text-7xl">{copy.reviewsTitle}</h2>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setActiveReview((activeReview + copy.reviews.length - 1) % copy.reviews.length)} className="btn-secondary h-11 w-11 p-0" aria-label="Previous review">
              {dir === "rtl" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button type="button" onClick={() => setActiveReview((activeReview + 1) % copy.reviews.length)} className="btn-secondary h-11 w-11 p-0" aria-label="Next review">
              {dir === "rtl" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <article className="editorial-card p-6 sm:p-8">
          <h3 className="text-3xl leading-none">{copy.reviews[activeReview].name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{copy.reviews[activeReview].city}</p>
          <div className="mt-8 flex gap-1 text-primary">
            {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" strokeWidth={1.5} />)}
          </div>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">"{copy.reviews[activeReview].review}"</p>
        </article>
      </section>

      <section className="relative overflow-hidden border-y border-border/50 bg-[#050505] py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,hsl(var(--primary)/0.12),transparent_34%),linear-gradient(180deg,transparent,hsl(var(--background)/0.18))]" />
        <div className="container relative">
          <div className="mb-12 max-w-3xl">
            <div className="font-mono-label mb-5 text-primary">{copy.fleetTag}</div>
            <h2 className="text-balance text-5xl leading-[0.9] text-white sm:text-6xl md:text-8xl lg:text-9xl">
              {lang === "en" ? "Choose the drive that fits your journey." : copy.fleetTitle}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {copy.categories.map(({ title, body }, index) => (
              <article key={title} className="group relative min-h-[20rem] overflow-hidden rounded-[1.65rem] border border-white/15 bg-card shadow-elegant">
                <img
                  src={categoryImages[index]}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-3xl font-black leading-none text-white">{title}</h3>
                  <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/72">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 p-7 shadow-elegant sm:p-12 md:p-16">
          <img src={featured.image} alt={`${featured.brand} ${featured.name}`} className="absolute inset-0 h-full w-full object-cover opacity-35" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/82 to-background/42" />
          <div className="relative max-w-3xl">
            <div className="font-mono-label mb-4 text-primary">{copy.ctaTag}</div>
            <h2 className="text-4xl leading-[0.9] sm:text-5xl md:text-7xl">{copy.ctaTitle}</h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{copy.ctaBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/booking" className="btn-primary px-7 py-4 font-mono-label transition-smooth">{copy.book} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/contact" className="btn-secondary px-7 py-4 font-mono-label transition-smooth">{copy.contact}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const CounterCard = ({ label, value, suffix, delay }: { label: string; value: number; suffix: string; delay: number }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1200, 1);
        setDisplayValue(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="editorial-card reveal-up p-6" style={{ animationDelay: `${delay}ms` }}>
      <div className="home-number-font text-4xl text-primary md:text-5xl">{displayValue.toLocaleString()}{suffix}</div>
      <div className="font-mono-label mt-3 text-muted-foreground">{label}</div>
    </div>
  );
};

export default About;

