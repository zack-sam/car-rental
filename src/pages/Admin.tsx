import { useEffect, useMemo, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from "react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  CarFront,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Globe2,
  Headphones,
  ImagePlus,
  KeyRound,
  Languages,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type { Car } from "@/data/cars";
import { getBookingData, type Booking } from "@/lib/bookings";
import { useCurrency } from "@/lib/currency";
import { addFleetCar, fallbackCarImage, saveFleet, useFleet, type NewCarInput } from "@/lib/fleet";
import { useI18n, type Lang } from "@/i18n/I18nProvider";

type AdminSession = { name: string };
type SectionId = "overview" | "vehicles" | "reservations" | "customers" | "content" | "notifications" | "settings";
type AdminAlert = { id: string; title: string; body: string; status: "Unread" | "Read" | "Live" };
type VehicleDraft = NewCarInput & {
  id?: string;
  quantity: number;
  weeklyPrice: number;
  monthlyPrice: number;
  availability: "Available" | "Rented" | "Maintenance";
  maintenance: "Ready" | "Inspection due" | "Service booked";
  gallery: string;
};

const AUTH_KEY = "admin-personnel-session";
const ADMIN_CODE = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
const RESERVATION_STATUS_KEY = "admin-reservation-statuses";
const ADMIN_ALERTS_KEY = "admin-notifications";
const ADMIN_CONTENT_KEY = "admin-website-content";

const navItems: Array<{ id: SectionId; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "vehicles", label: "Vehicles", icon: CarFront },
  { id: "reservations", label: "Reservations", icon: CalendarClock },
  { id: "customers", label: "Customers", icon: Users },
  { id: "content", label: "Website Content", icon: Globe2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

const reservationStatuses = ["Pending", "Confirmed", "Active", "Completed", "Cancelled"];
const vehicleCategories: Car["category"][] = ["Luxury", "Sedan", "Pickup", "Sports", "Hatchback"];
const defaultAdminAlerts: AdminAlert[] = [
  { id: "booking-alert", title: "Booking alert", body: "New Mercedes S-Class request needs confirmation", status: "Unread" },
  { id: "maintenance-alert", title: "Maintenance alert", body: "Audi RS3 inspection due before next pickup", status: "Unread" },
  { id: "delivery-alert", title: "Real-time notification", body: "Airport delivery changed to Terminal 2", status: "Live" },
  { id: "system-alert", title: "System alert", body: "Database schema is ready for backend connection", status: "Unread" },
];

const blankVehicle: VehicleDraft = {
  name: "",
  brand: "",
  category: "Sedan",
  pricePerDay: 350,
  weeklyPrice: 2100,
  monthlyPrice: 7900,
  image: "",
  gallery: "",
  seats: 5,
  transmission: "Automatic",
  fuel: "Petrol",
  topSpeed: 180,
  quantity: 1,
  availability: "Available",
  maintenance: "Ready",
};

const adminCopy: Record<Lang, Record<string, string>> = {
  en: {
    overview: "Dashboard",
    dashboard: "Dashboard",
    vehicles: "Vehicles",
    reservations: "Reservations",
    customers: "Customers",
    content: "Website Content",
    notifications: "Notifications",
    settings: "Settings",
    personnelPanel: "Personnel panel",
    privateAccess: "Private access",
    personnelOnly: "Visible only to personnel.",
    commandCenter: "Luxury car rental command center",
    search: "Search reservations, cars, clients...",
    secureTitle: "Secure admin access",
    secureBody: "This dashboard is private for authorized rental staff only.",
    accessCode: "Access code",
    enterCode: "Enter code",
    enterDashboard: "Enter dashboard",
    incorrectCode: "Incorrect personnel access code.",
    addVehicle: "Add vehicle",
    editVehicle: "Edit vehicle",
    brand: "Brand",
    model: "Model",
    category: "Category",
    quantity: "Quantity",
    priceDay: "Price / day",
    priceWeek: "Price / week",
    priceMonth: "Price / month",
    seats: "Seats",
    fuelType: "Fuel type",
    transmission: "Transmission",
    topSpeed: "Top speed",
    maintenance: "Maintenance",
    mainImage: "Main image URL",
    gallery: "Car pictures",
    galleryHelp: "Upload one or more image files. The first uploaded image becomes the main car picture.",
    saveVehicle: "Save vehicle",
    fleetManagement: "Fleet management",
    editContent: "Edit content",
    saveDraft: "Save draft",
    closeEditor: "Close editor",
    clearAll: "Clear all",
    markRead: "Mark read",
    noNotifications: "No notifications right now.",
    companyInfo: "Company information",
    preferences: "Preferences",
    saveSettings: "Save settings",
    settingsSaved: "Settings saved locally and ready for database sync.",
    multiLanguage: "English, French, Arabic",
    totalBookings: "Total bookings",
    allReservationRecords: "All reservation records",
    activeRentals: "Active rentals",
    currentlyOnRoad: "Currently on the road",
    availableCars: "Available cars",
    fleetVehicles: "fleet vehicles",
    monthlyRevenue: "Monthly revenue",
    projectedIncome: "Projected rental income",
    bookingActivity: "Booking activity",
    weeklyDemand: "Weekly demand",
    customerGrowth: "Customer growth",
    newCustomerTrend: "New customer trend",
    recentReservations: "Recent reservations",
    latestBookings: "Latest booking requests and rental activity",
    guestCustomer: "Guest customer",
    quickStats: "Quick statistics",
    operationalSnapshot: "Operational health snapshot",
    pendingApprovals: "Pending approvals",
    maintenanceAlerts: "Maintenance alerts",
    needsFollowUp: "Needs follow-up",
    vipCustomers: "VIP customers",
    vehicleFormSubtitle: "API-ready vehicle form with pricing, gallery, specs, and maintenance data",
    fleetSubtitle: "Add, edit, delete, price, and track availability by vehicle",
    economy: "Economy",
    automatic: "Automatic",
    manual: "Manual",
    ready: "Ready",
    inspectionDue: "Inspection due",
    serviceBooked: "Service booked",
    removeImage: "Remove uploaded image",
    perDay: "per day",
    reservationCalendar: "Reservation calendar",
    calendarSubtitle: "Click a date to filter pickups, returns, and active rentals",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    today: "Today",
    clear: "Clear",
    upcomingBookings: "Upcoming bookings",
    nextHandovers: "Next vehicle handovers",
    noUpcoming: "No upcoming bookings yet.",
    guest: "Guest",
    pickupPending: "Pickup pending",
    reservationManagement: "Reservation management",
    reservationSubtitle: "Approve, reject, track, and inspect rental periods",
    all: "All",
    showingReservations: "Showing reservations touching",
    customer: "Customer",
    vehicle: "Vehicle",
    period: "Period",
    pickupReturn: "Pickup / return",
    status: "Status",
    noContact: "No contact",
    agency: "Agency",
    tracked: "tracked",
    approve: "Approve",
    reject: "Reject",
    openReservationDetails: "Open reservation details",
    noReservations: "No reservations match this view.",
    noEmail: "No email",
    noPhone: "No phone",
    prefersAirport: "Prefers airport delivery and premium vehicles.",
    needsWhatsapp: "Needs WhatsApp confirmation before pickup.",
    phone: "Phone",
    email: "Email",
    rentalHistory: "Rental history",
    rentals: "rentals",
    driverLicense: "Driver license",
    uploadReady: "Upload ready",
    homepageSections: "Homepage sections",
    homepageSectionsBody: "Edit hero, fleet highlight, and CTA blocks",
    testimonials: "Testimonials",
    testimonialsBody: "Manage customer quotes and slider visibility",
    reviews: "Reviews",
    reviewsBody: "Moderate public review content",
    faqEditor: "FAQ editor",
    faqEditorBody: "Add common rental questions",
    heroCustomization: "Hero customization",
    heroCustomizationBody: "Update copy, media, and buttons",
    promotions: "Promotions",
    promotionsBody: "Discount banners and seasonal offers",
    editing: "Editing",
    draftReady: "Local draft ready for API/database connection",
    draftSaved: "Draft saved for",
    notificationsSubtitle: "Booking, maintenance, and live operational alerts",
    companySubtitle: "Brand, contact, integration, and SEO configuration",
    companyName: "Company name",
    emailSettings: "Email settings",
    whatsappIntegration: "WhatsApp integration",
    seoTitle: "SEO title",
    preferencesSubtitle: "Language, currency, and theme controls",
    personnelAccess: "Personnel access",
    multiLanguageSupport: "Multi-language support",
    currencySwitcher: "Currency switcher",
    switchLight: "Switch to light mode",
    switchDark: "Switch to dark mode",
    reservationDetails: "Reservation details",
    closeReservationDetails: "Close reservation details",
    pickup: "Pickup",
    return: "Return",
    location: "Location",
    payment: "Payment",
    total: "Total",
    toConfirm: "To confirm",
    confirmed: "Confirmed",
    pending: "Pending",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
    maintenanceStatus: "Maintenance",
    unread: "Unread",
    read: "Read",
    live: "Live",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
    alertBookingTitle: "Booking alert",
    alertBookingBody: "New Mercedes S-Class request needs confirmation",
    alertMaintenanceTitle: "Maintenance alert",
    alertMaintenanceBody: "Audi RS3 inspection due before next pickup",
    alertDeliveryTitle: "Real-time notification",
    alertDeliveryBody: "Airport delivery changed to Terminal 2",
    alertSystemTitle: "System alert",
    alertSystemBody: "Database schema is ready for backend connection",
    latestNotifications: "Latest notifications",
    viewAll: "View all",
    openNotifications: "Open notifications",
    sectionTitle: "Section title",
    sectionBody: "Section body",
    headline: "Headline",
    subtitle: "Subtitle",
    primaryCta: "Primary button",
    secondaryCta: "Secondary button",
    quoteOne: "Quote 1",
    quoteTwo: "Quote 2",
    reviewOne: "Review 1",
    reviewTwo: "Review 2",
    questionOne: "Question 1",
    answerOne: "Answer 1",
    heroMedia: "Hero media",
    bannerText: "Banner text",
    discountCode: "Discount code",
    startDate: "Start date",
    endDate: "End date",
    saveChanges: "Save changes",
  },
  fr: {
    overview: "Tableau de bord",
    dashboard: "Tableau de bord",
    vehicles: "Véhicules",
    reservations: "Réservations",
    customers: "Clients",
    content: "Contenu du site",
    notifications: "Notifications",
    settings: "Paramètres",
    personnelPanel: "Espace personnel",
    privateAccess: "Accès privé",
    personnelOnly: "Visible uniquement par le personnel.",
    commandCenter: "Centre de gestion location premium",
    search: "Rechercher réservations, voitures, clients...",
    secureTitle: "Accès admin sécurisé",
    secureBody: "Ce tableau de bord est privé et réservé au personnel autorisé.",
    accessCode: "Code d'accès",
    enterCode: "Entrer le code",
    enterDashboard: "Entrer au tableau",
    incorrectCode: "Code d'accès incorrect.",
    addVehicle: "Ajouter un véhicule",
    editVehicle: "Modifier le véhicule",
    brand: "Marque",
    model: "Modèle",
    category: "Catégorie",
    quantity: "Quantité",
    priceDay: "Prix / jour",
    priceWeek: "Prix / semaine",
    priceMonth: "Prix / mois",
    seats: "Places",
    fuelType: "Carburant",
    transmission: "Transmission",
    topSpeed: "Vitesse max",
    maintenance: "Maintenance",
    mainImage: "Image principale",
    gallery: "Photos de la voiture",
    galleryHelp: "Importez une ou plusieurs images. La première image importée devient l'image principale.",
    saveVehicle: "Enregistrer le véhicule",
    fleetManagement: "Gestion de flotte",
    editContent: "Modifier",
    saveDraft: "Enregistrer le brouillon",
    closeEditor: "Fermer",
    clearAll: "Tout effacer",
    markRead: "Marquer lu",
    noNotifications: "Aucune notification pour le moment.",
    companyInfo: "Informations société",
    preferences: "Préférences",
    saveSettings: "Enregistrer",
    settingsSaved: "Paramètres enregistrés localement, prêts pour la base de données.",
    multiLanguage: "Anglais, Français, Arabe",
    totalBookings: "Réservations totales",
    allReservationRecords: "Tous les dossiers de réservation",
    activeRentals: "Locations actives",
    currentlyOnRoad: "Actuellement sur la route",
    availableCars: "Voitures disponibles",
    fleetVehicles: "véhicules en flotte",
    monthlyRevenue: "Revenu mensuel",
    projectedIncome: "Revenu de location estimé",
    bookingActivity: "Activité des réservations",
    weeklyDemand: "Demande hebdomadaire",
    customerGrowth: "Croissance clients",
    newCustomerTrend: "Nouveaux clients",
    recentReservations: "Réservations récentes",
    latestBookings: "Dernières demandes et activités de location",
    guestCustomer: "Client invité",
    quickStats: "Statistiques rapides",
    operationalSnapshot: "Vue d'ensemble opérationnelle",
    pendingApprovals: "Validations en attente",
    maintenanceAlerts: "Alertes maintenance",
    needsFollowUp: "À relancer",
    vipCustomers: "Clients VIP",
    vehicleFormSubtitle: "Formulaire véhicule prêt API avec prix, galerie, specs et maintenance",
    fleetSubtitle: "Ajouter, modifier, supprimer, tarifer et suivre la disponibilité",
    economy: "Économique",
    automatic: "Automatique",
    manual: "Manuelle",
    ready: "Prêt",
    inspectionDue: "Inspection à prévoir",
    serviceBooked: "Service planifié",
    removeImage: "Supprimer l'image importée",
    perDay: "par jour",
    reservationCalendar: "Calendrier des réservations",
    calendarSubtitle: "Cliquez une date pour filtrer départs, retours et locations actives",
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    today: "Aujourd'hui",
    clear: "Effacer",
    upcomingBookings: "Réservations à venir",
    nextHandovers: "Prochaines remises de véhicule",
    noUpcoming: "Aucune réservation à venir.",
    guest: "Client",
    pickupPending: "Départ à confirmer",
    reservationManagement: "Gestion des réservations",
    reservationSubtitle: "Approuver, refuser, suivre et inspecter les périodes",
    all: "Toutes",
    showingReservations: "Réservations affichées pour",
    customer: "Client",
    vehicle: "Véhicule",
    period: "Période",
    pickupReturn: "Départ / retour",
    status: "Statut",
    noContact: "Aucun contact",
    agency: "Agence",
    tracked: "suivi",
    approve: "Approuver",
    reject: "Refuser",
    openReservationDetails: "Ouvrir les détails de réservation",
    noReservations: "Aucune réservation ne correspond à cette vue.",
    noEmail: "Aucun email",
    noPhone: "Aucun téléphone",
    prefersAirport: "Préfère la livraison aéroport et les véhicules premium.",
    needsWhatsapp: "Besoin d'une confirmation WhatsApp avant le départ.",
    phone: "Téléphone",
    email: "Email",
    rentalHistory: "Historique de location",
    rentals: "locations",
    driverLicense: "Permis de conduire",
    uploadReady: "Import prêt",
    homepageSections: "Sections d'accueil",
    homepageSectionsBody: "Modifier le hero, la flotte mise en avant et les CTA",
    testimonials: "Témoignages",
    testimonialsBody: "Gérer les avis clients et le slider",
    reviews: "Avis",
    reviewsBody: "Modérer les avis publics",
    faqEditor: "Éditeur FAQ",
    faqEditorBody: "Ajouter les questions fréquentes",
    heroCustomization: "Personnalisation hero",
    heroCustomizationBody: "Modifier textes, médias et boutons",
    promotions: "Promotions",
    promotionsBody: "Bannières de réduction et offres saisonnières",
    editing: "Modification",
    draftReady: "Brouillon local prêt pour API/base de données",
    draftSaved: "Brouillon enregistré pour",
    notificationsSubtitle: "Alertes réservation, maintenance et opérations en direct",
    companySubtitle: "Marque, contact, intégrations et SEO",
    companyName: "Nom de l'entreprise",
    emailSettings: "Paramètres email",
    whatsappIntegration: "Intégration WhatsApp",
    seoTitle: "Titre SEO",
    preferencesSubtitle: "Langue, devise et thème",
    personnelAccess: "Accès personnel",
    multiLanguageSupport: "Support multilingue",
    currencySwitcher: "Sélecteur de devise",
    switchLight: "Passer en mode clair",
    switchDark: "Passer en mode sombre",
    reservationDetails: "Détails de réservation",
    closeReservationDetails: "Fermer les détails",
    pickup: "Départ",
    return: "Retour",
    location: "Lieu",
    payment: "Paiement",
    total: "Total",
    toConfirm: "À confirmer",
    confirmed: "Confirmée",
    pending: "En attente",
    active: "Active",
    completed: "Terminée",
    cancelled: "Annulée",
    maintenanceStatus: "Maintenance",
    unread: "Non lu",
    read: "Lu",
    live: "En direct",
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Jeu",
    friday: "Ven",
    saturday: "Sam",
    sunday: "Dim",
    alertBookingTitle: "Alerte réservation",
    alertBookingBody: "Nouvelle demande Mercedes Classe S à confirmer",
    alertMaintenanceTitle: "Alerte maintenance",
    alertMaintenanceBody: "Inspection Audi RS3 requise avant le prochain départ",
    alertDeliveryTitle: "Notification en direct",
    alertDeliveryBody: "Livraison aéroport déplacée au Terminal 2",
    alertSystemTitle: "Alerte système",
    alertSystemBody: "Le schéma SQL est prêt pour la connexion backend",
    latestNotifications: "Dernières notifications",
    viewAll: "Tout voir",
    openNotifications: "Ouvrir les notifications",
    sectionTitle: "Titre de section",
    sectionBody: "Texte de section",
    headline: "Grand titre",
    subtitle: "Sous-titre",
    primaryCta: "Bouton principal",
    secondaryCta: "Bouton secondaire",
    quoteOne: "Citation 1",
    quoteTwo: "Citation 2",
    reviewOne: "Avis 1",
    reviewTwo: "Avis 2",
    questionOne: "Question 1",
    answerOne: "Réponse 1",
    heroMedia: "Média hero",
    bannerText: "Texte de bannière",
    discountCode: "Code promo",
    startDate: "Date début",
    endDate: "Date fin",
    saveChanges: "Enregistrer",
  },
  ar: {
    overview: "لوحة التحكم",
    dashboard: "لوحة التحكم",
    vehicles: "السيارات",
    reservations: "الحجوزات",
    customers: "العملاء",
    content: "محتوى الموقع",
    notifications: "الإشعارات",
    settings: "الإعدادات",
    personnelPanel: "لوحة الموظفين",
    privateAccess: "دخول خاص",
    personnelOnly: "مرئي للموظفين فقط.",
    commandCenter: "مركز إدارة كراء السيارات الفاخرة",
    search: "ابحث في الحجوزات والسيارات والعملاء...",
    secureTitle: "دخول آمن للإدارة",
    secureBody: "لوحة التحكم خاصة بالموظفين المصرح لهم فقط.",
    accessCode: "رمز الدخول",
    enterCode: "أدخل الرمز",
    enterDashboard: "الدخول للوحة",
    incorrectCode: "رمز الدخول غير صحيح.",
    addVehicle: "إضافة سيارة",
    editVehicle: "تعديل السيارة",
    brand: "الماركة",
    model: "الموديل",
    category: "الفئة",
    quantity: "الكمية",
    priceDay: "السعر / اليوم",
    priceWeek: "السعر / الأسبوع",
    priceMonth: "السعر / الشهر",
    seats: "المقاعد",
    fuelType: "الوقود",
    transmission: "ناقل الحركة",
    topSpeed: "السرعة القصوى",
    maintenance: "الصيانة",
    mainImage: "الصورة الرئيسية",
    gallery: "صور السيارة",
    galleryHelp: "ارفع صورة واحدة أو أكثر. أول صورة مرفوعة تصبح الصورة الرئيسية للسيارة.",
    saveVehicle: "حفظ السيارة",
    fleetManagement: "إدارة الأسطول",
    editContent: "تعديل المحتوى",
    saveDraft: "حفظ المسودة",
    closeEditor: "إغلاق",
    clearAll: "مسح الكل",
    markRead: "تعليم كمقروء",
    noNotifications: "لا توجد إشعارات حاليا.",
    companyInfo: "معلومات الشركة",
    preferences: "التفضيلات",
    saveSettings: "حفظ الإعدادات",
    settingsSaved: "تم حفظ الإعدادات محليا وهي جاهزة للمزامنة.",
    multiLanguage: "الإنجليزية، الفرنسية، العربية",
    totalBookings: "مجموع الحجوزات",
    allReservationRecords: "كل سجلات الحجز",
    activeRentals: "الكراءات النشطة",
    currentlyOnRoad: "حاليا في الطريق",
    availableCars: "السيارات المتاحة",
    fleetVehicles: "سيارات في الأسطول",
    monthlyRevenue: "الدخل الشهري",
    projectedIncome: "دخل الكراء المتوقع",
    bookingActivity: "نشاط الحجوزات",
    weeklyDemand: "الطلب الأسبوعي",
    customerGrowth: "نمو العملاء",
    newCustomerTrend: "اتجاه العملاء الجدد",
    recentReservations: "آخر الحجوزات",
    latestBookings: "آخر طلبات الحجز ونشاط الكراء",
    guestCustomer: "عميل زائر",
    quickStats: "إحصائيات سريعة",
    operationalSnapshot: "لمحة تشغيلية",
    pendingApprovals: "الموافقات المنتظرة",
    maintenanceAlerts: "تنبيهات الصيانة",
    needsFollowUp: "يحتاج متابعة",
    vipCustomers: "عملاء VIP",
    vehicleFormSubtitle: "نموذج سيارة جاهز للربط مع API ويشمل الأسعار والصور والمواصفات والصيانة",
    fleetSubtitle: "إضافة وتعديل وحذف وتسعير وتتبع توفر السيارات",
    economy: "اقتصادية",
    automatic: "أوتوماتيك",
    manual: "يدوي",
    ready: "جاهزة",
    inspectionDue: "الفحص مطلوب",
    serviceBooked: "الصيانة محجوزة",
    removeImage: "حذف الصورة المرفوعة",
    perDay: "في اليوم",
    reservationCalendar: "تقويم الحجوزات",
    calendarSubtitle: "اضغط على تاريخ لتصفية التسليم والرجوع والكراءات النشطة",
    previousMonth: "الشهر السابق",
    nextMonth: "الشهر التالي",
    today: "اليوم",
    clear: "مسح",
    upcomingBookings: "الحجوزات القادمة",
    nextHandovers: "التسليمات القادمة",
    noUpcoming: "لا توجد حجوزات قادمة.",
    guest: "عميل",
    pickupPending: "التسليم غير مؤكد",
    reservationManagement: "إدارة الحجوزات",
    reservationSubtitle: "الموافقة والرفض وتتبع وفحص مدة الكراء",
    all: "الكل",
    showingReservations: "عرض الحجوزات في",
    customer: "العميل",
    vehicle: "السيارة",
    period: "المدة",
    pickupReturn: "التسليم / الرجوع",
    status: "الحالة",
    noContact: "لا يوجد تواصل",
    agency: "الوكالة",
    tracked: "متتبع",
    approve: "موافقة",
    reject: "رفض",
    openReservationDetails: "فتح تفاصيل الحجز",
    noReservations: "لا توجد حجوزات مطابقة.",
    noEmail: "لا يوجد بريد",
    noPhone: "لا يوجد هاتف",
    prefersAirport: "يفضل التوصيل للمطار والسيارات الفاخرة.",
    needsWhatsapp: "يحتاج تأكيد واتساب قبل التسليم.",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    rentalHistory: "سجل الكراء",
    rentals: "كراءات",
    driverLicense: "رخصة السياقة",
    uploadReady: "جاهز للرفع",
    homepageSections: "أقسام الصفحة الرئيسية",
    homepageSectionsBody: "تعديل الواجهة الرئيسية والأسطول وأزرار الدعوة",
    testimonials: "الشهادات",
    testimonialsBody: "إدارة آراء العملاء والسلايدر",
    reviews: "التقييمات",
    reviewsBody: "مراجعة التقييمات العامة",
    faqEditor: "محرر الأسئلة",
    faqEditorBody: "إضافة أسئلة الكراء الشائعة",
    heroCustomization: "تخصيص الواجهة",
    heroCustomizationBody: "تعديل النصوص والوسائط والأزرار",
    promotions: "العروض",
    promotionsBody: "لافتات التخفيض والعروض الموسمية",
    editing: "تعديل",
    draftReady: "مسودة محلية جاهزة للربط مع API/قاعدة البيانات",
    draftSaved: "تم حفظ المسودة لـ",
    notificationsSubtitle: "تنبيهات الحجز والصيانة والعمليات المباشرة",
    companySubtitle: "العلامة التجارية والتواصل والتكاملات وSEO",
    companyName: "اسم الشركة",
    emailSettings: "إعدادات البريد",
    whatsappIntegration: "تكامل واتساب",
    seoTitle: "عنوان SEO",
    preferencesSubtitle: "اللغة والعملة والمظهر",
    personnelAccess: "دخول الموظفين",
    multiLanguageSupport: "دعم متعدد اللغات",
    currencySwitcher: "مبدل العملة",
    switchLight: "تفعيل الوضع الفاتح",
    switchDark: "تفعيل الوضع الداكن",
    reservationDetails: "تفاصيل الحجز",
    closeReservationDetails: "إغلاق التفاصيل",
    pickup: "التسليم",
    return: "الرجوع",
    location: "المكان",
    payment: "الدفع",
    total: "المجموع",
    toConfirm: "في انتظار التأكيد",
    confirmed: "مؤكد",
    pending: "قيد الانتظار",
    active: "نشط",
    completed: "مكتمل",
    cancelled: "ملغى",
    maintenanceStatus: "الصيانة",
    unread: "غير مقروء",
    read: "مقروء",
    live: "مباشر",
    monday: "الإث",
    tuesday: "الث",
    wednesday: "الأر",
    thursday: "الخ",
    friday: "الج",
    saturday: "الس",
    sunday: "الأح",
    alertBookingTitle: "تنبيه حجز",
    alertBookingBody: "طلب Mercedes S-Class جديد يحتاج تأكيدا",
    alertMaintenanceTitle: "تنبيه صيانة",
    alertMaintenanceBody: "فحص Audi RS3 مطلوب قبل التسليم القادم",
    alertDeliveryTitle: "إشعار مباشر",
    alertDeliveryBody: "توصيل المطار تغير إلى المحطة 2",
    alertSystemTitle: "تنبيه النظام",
    alertSystemBody: "مخطط قاعدة البيانات جاهز للربط الخلفي",
    latestNotifications: "آخر الإشعارات",
    viewAll: "عرض الكل",
    openNotifications: "فتح الإشعارات",
    sectionTitle: "عنوان القسم",
    sectionBody: "نص القسم",
    headline: "العنوان الرئيسي",
    subtitle: "العنوان الفرعي",
    primaryCta: "الزر الرئيسي",
    secondaryCta: "الزر الثاني",
    quoteOne: "اقتباس 1",
    quoteTwo: "اقتباس 2",
    reviewOne: "تقييم 1",
    reviewTwo: "تقييم 2",
    questionOne: "سؤال 1",
    answerOne: "جواب 1",
    heroMedia: "وسائط الواجهة",
    bannerText: "نص اللافتة",
    discountCode: "كود التخفيض",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    saveChanges: "حفظ التغييرات",
  },
};

function useAdminCopy() {
  const { lang } = useI18n();
  return (key: string) => adminCopy[lang][key] ?? adminCopy.en[key] ?? key;
}

const Admin = () => {
  const { format } = useCurrency();
  const ac = useAdminCopy();
  const fleet = useFleet();
  const [session, setSession] = useState<AdminSession | null>(() => {
    const saved = sessionStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) as AdminSession : null;
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [active, setActive] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [query, setQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AdminAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_ALERTS_KEY);
      return saved ? JSON.parse(saved) as AdminAlert[] : defaultAdminAlerts;
    } catch {
      return defaultAdminAlerts;
    }
  });
  const unreadCount = alerts.filter((alert) => alert.status === "Unread" || alert.status === "Live").length;

  useEffect(() => {
    localStorage.setItem(ADMIN_ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if (!session) return;
    let alive = true;
    getBookingData().then((data) => {
      if (!alive) return;
      setBookings([...data.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    });
    return () => {
      alive = false;
    };
  }, [session]);

  if (!session) {
    return <AdminLogin onLogin={(nextSession) => {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
    }} />;
  }

  const stats = getStats(bookings, fleet);

  return (
    <div className={`admin-suite ${theme === "light" ? "admin-suite-light" : ""}`}>
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-4">
          <div>
            <div className="font-display text-2xl leading-none">Alaoui</div>
            <div className="font-mono-label text-primary">{ac("personnelPanel")}</div>
          </div>
          <button type="button" className="admin-icon-button lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="grid gap-1 p-3">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActive(id);
                setSidebarOpen(false);
              }}
              className={`admin-nav-item ${active === id ? "is-active" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span>{ac(id)}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
            <ShieldCheck className="mb-4 h-5 w-5 text-primary" />
            <div className="font-mono-label text-primary">{ac("privateAccess")}</div>
            <p className="mt-2 text-xs text-muted-foreground">{ac("personnelOnly")}</p>
          </div>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button type="button" className="admin-icon-button lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="font-mono-label text-primary">{ac("commandCenter")}</div>
            <h1 className="truncate text-3xl leading-none md:text-5xl">{ac(active)}</h1>
          </div>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <div className="admin-search">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ac("search")} />
            </div>
            <button type="button" className="admin-icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative">
              <button type="button" className="admin-icon-button relative" onClick={() => setNotificationsOpen((current) => !current)} aria-label={ac("openNotifications")}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
              </button>
              {notificationsOpen && (
                <div className="admin-notification-popover">
                  <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <div>
                      <div className="font-mono-label text-primary">{ac("latestNotifications")}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{unreadCount} {ac("unread")}</p>
                    </div>
                    <button
                      type="button"
                      className="admin-action"
                      onClick={() => {
                        setActive("notifications");
                        setNotificationsOpen(false);
                      }}
                    >
                      {ac("viewAll")}
                    </button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {alerts.slice(0, 4).map((alert) => {
                      const translated = translateAlert(alert, ac);
                      return (
                        <button
                          key={alert.id}
                          type="button"
                          className="admin-notification-preview"
                          onClick={() => {
                            setActive("notifications");
                            setNotificationsOpen(false);
                          }}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{translated.title}</span>
                            <span className="mt-1 block truncate text-xs text-muted-foreground">{translated.body}</span>
                          </span>
                          <StatusPill status={alert.status} />
                        </button>
                      );
                    })}
                    {alerts.length === 0 && <p className="py-4 text-sm text-muted-foreground">{ac("noNotifications")}</p>}
                  </div>
                </div>
              )}
            </div>
            <button type="button" className="admin-profile" onClick={() => setActive("settings")} aria-label="Open profile settings">
              <UserRound className="h-4 w-4" />
              <span>{session.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="admin-icon-button"
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                setSession(null);
              }}
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="admin-content">
          {active === "overview" && <Overview bookings={bookings} fleet={fleet} stats={stats} format={format} />}
          {active === "vehicles" && <VehicleManagement fleet={fleet} query={query} />}
          {active === "reservations" && <ReservationManagement bookings={bookings} fleet={fleet} query={query} onOpen={setSelectedBooking} />}
          {active === "customers" && <CustomerManagement bookings={bookings} query={query} />}
          {active === "content" && <ContentManagement />}
          {active === "notifications" && <Notifications alerts={alerts} setAlerts={setAlerts} />}
          {active === "settings" && <SettingsPanel session={session} theme={theme} setTheme={setTheme} />}
        </main>
      </div>

      {selectedBooking && (
        <BookingModal booking={selectedBooking} fleet={fleet} onClose={() => setSelectedBooking(null)} />
      )}

      {sidebarOpen && <button type="button" className="admin-backdrop lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
      <AdminStyles />
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: (session: AdminSession) => void }) => {
  const ac = useAdminCopy();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (code !== ADMIN_CODE) {
      setError(ac("incorrectCode"));
      return;
    }
    onLogin({ name: "Admin Manager" });
  };

  return (
    <div className="container flex min-h-[calc(100vh-6rem)] items-center justify-center py-16">
      <form onSubmit={submit} className="editorial-card w-full max-w-md p-6 shadow-elegant">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
          <KeyRound className="h-6 w-6" />
        </div>
        <div className="font-mono-label text-primary mb-3">{ac("privateAccess")}</div>
        <h1 className="text-5xl leading-none">{ac("secureTitle")}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{ac("secureBody")}</p>
        <label className="mt-6 block">
          <span className="font-mono-label mb-2 block text-primary">{ac("accessCode")}</span>
          <input className="admin-input" type="password" value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} placeholder={ac("enterCode")} />
        </label>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <button type="submit" className="btn-primary mt-6 w-full px-5 py-3 font-mono-label">{ac("enterDashboard")}</button>
      </form>
    </div>
  );
};

const Overview = ({ bookings, fleet, stats, format }: { bookings: Booking[]; fleet: Car[]; stats: ReturnType<typeof getStats>; format: (value: number) => string }) => {
  const ac = useAdminCopy();
  const recent = bookings.slice(0, 5);
  const activity = [42, 68, 54, 82, 73, 96, 88];
  const growth = [28, 36, 45, 62, 74, 83, 104];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarClock} label={ac("totalBookings")} value={String(stats.totalBookings)} note={ac("allReservationRecords")} />
        <StatCard icon={Clock} label={ac("activeRentals")} value={String(stats.activeRentals)} note={ac("currentlyOnRoad")} />
        <StatCard icon={CarFront} label={ac("availableCars")} value={String(stats.availableCars)} note={`${fleet.length} ${ac("fleetVehicles")}`} />
        <StatCard icon={CircleDollarSign} label={ac("monthlyRevenue")} value={format(stats.monthlyRevenue)} note={ac("projectedIncome")} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title={ac("bookingActivity")} subtitle={ac("weeklyDemand")} data={activity} />
        <ChartCard title={ac("customerGrowth")} subtitle={ac("newCustomerTrend")} data={growth} tone="muted" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="admin-card">
          <PanelHeader title={ac("recentReservations")} subtitle={ac("latestBookings")} />
          <div className="mt-5 grid gap-3">
            {recent.map((booking) => (
              <div key={booking.id} className="admin-row-card">
                <div>
                  <div className="font-medium">{booking.name || ac("guestCustomer")}</div>
                  <div className="text-xs text-muted-foreground">{booking.carBrand || ""} {booking.carName || booking.carId}</div>
                </div>
                <StatusPill status={booking.status || "Pending"} />
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <PanelHeader title={ac("quickStats")} subtitle={ac("operationalSnapshot")} />
          <div className="mt-5 grid gap-3">
            <MiniStat label={ac("pendingApprovals")} value={String(stats.pending)} />
            <MiniStat label={ac("maintenanceAlerts")} value="3" />
            <MiniStat label={ac("needsFollowUp")} value={String(stats.pending)} />
            <MiniStat label={ac("vipCustomers")} value="12" />
          </div>
        </div>
      </section>
    </div>
  );
};

const VehicleManagement = ({ fleet, query }: { fleet: Car[]; query: string }) => {
  const ac = useAdminCopy();
  const [draft, setDraft] = useState<VehicleDraft>(blankVehicle);
  const [editingId, setEditingId] = useState("");
  const filtered = fleet.filter((car) => `${car.brand} ${car.name} ${car.category}`.toLowerCase().includes(query.toLowerCase()));

  const editCar = (car: Car) => {
    setEditingId(car.id);
    setDraft({
      id: car.id,
      name: car.name,
      brand: car.brand,
      category: car.category,
      pricePerDay: car.pricePerDay,
      weeklyPrice: car.pricePerDay * 6,
      monthlyPrice: car.pricePerDay * 22,
      image: car.image,
      gallery: (car.gallery?.length ? car.gallery : [car.image]).join("\n"),
      seats: car.seats,
      transmission: car.transmission,
      fuel: car.fuel,
      topSpeed: car.topSpeed,
      quantity: 1,
      availability: "Available",
      maintenance: "Ready",
    });
  };

  const uploadCarImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const uploaded = await Promise.all(Array.from(files).map(readImageFile));
    const existing = parseGallery(draft.gallery);
    const gallery = [...existing, ...uploaded];
    setDraft({ ...draft, image: draft.image || gallery[0] || "", gallery: gallery.join("\n") });
  };

  const saveVehicle = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.brand.trim()) return;

    if (editingId) {
      saveFleet(fleet.map((car) => car.id === editingId ? {
        ...car,
        name: draft.name,
        brand: draft.brand,
        category: draft.category,
        pricePerDay: Number(draft.pricePerDay) || 0,
        image: draft.image?.trim() || parseGallery(draft.gallery)[0] || fallbackCarImage,
        gallery: parseGallery(draft.gallery),
        seats: Number(draft.seats) || 5,
        transmission: draft.transmission,
        fuel: draft.fuel,
        topSpeed: Number(draft.topSpeed) || 180,
      } : car));
    } else {
      const gallery = parseGallery(draft.gallery);
      addFleetCar({ ...draft, image: draft.image?.trim() || gallery[0] || fallbackCarImage, gallery });
    }

    setDraft(blankVehicle);
    setEditingId("");
  };

  const deleteCar = (carId: string) => saveFleet(fleet.filter((car) => car.id !== carId));

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
      <form onSubmit={saveVehicle} className="admin-card">
        <PanelHeader title={editingId ? ac("editVehicle") : ac("addVehicle")} subtitle={ac("vehicleFormSubtitle")} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminInput label={ac("brand")} value={draft.brand} onChange={(value) => setDraft({ ...draft, brand: value })} />
          <AdminInput label={ac("model")} value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
          <label>
            <FieldLabel>{ac("category")}</FieldLabel>
            <select className="admin-input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Car["category"] })}>
              {vehicleCategories.map((category) => <option key={category} value={category}>{category === "Hatchback" ? ac("economy") : category}</option>)}
            </select>
          </label>
          <AdminNumber label={ac("quantity")} value={draft.quantity} onChange={(value) => setDraft({ ...draft, quantity: value })} />
          <AdminNumber label={ac("priceDay")} value={draft.pricePerDay} onChange={(value) => setDraft({ ...draft, pricePerDay: value })} />
          <AdminNumber label={ac("priceWeek")} value={draft.weeklyPrice} onChange={(value) => setDraft({ ...draft, weeklyPrice: value })} />
          <AdminNumber label={ac("priceMonth")} value={draft.monthlyPrice} onChange={(value) => setDraft({ ...draft, monthlyPrice: value })} />
          <AdminNumber label={ac("seats")} value={draft.seats} onChange={(value) => setDraft({ ...draft, seats: value })} />
          <label>
            <FieldLabel>{ac("fuelType")}</FieldLabel>
            <select className="admin-input" value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value as Car["fuel"] })}>
              <option value="Petrol">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybride</option>
              <option value="Electric">Electrique</option>
            </select>
          </label>
          <label>
            <FieldLabel>{ac("transmission")}</FieldLabel>
            <select className="admin-input" value={draft.transmission} onChange={(event) => setDraft({ ...draft, transmission: event.target.value as Car["transmission"] })}>
              <option value="Automatic">{ac("automatic")}</option>
              <option value="Manual">{ac("manual")}</option>
            </select>
          </label>
          <AdminNumber label={ac("topSpeed")} value={draft.topSpeed} onChange={(value) => setDraft({ ...draft, topSpeed: value })} />
          <label>
            <FieldLabel>{ac("maintenance")}</FieldLabel>
            <select className="admin-input" value={draft.maintenance} onChange={(event) => setDraft({ ...draft, maintenance: event.target.value as VehicleDraft["maintenance"] })}>
              <option value="Ready">{ac("ready")}</option>
              <option value="Inspection due">{ac("inspectionDue")}</option>
              <option value="Service booked">{ac("serviceBooked")}</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <FieldLabel>{ac("gallery")}</FieldLabel>
            <label className="admin-upload-zone">
              <ImagePlus className="h-5 w-5 text-primary" />
              <span>{ac("galleryHelp")}</span>
              <input type="file" accept="image/*" multiple onChange={(event) => uploadCarImages(event.target.files)} />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">{ac("galleryHelp")}</p>
            {parseGallery(draft.gallery).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {parseGallery(draft.gallery).slice(0, 6).map((url) => (
                  <button key={url} type="button" className="relative" onClick={() => {
                    const next = parseGallery(draft.gallery).filter((item) => item !== url);
                    setDraft({ ...draft, gallery: next.join("\n"), image: next[0] || "" });
                  }} aria-label={ac("removeImage")}>
                    <img src={url} alt="" className="h-14 w-20 rounded-lg border border-border object-cover" />
                    <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 text-xs text-destructive-foreground">x</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="btn-primary mt-5 px-5 py-3 font-mono-label">
          <Plus className="h-4 w-4" />
          {editingId ? ac("saveVehicle") : ac("addVehicle")}
        </button>
      </form>

      <div className="admin-card">
        <PanelHeader title={ac("fleetManagement")} subtitle={ac("fleetSubtitle")} />
        <div className="mt-5 grid gap-4">
          {filtered.map((car, index) => (
            <div key={car.id} className="admin-vehicle-row">
              <img src={car.image} alt={`${car.brand} ${car.name}`} loading="lazy" />
              <div className="min-w-0">
                <div className="car-name-font font-bold">{car.brand} {car.name}</div>
                <div className="text-xs text-muted-foreground">{car.category} / {formatFuel(car.fuel)} / {car.transmission}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusPill status={index % 4 === 0 ? "Maintenance" : "Available"} />
                  <StatusPill status={index % 3 === 0 ? "Inspection due" : "Ready"} />
                </div>
              </div>
              <div className="text-right">
                <div className="home-number-font text-primary">{car.pricePerDay} MAD</div>
                <div className="text-xs text-muted-foreground">{ac("perDay")}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="admin-icon-button" onClick={() => editCar(car)} aria-label="Edit vehicle"><Pencil className="h-4 w-4" /></button>
                <button type="button" className="admin-icon-button text-destructive" onClick={() => deleteCar(car.id)} aria-label="Delete vehicle"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const ReservationManagement = ({ bookings, fleet, query, onOpen }: { bookings: Booking[]; fleet: Car[]; query: string; onOpen: (booking: Booking) => void }) => {
  const { lang } = useI18n();
  const ac = useAdminCopy();
  const [statusFilter, setStatusFilter] = useState("All");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(RESERVATION_STATUS_KEY) || "{}") as Record<string, string>;
    } catch {
      return {};
    }
  });

  const calendarDays = buildCalendarDays(calendarMonth);
  const monthLabel = new Intl.DateTimeFormat(lang === "ar" ? "ar-MA" : lang === "fr" ? "fr-FR" : "en", { month: "long", year: "numeric" }).format(calendarMonth);
  const todayIso = toIsoDate(new Date());
  const upcoming = [...bookings]
    .filter((booking) => booking.dropoff >= todayIso)
    .sort((a, b) => a.pickup.localeCompare(b.pickup))
    .slice(0, 4);

  const updateReservationStatus = (bookingId: string, status: string) => {
    setLocalStatuses((current) => {
      const next = { ...current, [bookingId]: status };
      localStorage.setItem(RESERVATION_STATUS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const filtered = bookings.filter((booking) => {
    const status = localStatuses[booking.id] || booking.status || "Pending";
    const haystack = `${booking.name} ${booking.email} ${booking.phone} ${booking.carName} ${booking.carId}`.toLowerCase();
    const matchesDate = !selectedDate || reservationTouchesDate(booking, selectedDate);
    return (statusFilter === "All" || status === statusFilter) && matchesDate && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.35fr]">
      <div className="admin-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PanelHeader title={ac("reservationCalendar")} subtitle={ac("calendarSubtitle")} compact />
          <div className="flex items-center gap-2">
            <button type="button" className="admin-icon-button" aria-label={ac("previousMonth")} onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>{"<"}</button>
            <button type="button" className="admin-action" onClick={() => {
              const now = new Date();
              setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              setSelectedDate(toIsoDate(now));
            }}>{ac("today")}</button>
            <button type="button" className="admin-icon-button" aria-label={ac("nextMonth")} onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>{">"}</button>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl leading-none">{monthLabel}</h3>
          {selectedDate && (
            <button type="button" className="admin-action" onClick={() => setSelectedDate("")}>{ac("clear")} {selectedDate}</button>
          )}
        </div>
        <div className="mt-5 grid grid-cols-7 gap-2 text-center">
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <div key={day} className="font-mono-label text-[0.65rem] text-muted-foreground">{ac(day)}</div>
          ))}
          {calendarDays.map((day) => {
            const dayBookings = bookings.filter((booking) => reservationTouchesDate(booking, day.iso));
            const isSelected = selectedDate === day.iso;
            return (
              <button
                key={day.iso}
                type="button"
                className={`admin-calendar-day ${day.inMonth ? "" : "is-muted"} ${day.isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}`}
                onClick={() => setSelectedDate(isSelected ? "" : day.iso)}
                aria-label={`${day.iso}, ${dayBookings.length} reservations`}
              >
                <span>{day.date.getDate()}</span>
                {dayBookings.length > 0 && <span className="admin-calendar-count">{dayBookings.length}</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-3">
          <PanelHeader title={ac("upcomingBookings")} subtitle={ac("nextHandovers")} compact />
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">{ac("noUpcoming")}</p>}
          {upcoming.map((booking) => (
            <button key={booking.id} type="button" className="admin-row-card text-left" onClick={() => onOpen({ ...booking, status: localStatuses[booking.id] || booking.status || "Pending" })}>
              <div>
                <div className="font-medium">{booking.pickup} - {booking.dropoff}</div>
                <div className="text-xs text-muted-foreground">{booking.name || ac("guest")} / {booking.location || ac("pickupPending")}</div>
              </div>
              <Clock className="h-4 w-4 text-primary" />
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-center md:justify-between">
          <PanelHeader title={ac("reservationManagement")} subtitle={ac("reservationSubtitle")} compact />
          <select className="admin-input max-w-48" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">{ac("all")}</option>
            {reservationStatuses.map((status) => <option key={status} value={status}>{translateStatus(status, ac)}</option>)}
          </select>
        </div>
        {selectedDate && <p className="mt-4 text-sm text-muted-foreground">{ac("showingReservations")} {selectedDate}.</p>}
        <div className="admin-table-wrap mt-4">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ac("customer")}</th>
                <th>{ac("vehicle")}</th>
                <th>{ac("period")}</th>
                <th>{ac("pickupReturn")}</th>
                <th>{ac("status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const car = fleet.find((item) => item.id === booking.carId);
                const status = localStatuses[booking.id] || booking.status || "Pending";
                return (
                  <tr key={booking.id}>
                    <td>
                      <div className="font-medium">{booking.name || ac("guestCustomer")}</div>
                      <div className="text-xs text-muted-foreground">{booking.email || booking.phone || ac("noContact")}</div>
                    </td>
                    <td>{booking.carBrand || car?.brand} {booking.carName || car?.name || booking.carId}</td>
                    <td>{booking.pickup} - {booking.dropoff}</td>
                    <td>{booking.location || ac("agency")} / {ac("tracked")}</td>
                    <td><StatusPill status={status} /></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="admin-action" onClick={() => updateReservationStatus(booking.id, "Confirmed")}>{ac("approve")}</button>
                        <button type="button" className="admin-action" onClick={() => updateReservationStatus(booking.id, "Cancelled")}>{ac("reject")}</button>
                        <button type="button" className="admin-icon-button" onClick={() => onOpen({ ...booking, status })} aria-label={ac("openReservationDetails")}><MoreHorizontal className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted-foreground">{ac("noReservations")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const CustomerManagement = ({ bookings, query }: { bookings: Booking[]; query: string }) => {
  const ac = useAdminCopy();
  const customers = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((booking) => {
      const key = booking.email || booking.phone || booking.name || booking.id;
      map.set(key, [...(map.get(key) || []), booking]);
    });
    return Array.from(map.entries()).map(([key, history], index) => ({
      key,
      name: history[0].name || `${ac("customer")} ${index + 1}`,
      email: history[0].email || ac("noEmail"),
      phone: history[0].phone || ac("noPhone"),
      notes: index % 2 === 0 ? ac("prefersAirport") : ac("needsWhatsapp"),
      vip: history.length > 1 || index % 3 === 0,
      history,
    })).filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase()));
  }, [bookings, query, ac]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {customers.map((customer) => (
        <article key={customer.key} className="admin-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{customer.name}</h3>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
            </div>
            {customer.vip && <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">VIP</span>}
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <MiniStat label={ac("phone")} value={customer.phone} />
            <MiniStat label={ac("rentalHistory")} value={`${customer.history.length} ${ac("rentals")}`} />
            <MiniStat label={ac("driverLicense")} value={ac("uploadReady")} />
          </div>
          <p className="mt-4 rounded-2xl border border-border/70 bg-background/35 p-4 text-sm text-muted-foreground">{customer.notes}</p>
        </article>
      ))}
    </div>
  );
};

const ContentManagement = () => {
  const ac = useAdminCopy();
  const [activeContent, setActiveContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>(() => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY) || "{}") as Record<string, Record<string, string>>;
    } catch {
      return {};
    }
  });
  const items = [
    { id: "homepage", title: ac("homepageSections"), body: ac("homepageSectionsBody"), fields: ["sectionTitle", "headline", "subtitle", "primaryCta", "secondaryCta"] },
    { id: "testimonials", title: ac("testimonials"), body: ac("testimonialsBody"), fields: ["sectionTitle", "quoteOne", "quoteTwo"] },
    { id: "reviews", title: ac("reviews"), body: ac("reviewsBody"), fields: ["sectionTitle", "reviewOne", "reviewTwo"] },
    { id: "faq", title: ac("faqEditor"), body: ac("faqEditorBody"), fields: ["sectionTitle", "questionOne", "answerOne"] },
    { id: "hero", title: ac("heroCustomization"), body: ac("heroCustomizationBody"), fields: ["headline", "subtitle", "heroMedia", "primaryCta"] },
    { id: "promotions", title: ac("promotions"), body: ac("promotionsBody"), fields: ["bannerText", "discountCode", "startDate", "endDate"] },
  ];
  const selected = items.find((item) => item.id === activeContent);
  const selectedDraft = selected ? drafts[selected.id] || {} : {};

  const updateDraft = (contentId: string, field: string, value: string) => {
    setDrafts((current) => ({
      ...current,
      [contentId]: {
        ...(current[contentId] || {}),
        [field]: value,
      },
    }));
    setSavedContent("");
  };

  const saveContent = (contentId: string) => {
    localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(drafts));
    setSavedContent(contentId);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="admin-card">
            <Globe2 className="mb-6 h-6 w-6 text-primary" />
            <h3 className="text-3xl leading-none">{item.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{item.body}</p>
            <button type="button" className="btn-secondary mt-6 px-5 py-3 font-mono-label" onClick={() => {
              setActiveContent(item.id);
              setDrafts((current) => ({
                ...current,
                [item.id]: current[item.id] || Object.fromEntries(item.fields.map((field) => [field, field === "sectionBody" ? item.body : ""])),
              }));
            }}>{ac("editContent")}</button>
          </article>
        ))}
      </div>
      {selected && (
        <div className="admin-card">
          <PanelHeader title={`${ac("editing")} ${selected.title}`} subtitle={ac("draftReady")} />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {selected.fields.map((field) => (
              <label key={field} className={field.includes("Body") || field.includes("answer") || field.includes("quote") || field.includes("review") ? "md:col-span-2" : ""}>
                <FieldLabel>{ac(field)}</FieldLabel>
                {field.includes("Body") || field.includes("answer") || field.includes("quote") || field.includes("review") ? (
                  <textarea
                    className="admin-input min-h-28 resize-y"
                    value={selectedDraft[field] || ""}
                    onChange={(event) => updateDraft(selected.id, field, event.target.value)}
                  />
                ) : (
                  <input
                    className="admin-input"
                    value={selectedDraft[field] || ""}
                    onChange={(event) => updateDraft(selected.id, field, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-primary px-5 py-3 font-mono-label" onClick={() => saveContent(selected.id)}>{ac("saveChanges")}</button>
            <button type="button" className="btn-secondary px-5 py-3 font-mono-label" onClick={() => setActiveContent("")}>{ac("closeEditor")}</button>
          </div>
          {savedContent === selected.id && <p className="mt-3 text-sm text-primary">{ac("draftSaved")} {selected.title}.</p>}
        </div>
      )}
    </div>
  );
};

const Notifications = ({ alerts, setAlerts }: { alerts: AdminAlert[]; setAlerts: Dispatch<SetStateAction<AdminAlert[]>> }) => {
  const ac = useAdminCopy();
  return (
    <div className="admin-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PanelHeader title={ac("notifications")} subtitle={ac("notificationsSubtitle")} />
        <button type="button" className="admin-action" onClick={() => setAlerts([])}>{ac("clearAll")}</button>
      </div>
      <div className="mt-5 grid gap-3">
        {alerts.length === 0 && <p className="text-sm text-muted-foreground">{ac("noNotifications")}</p>}
        {alerts.map((alert) => (
          <div key={alert.title} className="admin-row-card">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{translateAlert(alert, ac).title}</div>
                <div className="text-sm text-muted-foreground">{translateAlert(alert, ac).body}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill status={alert.status} />
              <button type="button" className="admin-action" onClick={() => setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, status: "Read" } : item))}>{ac("markRead")}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPanel = ({ session, theme, setTheme }: { session: AdminSession; theme: "dark" | "light"; setTheme: (theme: "dark" | "light") => void }) => {
  const ac = useAdminCopy();
  const [settings, setSettings] = useState({
    company: "Alaoui Car Rental",
    email: "contact@alaouicarrental.com",
    whatsapp: "+212 6 12 34 56 78",
    seo: "Luxury car rental in Morocco",
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof settings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="admin-card">
        <PanelHeader title={ac("companyInfo")} subtitle={ac("companySubtitle")} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminInput label={ac("companyName")} value={settings.company} onChange={(value) => update("company", value)} />
          <AdminInput label={ac("emailSettings")} value={settings.email} onChange={(value) => update("email", value)} icon={<Mail className="h-4 w-4" />} />
          <AdminInput label={ac("whatsappIntegration")} value={settings.whatsapp} onChange={(value) => update("whatsapp", value)} />
          <AdminInput label={ac("seoTitle")} value={settings.seo} onChange={(value) => update("seo", value)} />
        </div>
        <button type="button" className="btn-primary mt-5 px-5 py-3 font-mono-label" onClick={() => setSaved(true)}>{ac("saveSettings")}</button>
        {saved && <p className="mt-3 text-sm text-primary">{ac("settingsSaved")}</p>}
      </div>
      <div className="admin-card">
        <PanelHeader title={ac("preferences")} subtitle={ac("preferencesSubtitle")} />
        <div className="mt-5 grid gap-3">
          <MiniStat label={ac("personnelAccess")} value={session.name} />
          <MiniStat label={ac("multiLanguageSupport")} value={ac("multiLanguage")} icon={<Languages className="h-4 w-4" />} />
          <MiniStat label={ac("currencySwitcher")} value="MAD / EUR / USD" />
          <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="admin-row-card text-left">
            <span>{theme === "dark" ? ac("switchLight") : ac("switchDark")}</span>
            {theme === "dark" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ booking, fleet, onClose }: { booking: Booking; fleet: Car[]; onClose: () => void }) => {
  const ac = useAdminCopy();
  const car = fleet.find((item) => item.id === booking.carId);
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <div className="font-mono-label text-primary">{ac("reservationDetails")}</div>
            <h2 className="text-4xl leading-none">{booking.name || ac("guestCustomer")}</h2>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label={ac("closeReservationDetails")}><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label={ac("vehicle")} value={`${booking.carBrand || car?.brand || ""} ${booking.carName || car?.name || booking.carId}`.trim()} />
          <Detail label={ac("status")} value={translateStatus(booking.status || "Pending", ac)} />
          <Detail label={ac("pickup")} value={booking.pickup} />
          <Detail label={ac("return")} value={booking.dropoff} />
          <Detail label={ac("location")} value={booking.location || ac("toConfirm")} />
          <Detail label={ac("payment")} value={booking.payment || ac("pending")} />
          <Detail label={ac("phone")} value={booking.phone || "-"} />
          <Detail label={ac("email")} value={booking.email || "-"} />
          <Detail label={ac("driverLicense")} value={booking.licenseConfirmed ? ac("confirmed") : ac("needsFollowUp")} />
          <Detail label={ac("total")} value={booking.total ? `${booking.total} MAD` : "-"} />
        </div>
      </div>
    </div>
  );
};

function getStats(bookings: Booking[], fleet: Car[]) {
  const today = new Date().toISOString().split("T")[0];
  return {
    totalBookings: bookings.length,
    activeRentals: bookings.filter((booking) => booking.pickup <= today && today < booking.dropoff).length,
    availableCars: Math.max(0, fleet.length - bookings.filter((booking) => booking.pickup <= today && today < booking.dropoff).length),
    monthlyRevenue: bookings.reduce((sum, booking) => sum + (booking.total || 0), 0),
    pending: bookings.filter((booking) => (booking.status || "Pending") === "Pending").length,
  };
}

function buildCalendarDays(month: Date) {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = toIsoDate(date);
    return {
      date,
      iso,
      inMonth: date.getMonth() === month.getMonth(),
      isToday: iso === toIsoDate(new Date()),
    };
  });
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function reservationTouchesDate(booking: Booking, isoDate: string) {
  return booking.pickup <= isoDate && isoDate <= booking.dropoff;
}

function parseGallery(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatFuel(fuel: Car["fuel"]) {
  if (fuel === "Petrol") return "Essence";
  if (fuel === "Hybrid") return "Hybride";
  if (fuel === "Electric") return "Electrique";
  return fuel;
}

const StatCard = ({ icon: Icon, label, value, note }: { icon: typeof CarFront; label: string; value: string; note: string }) => (
  <article className="admin-card">
    <div className="flex items-center justify-between">
      <span className="font-mono-label text-muted-foreground">{label}</span>
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="home-number-font mt-5 text-3xl text-foreground">{value}</div>
    <p className="mt-1 text-sm text-muted-foreground">{note}</p>
  </article>
);

const ChartCard = ({ title, subtitle, data, tone = "primary" }: { title: string; subtitle: string; data: number[]; tone?: "primary" | "muted" }) => {
  const max = Math.max(...data, 1);
  const total = data.reduce((sum, value) => sum + value, 0);
  const accentClass = tone === "primary" ? "bg-gradient-amber" : "bg-emerald-400/70";

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <PanelHeader title={title} subtitle={subtitle} />
        <div className="home-number-font rounded-2xl border border-border/70 bg-background/35 px-4 py-3 text-primary">
          {total}
        </div>
      </div>
      <div className="relative mt-8 h-56 rounded-2xl border border-border/60 bg-background/30 p-4">
        <div className="absolute inset-4 grid grid-rows-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="border-t border-border/45" />
          ))}
        </div>
        <div className="relative z-10 flex h-full items-end gap-3">
          {data.map((value, index) => {
            const height = Math.max(14, Math.round((value / max) * 100));
            return (
              <div key={index} className="group flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className={`w-full rounded-t-xl ${accentClass} shadow-[0_12px_32px_-18px_hsl(var(--primary))] transition-smooth group-hover:brightness-125`}
                    style={{ height: `${height}%` }}
                    title={`${value}`}
                  />
                </div>
                <span className="text-[0.65rem] text-muted-foreground">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PanelHeader = ({ title, subtitle, compact = false }: { title: string; subtitle: string; compact?: boolean }) => (
  <div>
    <h2 className={`${compact ? "text-2xl" : "text-3xl"} leading-none`}>{title}</h2>
    <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

const StatusPill = ({ status }: { status: string }) => {
  const ac = useAdminCopy();
  const tone = status.toLowerCase();
  const classes = tone.includes("cancel") || tone.includes("reject") || tone.includes("maintenance")
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : tone.includes("pending") || tone.includes("inspection")
      ? "border-primary/35 bg-primary/10 text-primary"
      : "border-emerald-400/35 bg-emerald-400/10 text-emerald-300";
  return <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${classes}`}>{translateStatus(status, ac)}</span>;
};

function translateStatus(status: string, ac: (key: string) => string) {
  const key = status.toLowerCase().replace(/\s+/g, "");
  const statusKeys: Record<string, string> = {
    pending: "pending",
    confirmed: "confirmed",
    active: "active",
    completed: "completed",
    cancelled: "cancelled",
    maintenance: "maintenanceStatus",
    available: "availableCars",
    ready: "ready",
    inspectiondue: "inspectionDue",
    servicebooked: "serviceBooked",
    unread: "unread",
    read: "read",
    live: "live",
  };
  return statusKeys[key] ? ac(statusKeys[key]) : status;
}

function translateAlert(alert: AdminAlert, ac: (key: string) => string) {
  const keys: Record<string, { title: string; body: string }> = {
    "booking-alert": { title: "alertBookingTitle", body: "alertBookingBody" },
    "maintenance-alert": { title: "alertMaintenanceTitle", body: "alertMaintenanceBody" },
    "delivery-alert": { title: "alertDeliveryTitle", body: "alertDeliveryBody" },
    "system-alert": { title: "alertSystemTitle", body: "alertSystemBody" },
  };
  const mapped = keys[alert.id];
  return mapped ? { title: ac(mapped.title), body: ac(mapped.body) } : alert;
}

const MiniStat = ({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) => (
  <div className="admin-row-card">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">{icon}{value}</span>
  </div>
);

const AdminInput = ({ label, value, onChange, icon }: { label: string; value: string; onChange: (value: string) => void; icon?: ReactNode }) => (
  <label>
    <FieldLabel>{label}</FieldLabel>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <input className={`admin-input ${icon ? "pl-10" : ""} ${/phone|whatsapp|email/i.test(label) ? "contact-ltr" : ""}`} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  </label>
);

const AdminNumber = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
  <label>
    <FieldLabel>{label}</FieldLabel>
    <input className="admin-input" inputMode="numeric" value={value} onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")) || 0)} />
  </label>
);

const FieldLabel = ({ children }: { children: ReactNode }) => <span className="font-mono-label mb-2 block text-primary">{children}</span>;

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
    <div className="font-mono-label text-muted-foreground">{label}</div>
    <div className="mt-1 text-sm text-foreground">{value}</div>
  </div>
);

const AdminStyles = () => (
  <style>{`
    .admin-suite {
      --admin-surface: hsl(var(--card) / 0.72);
      min-height: calc(100vh - 6rem);
      display: grid;
      grid-template-columns: 17rem minmax(0, 1fr);
      color: hsl(var(--foreground));
    }
    .admin-suite-light {
      --admin-surface: hsl(36 35% 94% / 0.88);
      --background: 36 35% 96%;
      --foreground: 30 12% 10%;
      --card: 36 28% 98%;
      --muted-foreground: 30 7% 42%;
      --border: 34 18% 78%;
      --input: 36 35% 98%;
    }
    .admin-sidebar {
      position: sticky;
      top: 6rem;
      height: calc(100vh - 6rem);
      display: flex;
      flex-direction: column;
      border-right: 1px solid hsl(var(--border) / 0.65);
      background: linear-gradient(180deg, hsl(var(--background) / 0.88), hsl(var(--card) / 0.72));
      backdrop-filter: blur(22px);
      z-index: 30;
    }
    .admin-workspace { min-width: 0; }
    .admin-topbar {
      position: sticky;
      top: 5.25rem;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem clamp(1rem, 3vw, 2rem);
      border-bottom: 1px solid hsl(var(--border) / 0.55);
      background: hsl(var(--background) / 0.72);
      backdrop-filter: blur(22px);
    }
    .admin-content {
      padding: clamp(1rem, 3vw, 2rem);
    }
    .admin-card {
      border: 1px solid hsl(var(--border) / 0.72);
      border-radius: 1.35rem;
      background: var(--admin-surface);
      box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.04), 0 22px 70px -48px hsl(0 0% 0% / 0.8);
      padding: 1.25rem;
    }
    .admin-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-radius: 1rem;
      padding: 0.9rem 1rem;
      color: hsl(var(--muted-foreground));
      transition: all 0.25s var(--transition-smooth);
      text-align: left;
    }
    .admin-nav-item:hover,
    .admin-nav-item.is-active {
      background: hsl(var(--primary) / 0.12);
      color: hsl(var(--primary));
    }
    .admin-icon-button {
      display: inline-flex;
      height: 2.55rem;
      width: 2.55rem;
      align-items: center;
      justify-content: center;
      border: 1px solid hsl(var(--border) / 0.8);
      border-radius: 0.9rem;
      background: hsl(var(--card) / 0.55);
      color: hsl(var(--foreground));
    }
    .admin-search,
    .admin-profile {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      border: 1px solid hsl(var(--border) / 0.75);
      border-radius: 999px;
      background: hsl(var(--card) / 0.5);
      padding: 0.75rem 1rem;
    }
    .admin-search input {
      width: min(22rem, 28vw);
      background: transparent;
      outline: none;
      color: hsl(var(--foreground));
      font-size: 0.875rem;
    }
    .admin-input {
      width: 100%;
      border: 1px solid hsl(var(--border) / 0.8);
      border-radius: 0.95rem;
      background: hsl(var(--input) / 0.82);
      color: hsl(var(--foreground));
      padding: 0.85rem 1rem;
      outline: none;
    }
    .admin-input:focus { border-color: hsl(var(--primary)); }
    .admin-upload-zone {
      display: flex;
      min-height: 8rem;
      cursor: pointer;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      border: 1px dashed hsl(var(--primary) / 0.55);
      border-radius: 1.1rem;
      background: hsl(var(--primary) / 0.08);
      padding: 1rem;
      text-align: center;
      color: hsl(var(--muted-foreground));
      transition: border-color 0.2s var(--transition-smooth), background 0.2s var(--transition-smooth);
    }
    .admin-upload-zone:hover {
      border-color: hsl(var(--primary));
      background: hsl(var(--primary) / 0.13);
    }
    .admin-upload-zone input {
      display: none;
    }
    .admin-row-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border: 1px solid hsl(var(--border) / 0.65);
      border-radius: 1rem;
      background: hsl(var(--background) / 0.36);
      padding: 0.95rem;
    }
    .admin-vehicle-row {
      display: grid;
      grid-template-columns: 5.5rem minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 1rem;
      border: 1px solid hsl(var(--border) / 0.65);
      border-radius: 1.2rem;
      background: hsl(var(--background) / 0.36);
      padding: 0.8rem;
    }
    .admin-vehicle-row img {
      width: 5.5rem;
      height: 4rem;
      border-radius: 0.9rem;
      object-fit: cover;
    }
    .admin-action {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: 1px solid hsl(var(--border) / 0.8);
      border-radius: 999px;
      padding: 0.5rem 0.8rem;
      font-size: 0.75rem;
      color: hsl(var(--foreground));
    }
    .admin-notification-popover {
      position: absolute;
      right: 0;
      top: calc(100% + 0.75rem);
      z-index: 60;
      width: min(24rem, calc(100vw - 2rem));
      border: 1px solid hsl(var(--border) / 0.78);
      border-radius: 1.25rem;
      background: linear-gradient(180deg, hsl(var(--card) / 0.96), hsl(var(--background) / 0.92));
      box-shadow: 0 28px 80px -38px hsl(0 0% 0% / 0.88), inset 0 1px 0 hsl(0 0% 100% / 0.05);
      padding: 1rem;
      backdrop-filter: blur(22px);
    }
    .admin-notification-preview {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border: 1px solid hsl(var(--border) / 0.62);
      border-radius: 1rem;
      background: hsl(var(--background) / 0.38);
      padding: 0.85rem;
      text-align: left;
      transition: border-color 0.2s var(--transition-smooth), background 0.2s var(--transition-smooth);
    }
    .admin-notification-preview:hover {
      border-color: hsl(var(--primary) / 0.5);
      background: hsl(var(--primary) / 0.08);
    }
    .admin-calendar-day {
      position: relative;
      display: flex;
      min-height: 3.2rem;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      border: 1px solid hsl(var(--border) / 0.68);
      border-radius: 1rem;
      background: hsl(var(--background) / 0.38);
      padding: 0.55rem;
      color: hsl(var(--foreground));
      text-align: left;
      transition: border-color 0.2s var(--transition-smooth), background 0.2s var(--transition-smooth), transform 0.2s var(--transition-smooth);
    }
    .admin-calendar-day:hover {
      border-color: hsl(var(--primary) / 0.75);
      background: hsl(var(--primary) / 0.1);
      transform: translateY(-1px);
    }
    .admin-calendar-day.is-muted {
      opacity: 0.38;
    }
    .admin-calendar-day.is-today {
      border-color: hsl(var(--primary));
      box-shadow: inset 0 0 0 1px hsl(var(--primary) / 0.35);
    }
    .admin-calendar-day.is-selected {
      background: hsl(var(--primary) / 0.18);
      color: hsl(var(--primary));
    }
    .admin-calendar-count {
      display: inline-flex;
      min-width: 1.35rem;
      height: 1.35rem;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      font-size: 0.7rem;
      font-weight: 800;
    }
    .admin-table-wrap { overflow-x: auto; }
    .admin-table { width: 100%; min-width: 760px; border-collapse: collapse; font-size: 0.875rem; }
    .admin-table th {
      padding: 0.8rem;
      text-align: left;
      color: hsl(var(--muted-foreground));
      font-weight: 700;
      border-bottom: 1px solid hsl(var(--border) / 0.7);
    }
    .admin-table td {
      padding: 0.9rem 0.8rem;
      border-bottom: 1px solid hsl(var(--border) / 0.55);
      vertical-align: middle;
    }
    .admin-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 80;
      display: grid;
      place-items: center;
      background: hsl(0 0% 0% / 0.72);
      padding: 1rem;
      backdrop-filter: blur(10px);
    }
    .admin-modal {
      width: min(48rem, 100%);
      max-height: calc(100vh - 2rem);
      overflow-y: auto;
      border: 1px solid hsl(var(--border));
      border-radius: 1.5rem;
      background: hsl(var(--card));
      padding: 1.25rem;
      box-shadow: var(--shadow-elegant);
    }
    .admin-backdrop {
      position: fixed;
      inset: 0;
      z-index: 25;
      background: hsl(0 0% 0% / 0.5);
    }
    @media (max-width: 1023px) {
      .admin-suite { display: block; }
      .admin-sidebar {
        position: fixed;
        inset-block: 0;
        left: 0;
        top: 0;
        height: 100vh;
        width: min(18rem, 86vw);
        transform: translateX(-105%);
        transition: transform 0.3s var(--transition-smooth);
      }
      .admin-sidebar.is-open { transform: translateX(0); }
      .admin-topbar { top: 5rem; }
    }
    @media (max-width: 640px) {
      .admin-content { padding: 1rem; }
      .admin-topbar { align-items: flex-start; }
      .admin-vehicle-row {
        grid-template-columns: 4.5rem minmax(0, 1fr);
      }
      .admin-vehicle-row > div:nth-child(3),
      .admin-vehicle-row > div:nth-child(4) {
        grid-column: 1 / -1;
        text-align: left;
      }
    }
  `}</style>
);

export default Admin;



