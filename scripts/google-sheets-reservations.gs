const SHEET_NAME = "Reservations";
const CARS_SHEET_NAME = "voiture disponibilite";

const HEADERS = [
  "id",
  "createdAt",
  "carId",
  "pickup",
  "dropoff",
  "name",
  "email",
  "phone",
  "location",
  "mileage",
  "payment",
  "total",
  "carName",
  "carBrand",
  "carCategory",
  "pricePerDay",
  "days",
  "status",
  "licenseConfirmed",
];

const CAR_HEADERS = [
  "id",
  "brand",
  "name",
  "quantite",
  "statuts",
  "category",
  "pricePerDay",
  "seats",
  "transmission",
  "fuel",
  "topSpeed",
  "engine",
  "power",
  "consumption",
  "luggage",
  "description",
  "features",
];

const CARS = [
  {
    id: "clio-5",
    brand: "Renault",
    name: "Clio 5",
    category: "Hatchback",
    pricePerDay: 390,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 200,
    engine: "1.0 TCe",
    power: "90 hp",
    consumption: "5.2 L/100 km",
    luggage: "391 L",
    description: "A nimble city hatchback with sharp lines and modern tech. Perfect for navigating Moroccan streets with style and efficiency.",
    features: "Touchscreen infotainment, Rear camera, Cruise control, Bluetooth, LED headlights",
  },
  {
    id: "opel-corsa",
    brand: "Opel",
    name: "Corsa",
    category: "Hatchback",
    pricePerDay: 380,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 207,
    engine: "1.2 Turbo",
    power: "100 hp",
    consumption: "5.1 L/100 km",
    luggage: "309 L",
    description: "Compact, efficient, and surprisingly refined. The Corsa brings German engineering to everyday Moroccan driving.",
    features: "Apple CarPlay, Lane assist, Auto climate, Keyless entry, Parking sensors",
  },
  {
    id: "dacia-logan",
    brand: "Dacia",
    name: "Logan",
    category: "Sedan",
    pricePerDay: 290,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 175,
    engine: "1.0 SCe",
    power: "73 hp",
    consumption: "5.6 L/100 km",
    luggage: "528 L",
    description: "Morocco's favorite sedan. Spacious, reliable, and unbeatable value for long-distance comfort.",
    features: "Spacious trunk, ABS + ESP, Isofix mounts, Manual AC, Electric windows",
  },
  {
    id: "dacia-sandero",
    brand: "Dacia",
    name: "Sandero",
    category: "Hatchback",
    pricePerDay: 320,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 170,
    engine: "1.0 SCe",
    power: "73 hp",
    consumption: "5.4 L/100 km",
    luggage: "328 L",
    description: "The practical choice that never compromises. A versatile hatchback ready for city commutes and weekend getaways.",
    features: "Generous boot space, MediaNav system, Rear bench fold, Power steering, Central locking",
  },
  {
    id: "peugeot-208",
    brand: "Peugeot",
    name: "208",
    category: "Hatchback",
    pricePerDay: 450,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 215,
    engine: "1.2 PureTech",
    power: "130 hp",
    consumption: "5.4 L/100 km",
    luggage: "311 L",
    description: "Bold French design meets advanced technology. The 208 turns every drive into a statement.",
    features: "3D i-Cockpit, Wireless charging, Active safety brake, Ambient lighting, Panoramic roof",
  },
  {
    id: "mercedes-a",
    brand: "Mercedes-Benz",
    name: "Class A",
    category: "Hatchback",
    pricePerDay: 790,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 230,
    engine: "1.3 Turbo",
    power: "163 hp",
    consumption: "6.0 L/100 km",
    luggage: "355 L",
    description: "The entry to Mercedes luxury. A premium hatchback with a stunning interior and commanding road presence.",
    features: "MBUX voice control, Ambient lighting, Dual-zone climate, Blind spot assist, Premium audio",
  },
  {
    id: "mercedes-s",
    brand: "Mercedes-Benz",
    name: "Class S",
    category: "Luxury",
    pricePerDay: 1490,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 250,
    engine: "3.0 I6",
    power: "435 hp",
    consumption: "8.2 L/100 km",
    luggage: "550 L",
    description: "The benchmark of automotive excellence. Arrive anywhere in Morocco with unmatched grace and presence.",
    features: "Air suspension, Massage seats, Rear entertainment, Night vision, Burmester audio",
  },
  {
    id: "ford-raptor",
    brand: "Ford",
    name: "Raptor",
    category: "Pickup",
    pricePerDay: 890,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 170,
    engine: "3.0 V6 EcoBoost",
    power: "288 hp",
    consumption: "11.5 L/100 km",
    luggage: "1564 L",
    description: "Built for Morocco's diverse terrain. From Atlas mountains to Sahara dunes, the Raptor conquers all.",
    features: "4WD terrain modes, Fox suspension, Trail control, Towing package, Off-road tyres",
  },
  {
    id: "audi-rs3",
    brand: "Audi",
    name: "RS3",
    category: "Sports",
    pricePerDay: 1190,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 250,
    engine: "2.5 TFSI",
    power: "400 hp",
    consumption: "8.8 L/100 km",
    luggage: "282 L",
    description: "A five-cylinder symphony of performance. The RS3 delivers track-honed thrills with everyday usability.",
    features: "Quattro AWD, Virtual cockpit, Sport exhaust, Carbon inlays, Launch control",
  },
  {
    id: "audi-a6",
    brand: "Audi",
    name: "A6",
    category: "Sedan",
    pricePerDay: 890,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 245,
    engine: "2.0 TFSI",
    power: "245 hp",
    consumption: "7.0 L/100 km",
    luggage: "530 L",
    description: "Executive elegance redefined. The A6 is the perfect companion for business trips across Morocco.",
    features: "MMI touch response, Matrix LED, Four-zone climate, Adaptive cruise, Head-up display",
  },
  {
    id: "audi-a8",
    brand: "Audi",
    name: "A8",
    category: "Luxury",
    pricePerDay: 1390,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 250,
    engine: "3.0 TFSI",
    power: "340 hp",
    consumption: "8.0 L/100 km",
    luggage: "505 L",
    description: "Flagship luxury that moves in silence. The A8 offers first-class travel for discerning passengers.",
    features: "Predictive air suspension, Rear relaxation seats, Fragrance system, Laser headlights, Bang & Olufsen audio",
  },
];

