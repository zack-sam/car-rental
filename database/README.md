# Alaoui Car Rental SQL Database

This folder gives the site a production-ready SQL foundation for saving all data: personnel users, customers, cars, reservations, payments, invoices, maintenance, notifications, reviews, FAQ, content, SEO, and company settings.

## Recommended Database

Use PostgreSQL or Supabase. The schema uses PostgreSQL features such as `UUID`, `JSONB`, enums, triggers, and `pgcrypto`.

## Setup

1. Create an empty PostgreSQL database.
2. Run the schema:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

3. Add starting data:

```bash
psql "$DATABASE_URL" -f database/seed.sql
```

4. Add this to your environment when you connect a backend API:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/alaoui_car_rental
```

## Important Security Note

The current React site is frontend-only, so it must not connect directly to the SQL database from the browser. The next step is to add a private backend API that reads and writes this database, then update the admin dashboard and booking form to call that API.

## Main Tables

- `admin_users`: private personnel access with Admin/Staff roles.
- `vehicles`, `vehicle_gallery`, `vehicle_features`, `vehicle_availability`: fleet data, prices, quantity, specs, media, and availability.
- `customers`: customer profiles, contact details, notes, VIP status, and license uploads.
- `reservations`, `reservation_events`: booking requests, approvals, rental periods, pickup/return tracking, and audit trail.
- `payments`, `invoices`, `refunds`: payment tracking, invoice generation, revenue analytics, and refunds.
- `maintenance_records`: inspections, service bookings, cost, and vehicle health tracking.
- `website_sections`, `reviews`, `faqs`, `promotions`: editable site content.
- `notifications`: booking, payment, maintenance, and system alerts.
- `company_settings`: contact details, currency, language, WhatsApp, email, SEO, and GEO settings.
- `audit_logs`: admin change history.
