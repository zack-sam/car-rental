-- Alaoui Car Rental database schema
-- Target: PostgreSQL 14+ / Supabase-compatible SQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE admin_role AS ENUM ('Admin', 'Staff');
CREATE TYPE vehicle_category AS ENUM ('SUV', 'Sedan', 'Luxury', 'Sport', 'Sports', 'Economy', 'Hatchback', 'Pickup');
CREATE TYPE fuel_type AS ENUM ('Essence', 'Diesel', 'Electric', 'Hybrid');
CREATE TYPE transmission_type AS ENUM ('Automatic', 'Manual');
CREATE TYPE vehicle_status AS ENUM ('Available', 'Unavailable', 'Reserved', 'Maintenance');
CREATE TYPE maintenance_status AS ENUM ('Ready', 'Inspection due', 'Service booked', 'In service', 'Completed');
CREATE TYPE reservation_status AS ENUM ('Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected');
CREATE TYPE payment_status AS ENUM ('Pending', 'Paid', 'Partially paid', 'Refunded', 'Failed');
CREATE TYPE payment_method AS ENUM ('Cash', 'Card', 'Bank transfer', 'WhatsApp payment', 'Other');
CREATE TYPE content_status AS ENUM ('Draft', 'Published', 'Archived');
CREATE TYPE notification_type AS ENUM ('Booking', 'Payment', 'Maintenance', 'System');
CREATE TYPE notification_status AS ENUM ('Unread', 'Read', 'Archived');

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'Staff',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  driver_license_number TEXT,
  driver_license_url TEXT,
  notes TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT customers_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE vehicles (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category vehicle_category NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day >= 0),
  price_per_week NUMERIC(10, 2) NOT NULL CHECK (price_per_week >= 0),
  price_per_month NUMERIC(10, 2) NOT NULL CHECK (price_per_month >= 0),
  main_image_url TEXT,
  seats INTEGER NOT NULL CHECK (seats > 0),
  transmission transmission_type NOT NULL,
  fuel fuel_type NOT NULL,
  top_speed INTEGER CHECK (top_speed >= 0),
  engine TEXT,
  power TEXT,
  consumption TEXT,
  luggage TEXT,
  description_en TEXT,
  description_fr TEXT,
  description_ar TEXT,
  status vehicle_status NOT NULL DEFAULT 'Available',
  maintenance_status maintenance_status NOT NULL DEFAULT 'Ready',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_en TEXT NOT NULL,
  feature_fr TEXT,
  feature_ar TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE vehicle_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  available_from DATE NOT NULL,
  available_to DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  status vehicle_status NOT NULL DEFAULT 'Available',
  note TEXT,
  CONSTRAINT availability_date_order CHECK (available_to >= available_from)
);

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10)),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  pickup_date DATE NOT NULL,
  dropoff_date DATE NOT NULL,
  pickup_location TEXT,
  return_location TEXT,
  days INTEGER NOT NULL CHECK (days > 0),
  mileage_plan TEXT,
  payment_method payment_method DEFAULT 'Cash',
  status reservation_status NOT NULL DEFAULT 'Pending',
  price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day >= 0),
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  license_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  staff_notes TEXT,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reservation_date_order CHECK (dropoff_date > pickup_date)
);

CREATE TABLE reservation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_note TEXT,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'MAD',
  method payment_method NOT NULL DEFAULT 'Cash',
  status payment_status NOT NULL DEFAULT 'Pending',
  transaction_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_at TIMESTAMPTZ,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  pdf_url TEXT,
  status payment_status NOT NULL DEFAULT 'Pending'
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  reason TEXT,
  status payment_status NOT NULL DEFAULT 'Pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status maintenance_status NOT NULL DEFAULT 'Inspection due',
  odometer_km INTEGER CHECK (odometer_km >= 0),
  cost NUMERIC(10, 2) DEFAULT 0 CHECK (cost >= 0),
  scheduled_at DATE,
  completed_at DATE,
  provider TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  language CHAR(2) NOT NULL DEFAULT 'en',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  question_fr TEXT,
  answer_fr TEXT,
  question_ar TEXT,
  answer_ar TEXT,
  status content_status NOT NULL DEFAULT 'Published',
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE website_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title_en TEXT,
  body_en TEXT,
  title_fr TEXT,
  body_fr TEXT,
  title_ar TEXT,
  body_ar TEXT,
  image_url TEXT,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  status content_status NOT NULL DEFAULT 'Published',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  code TEXT UNIQUE,
  discount_percent NUMERIC(5, 2) CHECK (discount_percent >= 0 AND discount_percent <= 100),
  discount_amount NUMERIC(10, 2) CHECK (discount_amount >= 0),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  status notification_status NOT NULL DEFAULT 'Unread',
  related_table TEXT,
  related_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE company_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  company_name TEXT NOT NULL DEFAULT 'Alaoui Car Rental',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  instagram TEXT,
  address TEXT,
  default_language CHAR(2) NOT NULL DEFAULT 'fr',
  default_currency CHAR(3) NOT NULL DEFAULT 'MAD',
  timezone TEXT NOT NULL DEFAULT 'Africa/Casablanca',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  geo_city TEXT,
  geo_country TEXT,
  email_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  whatsapp_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_settings_singleton CHECK (id)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_reservations_vehicle_dates ON reservations(vehicle_id, pickup_date, dropoff_date);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_payments_reservation ON payments(reservation_id);
CREATE INDEX idx_notifications_user_status ON notifications(admin_user_id, status);
CREATE INDEX idx_maintenance_vehicle_status ON maintenance_records(vehicle_id, status);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_admin_users_updated_at BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_vehicles_updated_at BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_reservations_updated_at BEFORE UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_website_sections_updated_at BEFORE UPDATE ON website_sections
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_company_settings_updated_at BEFORE UPDATE ON company_settings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