const COMPANY_NAME = "Alaoui Car Rental";
const REPLY_TO_EMAIL = "contact@alaouicarrental.com";
const CONTACT_PHONE = "+212 5 22 00 01 88";
const COMPANY_LOGO_SVG = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M157 312C113 277 97 218 119 166C145 104 209 68 276 77C344 86 395 137 406 202" stroke="#1f9d45" stroke-width="24" stroke-linecap="round"/>
  <path d="M120 262C126 240 141 231 164 228L188 216C214 203 243 197 272 199L330 203C345 204 357 210 369 219L399 242C430 245 451 259 461 284L455 314C452 321 446 325 438 325H421C416 304 399 290 377 290C354 290 337 304 332 325H226C221 304 204 290 181 290C159 290 142 304 137 325H118C111 325 105 321 103 314L99 292C97 278 105 266 120 262Z" fill="#17232c"/>
  <path d="M207 221C231 212 256 208 283 210L323 213C338 214 351 220 362 230L382 247L205 242C190 241 187 233 199 225L207 221Z" fill="#ffffff"/>
  <circle cx="181" cy="326" r="38" fill="#17232c"/>
  <circle cx="181" cy="326" r="24" fill="#ffffff"/>
  <circle cx="181" cy="326" r="13" fill="#17232c"/>
  <circle cx="377" cy="326" r="38" fill="#17232c"/>
  <circle cx="377" cy="326" r="24" fill="#ffffff"/>
  <circle cx="377" cy="326" r="13" fill="#17232c"/>
  <circle cx="268" cy="351" r="42" fill="#17232c"/>
  <circle cx="284" cy="341" r="12" fill="#ffffff"/>
  <path d="M237 377L179 424L176 453H197L201 438H220L224 423H244L257 410" stroke="#17232c" stroke-width="18" stroke-linejoin="round"/>
  <path d="M235 377L182 420" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
