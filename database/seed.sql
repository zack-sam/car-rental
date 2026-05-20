-- Seed data for Alaoui Car Rental
-- Run after database/schema.sql

INSERT INTO admin_users (full_name, email, password_hash, role)
VALUES
  ('Admin Manager', 'admin@alaouicarrental.com', 'replace_with_bcrypt_hash', 'Admin'),
  ('Rental Staff', 'staff@alaouicarrental.com', 'replace_with_bcrypt_hash', 'Staff')
ON CONFLICT (email) DO NOTHING;

INSERT INTO company_settings (
  company_name,
  phone,
  whatsapp,
  email,
  instagram,
  address,
  default_language,
  default_currency,
  seo_title,
  seo_description,
  seo_keywords,
  geo_city,
  geo_country
)
VALUES (
  'Alaoui Car Rental',
  '+212 5 22 00 01 88',
  '+212 6 12 34 56 78',
  'contact@alaouicarrental.com',
  'alaoui.carrental',
  'Casablanca, Morocco',
  'fr',
  'MAD',
  'Alaoui Car Rental | Car rental in Morocco',
  'Luxury, SUV, economy, and sports car rental in Morocco with clear prices and delivery in Casablanca, Marrakech, and Rabat.',
  ARRAY['car rental Morocco', 'location voiture Maroc', 'Alaoui Car Rental', 'luxury car rental Casablanca'],
  'Casablanca',
  'Morocco'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  instagram = EXCLUDED.instagram,
  address = EXCLUDED.address,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  geo_city = EXCLUDED.geo_city,
  geo_country = EXCLUDED.geo_country;

INSERT INTO vehicles (
  id, brand, model, category, quantity, price_per_day, price_per_week, price_per_month,
  main_image_url, seats, transmission, fuel, top_speed, engine, power, consumption, luggage,
  description_en, description_fr, description_ar, status, maintenance_status
)
VALUES
  ('clio-5', 'Renault', 'Clio 5', 'Economy', 1, 390, 2340, 8580, '/assets/car-clio.jpg', 5, 'Manual', 'Essence', 200, '1.0 TCe', '90 hp', '5.2 L/100 km', '391 L', 'A nimble city hatchback with sharp lines and modern tech.', 'Une citadine agile avec des lignes modernes et une technologie pratique.', 'سيارة مدينة خفيفة بتصميم عصري وتجهيزات عملية.', 'Available', 'Ready'),
  ('opel-corsa', 'Opel', 'Corsa', 'Economy', 1, 380, 2280, 8360, '/assets/car-corsa.jpg', 5, 'Manual', 'Essence', 207, '1.2 Turbo', '100 hp', '5.1 L/100 km', '309 L', 'Compact, efficient, and refined for everyday driving.', 'Compacte, économique et confortable pour les trajets quotidiens.', 'سيارة مدمجة واقتصادية ومريحة للاستعمال اليومي.', 'Available', 'Ready'),
  ('dacia-logan', 'Dacia', 'Logan', 'Sedan', 1, 290, 1740, 6380, '/assets/car-logan.jpg', 5, 'Manual', 'Essence', 175, '1.0 SCe', '73 hp', '5.6 L/100 km', '528 L', 'A spacious sedan with reliable long-distance comfort.', 'Une berline spacieuse et fiable pour les longs trajets.', 'سيارة سيدان واسعة وموثوقة للرحلات الطويلة.', 'Available', 'Ready'),
  ('dacia-sandero', 'Dacia', 'Sandero', 'Economy', 1, 320, 1920, 7040, '/assets/car-sandero.jpg', 5, 'Manual', 'Essence', 170, '1.0 SCe', '73 hp', '5.4 L/100 km', '328 L', 'A practical hatchback for city commutes and weekend trips.', 'Une compacte pratique pour la ville et les escapades.', 'سيارة عملية للمدينة ونهايات الأسبوع.', 'Available', 'Ready'),
  ('peugeot-208', 'Peugeot', '208', 'Economy', 1, 450, 2700, 9900, '/assets/car-208.jpg', 5, 'Automatic', 'Essence', 215, '1.2 PureTech', '130 hp', '5.4 L/100 km', '311 L', 'Bold French design with advanced comfort technology.', 'Design français audacieux avec une technologie confortable.', 'تصميم فرنسي أنيق مع تجهيزات راحة متقدمة.', 'Available', 'Ready'),
  ('mercedes-a', 'Mercedes-Benz', 'Class A', 'Luxury', 1, 790, 4740, 17380, '/assets/car-merc-a.jpg', 5, 'Automatic', 'Essence', 230, '1.3 Turbo', '163 hp', '6.0 L/100 km', '355 L', 'Premium compact Mercedes comfort and presence.', 'Confort premium Mercedes dans une compacte élégante.', 'راحة مرسيدس الفاخرة في سيارة مدمجة أنيقة.', 'Available', 'Ready'),
  ('mercedes-s', 'Mercedes-Benz', 'Class S', 'Luxury', 1, 1490, 8940, 32780, '/assets/car-merc-s.jpg', 5, 'Automatic', 'Essence', 250, '3.0 I6', '435 hp', '8.2 L/100 km', '550 L', 'The benchmark of executive luxury travel.', 'La référence du voyage exécutif de luxe.', 'معيار الفخامة التنفيذية في السفر.', 'Available', 'Ready'),
  ('ford-raptor', 'Ford', 'Raptor', 'SUV', 1, 890, 5340, 19580, '/assets/car-raptor.jpg', 5, 'Automatic', 'Essence', 170, '3.0 V6 EcoBoost', '288 hp', '11.5 L/100 km', '1564 L', 'Built for Morocco terrain, mountains, and desert routes.', 'Conçu pour les routes marocaines, montagnes et désert.', 'مصممة للتضاريس المغربية والجبال والصحراء.', 'Available', 'Ready'),
  ('audi-rs3', 'Audi', 'RS3', 'Sport', 1, 1190, 7140, 26180, '/assets/car-rs3.jpg', 5, 'Automatic', 'Essence', 250, '2.5 TFSI', '400 hp', '8.8 L/100 km', '282 L', 'A performance sedan with everyday usability.', 'Une sportive performante utilisable au quotidien.', 'سيارة رياضية قوية ومناسبة للاستعمال اليومي.', 'Available', 'Ready'),
  ('audi-a6', 'Audi', 'A6', 'Sedan', 1, 890, 5340, 19580, '/assets/car-a6.jpg', 5, 'Automatic', 'Essence', 245, '2.0 TFSI', '245 hp', '7.0 L/100 km', '530 L', 'Executive elegance for business trips across Morocco.', 'Élégance exécutive pour les déplacements professionnels.', 'أناقة تنفيذية لرحلات العمل في المغرب.', 'Available', 'Ready'),
  ('audi-a8', 'Audi', 'A8', 'Luxury', 1, 1390, 8340, 30580, '/assets/car-a8.jpg', 5, 'Automatic', 'Essence', 250, '3.0 TFSI', '340 hp', '8.0 L/100 km', '505 L', 'Flagship quiet luxury for first-class travel.', 'Luxe silencieux haut de gamme pour voyager en première classe.', 'فخامة هادئة من أعلى مستوى لتجربة سفر راقية.', 'Available', 'Ready')
ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  price_per_day = EXCLUDED.price_per_day,
  price_per_week = EXCLUDED.price_per_week,
  price_per_month = EXCLUDED.price_per_month,
  main_image_url = EXCLUDED.main_image_url,
  seats = EXCLUDED.seats,
  transmission = EXCLUDED.transmission,
  fuel = EXCLUDED.fuel,
  top_speed = EXCLUDED.top_speed,
  engine = EXCLUDED.engine,
  power = EXCLUDED.power,
  consumption = EXCLUDED.consumption,
  luggage = EXCLUDED.luggage,
  description_en = EXCLUDED.description_en,
  description_fr = EXCLUDED.description_fr,
  description_ar = EXCLUDED.description_ar;

INSERT INTO vehicle_features (vehicle_id, feature_en, display_order)
VALUES
  ('clio-5', 'Touchscreen infotainment', 1),
  ('clio-5', 'Rear camera', 2),
  ('opel-corsa', 'Apple CarPlay', 1),
  ('dacia-logan', 'Spacious trunk', 1),
  ('mercedes-s', 'Air suspension', 1),
  ('mercedes-s', 'Massage seats', 2),
  ('ford-raptor', '4WD terrain modes', 1),
  ('audi-rs3', 'Quattro AWD', 1),
  ('audi-a8', 'Predictive air suspension', 1);

INSERT INTO reviews (customer_name, rating, review_text, language, display_order)
VALUES
  ('Ahmed Alaoui', 5, 'Fast booking, clean vehicle, and very professional airport delivery.', 'en', 1),
  ('Sara Bennani', 5, 'The car was ready on time and the price was clear from the beginning.', 'en', 2),
  ('Youssef Amrani', 5, 'Excellent service for a business trip between Casablanca and Rabat.', 'en', 3);

INSERT INTO faqs (question_en, answer_en, question_fr, answer_fr, question_ar, answer_ar, display_order)
VALUES
  ('Can I get airport delivery?', 'Yes, airport delivery is available depending on the city and schedule.', 'Puis-je demander une livraison à l''aéroport ?', 'Oui, la livraison à l''aéroport est disponible selon la ville et l''horaire.', 'هل يمكن التوصيل إلى المطار؟', 'نعم، التوصيل إلى المطار متاح حسب المدينة والتوقيت.', 1),
  ('What documents are required?', 'A valid driver license, ID or passport, and booking confirmation are required.', 'Quels documents sont nécessaires ?', 'Un permis valide, une pièce d''identité ou passeport, et la confirmation de réservation sont nécessaires.', 'ما هي الوثائق المطلوبة؟', 'رخصة سياقة صالحة، بطاقة تعريف أو جواز سفر، وتأكيد الحجز.', 2);

INSERT INTO website_sections (section_key, title_en, body_en, status, settings)
VALUES
  ('home_hero', 'Find your ideal car', 'Luxury, SUV, economy, and sports cars for travel in Morocco.', 'Published', '{"background": "gif", "cta": "Book now"}'),
  ('about_story', 'More Than Car Rentals — We Create Experiences.', 'Created for travelers who want clear prices, clean cars, and reliable delivery.', 'Published', '{"since": 2018, "cars": 500, "trips": 10000, "rating": 4.9}');

INSERT INTO promotions (title, description, code, discount_percent, is_active)
VALUES
  ('Weekend Drive', 'Save on selected weekend rentals.', 'WEEKEND10', 10, TRUE)
ON CONFLICT (code) DO NOTHING;