</svg>`;

const RESERVATION_HEADER_ALIASES = {
  id: "id",
  reservationid: "id",
  reference: "id",
  ref: "id",
  createdat: "createdAt",
  created: "createdAt",
  datecreation: "createdAt",
  date: "createdAt",
  statut: "status",
  status: "status",
  etat: "status",
  carid: "carId",
  idvoiture: "carId",
  voitureid: "carId",
  voiture: "carName",
  vehicule: "carName",
  véhicule: "carName",
  car: "carName",
  carname: "carName",
  nomvoiture: "carName",
  marque: "carBrand",
  brand: "carBrand",
  carbrand: "carBrand",
  categorie: "carCategory",
  catégorie: "carCategory",
  category: "carCategory",
  carcategory: "carCategory",
  prixjour: "pricePerDay",
  prixparjour: "pricePerDay",
  priceperday: "pricePerDay",
  pickup: "pickup",
  depart: "pickup",
  départ: "pickup",
  datedepart: "pickup",
  datedépart: "pickup",
  datedebut: "pickup",
  datedébut: "pickup",
  debut: "pickup",
  début: "pickup",
  dropoff: "dropoff",
  retour: "dropoff",
  dateretour: "dropoff",
  datefin: "dropoff",
  fin: "dropoff",
  days: "days",
  jours: "days",
  duree: "days",
  durée: "days",
  nom: "name",
  client: "name",
  name: "name",
  nomclient: "name",
  email: "email",
  mail: "email",
  telephone: "phone",
  téléphone: "phone",
  tel: "phone",
  phone: "phone",
  whatsapp: "phone",
  ville: "location",
  city: "location",
  location: "location",
  lieu: "location",
  kilometrage: "mileage",
  kilométrage: "mileage",
  mileage: "mileage",
  km: "mileage",
  paiement: "payment",
  payment: "payment",
  modepaiement: "payment",
  total: "total",
  montant: "total",
  prix: "total",
  licenseconfirmed: "licenseConfirmed",
  permis: "licenseConfirmed",
};

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastColumn() === 0 || !sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  return sheet;
}

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function resolveReservationField(header) {
  const normalized = normalizeHeader(header);
  return RESERVATION_HEADER_ALIASES[normalized] || header;
}

function getReservationHeaders(sheet) {
  const width = Math.max(sheet.getLastColumn(), HEADERS.length);
  return sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
}

function reservationValue(row, headers, field) {
  const index = headers.findIndex((header) => resolveReservationField(header) === field);
  return index >= 0 ? row[index] : "";
}

function appendReservation(sheet, reservation) {
  const headers = getReservationHeaders(sheet);
  const row = headers.map((header) => {
    const field = resolveReservationField(header);
    return reservation[field] || "";
  });
  sheet.appendRow(row);
}

function findCarIdByName(value) {
  const normalized = normalizeHeader(value);
  const car = CARS.find((item) => normalizeHeader(`${item.brand} ${item.name}`) === normalized || normalizeHeader(item.name) === normalized);
  return car ? car.id : "";
}

function syncCarsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CARS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CARS_SHEET_NAME);
  }

  sheet.getRange(1, 1, 1, CAR_HEADERS.length).setValues([CAR_HEADERS]);

  const existing = sheet.getDataRange().getValues().slice(1);
  const controlById = {};
  existing.forEach((row) => {
    if (row[0]) {
      controlById[String(row[0])] = {
        quantite: row[3] || 1,
        statuts: row[4] || "Disponible",
      };
    }
  });

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, CAR_HEADERS.length).clearContent();
  }

  sheet.getRange(2, 1, CARS.length, CAR_HEADERS.length).setValues(
    CARS.map((car) => {
      const control = controlById[car.id] || { quantite: 1, statuts: "Disponible" };
      return CAR_HEADERS.map((header) => {
        if (header === "quantite") return control.quantite;
        if (header === "statuts") return control.statuts;
        return car[header] || "";
      });
    })
  );

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Disponible", "Indisponible"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 5, CARS.length, 1).setDataValidation(statusRule);

  sheet.autoResizeColumns(1, CAR_HEADERS.length);
}

function readAvailability() {
  syncCarsSheet();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CARS_SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  return values.slice(1).filter((row) => row[0]).map((row) => ({
    carId: String(row[0]),
    quantity: Number(row[3] || 0),
    status: String(row[4] || "Indisponible"),
  }));
}

function readBookings() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = getReservationHeaders(sheet);

  return values.slice(1).map((row) => {
    const carId = reservationValue(row, headers, "carId") || findCarIdByName(reservationValue(row, headers, "carName"));
    return {
    id: String(reservationValue(row, headers, "id")),
    createdAt: formatCellDate(reservationValue(row, headers, "createdAt")),
    carId: String(carId),
    pickup: formatCellDate(reservationValue(row, headers, "pickup")),
    dropoff: formatCellDate(reservationValue(row, headers, "dropoff")),
    name: String(reservationValue(row, headers, "name") || ""),
    email: String(reservationValue(row, headers, "email") || ""),
    phone: String(reservationValue(row, headers, "phone") || ""),
    location: String(reservationValue(row, headers, "location") || ""),
    mileage: String(reservationValue(row, headers, "mileage") || ""),
    payment: String(reservationValue(row, headers, "payment") || ""),
    total: Number(reservationValue(row, headers, "total") || 0),
    carName: String(reservationValue(row, headers, "carName") || ""),
    carBrand: String(reservationValue(row, headers, "carBrand") || ""),
    carCategory: String(reservationValue(row, headers, "carCategory") || ""),
    pricePerDay: Number(reservationValue(row, headers, "pricePerDay") || 0),
    days: Number(reservationValue(row, headers, "days") || 0),
    status: String(reservationValue(row, headers, "status") || ""),
    licenseConfirmed: String(reservationValue(row, headers, "licenseConfirmed") || ""),
    };
  }).filter((booking) => booking.carId && booking.pickup && booking.dropoff);
}

function formatCellDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(value || "");
}

function doGet(e) {
  if (e.parameter.action === "createReservation") {
    syncCarsSheet();
    const sheet = getSheet();
    const p = e.parameter;

    appendReservation(sheet, p);
    sendReservationConfirmation(p);

    return jsonResponse(e, { ok: true });
  }

  const payload = JSON.stringify({ bookings: readBookings(), availability: readAvailability() });
  const callback = e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${payload});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(e, data) {
  const payload = JSON.stringify(data);
  const callback = e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${payload});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  syncCarsSheet();
  const sheet = getSheet();
  const p = e.parameter;

  appendReservation(sheet, p);
  sendReservationConfirmation(p);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendReservationConfirmation(reservation) {
  if (!reservation.email) return;

  const selectedCar = reservation.carName || reservation.carId || "-";
  const selectedProduct = reservation.carBrand ? `${reservation.carBrand} ${selectedCar}` : selectedCar;
  const subject = `${COMPANY_NAME} - Reservation confirmation`;
  const plainBody = [
    `Hello ${reservation.name || ""},`,
    "",
    "Your reservation is confirmed. Here are your reservation details:",
    "",
    `Selected car: ${selectedProduct}`,
    `Category: ${reservation.carCategory || "-"}`,
    `Pick-up date: ${reservation.pickup || "-"}`,
    `Drop-off date: ${reservation.dropoff || "-"}`,
    `Days: ${reservation.days || "-"}`,
    `City: ${reservation.location || "-"}`,
    `Mileage: ${reservation.mileage || "-"}`,
    `Payment: ${reservation.payment || "-"}`,
    `Total: ${reservation.total || "0"} MAD`,
    "",
    "Our team will contact you soon with the final delivery details.",
    "",
    `${COMPANY_NAME}`,
    CONTACT_PHONE,
  ].join("\n");

  const htmlBody = `
    <div style="margin:0;padding:0;background:#f4f6f5;font-family:Arial,Helvetica,sans-serif;color:#17232c;line-height:1.5">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f4f6f5;padding:24px 0">
        <tr>
          <td align="center" style="padding:24px 12px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:collapse;background:#ffffff;border:1px solid #e1e6e3;border-radius:14px;overflow:hidden">
              <tr>
                <td style="background:#17232c;padding:26px 28px;color:#ffffff">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                    <tr>
                      <td style="width:74px;vertical-align:middle">
                        <img src="cid:companyLogo" width="58" height="58" alt="${escapeHtml(COMPANY_NAME)}" style="display:block;width:58px;height:58px;border-radius:12px;background:#ffffff;padding:6px">
                      </td>
                      <td style="vertical-align:middle">
                        <div style="font-size:22px;font-weight:700;letter-spacing:.3px">${COMPANY_NAME}</div>
                        <div style="font-size:13px;color:#d8efe0;margin-top:2px">Reservation confirmation</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:30px 28px 18px">
                  <div style="display:inline-block;background:#e8f7ed;color:#1f9d45;border:1px solid #b9e8c8;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px">Confirmed request</div>
                  <h1 style="margin:18px 0 10px;font-size:28px;line-height:1.15;color:#17232c">Your reservation has been received</h1>
                  <p style="margin:0;color:#5b6560;font-size:15px">Hello ${escapeHtml(reservation.name || "")}, your request for <strong style="color:#17232c">${escapeHtml(selectedProduct)}</strong> has been sent to our team. We will contact you soon with the final delivery details.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 24px">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;background:#fbfcfb;border:1px solid #e1e6e3;border-radius:12px;overflow:hidden">
                    ${emailRow("Selected car", selectedProduct)}
                    ${emailRow("Category", reservation.carCategory)}
                    ${emailRow("Pick-up date", reservation.pickup)}
                    ${emailRow("Drop-off date", reservation.dropoff)}
                    ${emailRow("Days", reservation.days)}
                    ${emailRow("City", reservation.location)}
                    ${emailRow("Mileage", reservation.mileage)}
                    ${emailRow("Payment", reservation.payment)}
                    ${emailRow("Total", `${reservation.total || "0"} MAD`, true)}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 30px">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#17232c;border-radius:12px">
                    <tr>
                      <td style="padding:18px 20px;color:#ffffff">
                        <div style="font-size:14px;font-weight:700;margin-bottom:4px">Need help?</div>
                        <div style="font-size:13px;color:#d7dedb">Call us at ${CONTACT_PHONE} or reply to this email.</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <div style="max-width:640px;margin:14px auto 0;color:#7b8580;font-size:12px;text-align:center">
              ${COMPANY_NAME} · Casablanca · Marrakech · Rabat
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;

  MailApp.sendEmail({
    to: reservation.email,
    subject,
    body: plainBody,
    htmlBody,
    inlineImages: {
      companyLogo: Utilities.newBlob(COMPANY_LOGO_SVG, "image/svg+xml", "alaoui-car-rental-logo.svg"),
    },
    replyTo: REPLY_TO_EMAIL,
    name: COMPANY_NAME,
  });
}

function emailRow(label, value, highlight) {
  const valueStyle = highlight
    ? "font-size:18px;font-weight:800;color:#1f9d45;text-align:right"
    : "font-size:14px;font-weight:700;color:#17232c;text-align:right";
  return `
    <tr>
      <td style="border-bottom:1px solid #e1e6e3;padding:13px 16px;color:#68736e;font-size:13px">${escapeHtml(label)}</td>
      <td style="border-bottom:1px solid #e1e6e3;padding:13px 16px;${valueStyle}">${escapeHtml(value || "-")}</td>
    </tr>
  `;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
