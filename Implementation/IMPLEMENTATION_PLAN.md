# Implementation Plan: SecureGuard Systems Backend & Dashboards

This document outlines the step-by-step plan to implement a full backend and interactive dashboards for **SecureGuard Systems**.

---

## 🏗️ Tech Stack

- **Frontend**: Existing React + Vite + Tailwind + Lucide Icons.
- **Backend/DB**: **Supabase** (PostgreSQL + Row Level Security).
- **Auth**: Supabase Auth (Email/Password + Magic Link).
- **Edge Functions**: Supabase Edge Functions (Deno).
- **File Storage**: Supabase Storage Buckets (Property photos, Quotes, Avatars).
- **Email**: Supabase + **Resend** (via Edge Functions).

---

## 🗃️ Database Schema

### Profiles (`profiles`)
Extends `auth.users`.
- `id`: uuid (primary key, references `auth.users`)
- `role`: enum ('user', 'client', 'admin', 'banned') - default 'user'
- `full_name`: text
- `property_type`: text (Residential, Commercial, Retail)
- `address`: text
- `avatar_url`: text
- `rejection_reason`: text (Internal, shown to banned users if applicable)
- `admin_notes`: text
- `created_at`: timestamptz
- `updated_at`: timestamptz

### Service Types (`service_types`)
- `id`: uuid
- `name`: text (CCTV, Access Control, Intruder Alarm, Intercom)
- `description`: text
- `icon_name`: text (Lucide icon key)
- `is_active`: boolean
- `display_order`: int

### Jobs (`jobs`)
Core bookable service units.
- `id`: uuid
- `title`: text
- `slug`: text (unique)
- `service_type_id`: uuid (references `service_types`)
- `description`: text
- `location`: text
- `max_slots`: int
- `booked_slots`: int
- `status`: enum ('draft', 'published', 'in_progress', 'completed', 'cancelled')
- `cancel_reason`: text
- `cancelled_at`: timestamptz
- `scheduled_start`: timestamptz
- `scheduled_end`: timestamptz
- `pricing_note`: text
- `assigned_engineer`: text
- `is_recurring`: boolean
- `recurrence_rule`: text (rrule string)

### Job Availability (`job_availability`)
- `id`: uuid
- `job_id`: uuid (references `jobs`)
- `available_from`: timestamptz
- `available_until`: timestamptz
- `is_ongoing`: boolean
- `exception_dates`: date[] (list of dates where job is unavailable)

### Bookings (`bookings`)
- `id`: uuid
- `job_id`: uuid (references `jobs`)
- `client_id`: uuid (references `profiles`)
- `status`: enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected')
- `cancel_reason`: text
- `rejection_reason`: text
- `client_notes`: text
- `admin_notes`: text
- `property_photo_urls`: text[] (Storage paths)
- `quote_url`: text (Storage path)
- `created_at`: timestamptz

### Enquiries (`enquiries`)
Pre-auth lead tracking.
- `id`: uuid
- `name`: text
- `email`: text
- `phone`: text
- `message`: text
- `status`: enum ('new', 'contacted', 'converted', 'closed')
- `conversion_tracking`: jsonb (source, medium, etc)

### History & Auditing
- `login_history`: `(user_id, ip_address, user_agent, created_at)`
- `job_history`: `(job_id, old_status, new_status, changed_by, reason, created_at)`
- `booking_history`: `(booking_id, old_status, new_status, changed_by, reason, created_at)`

### Notifications (`notifications`)
- `id`: uuid
- `user_id`: uuid (references `profiles`)
- `title`: text
- `message`: text
- `type`: enum ('info', 'success', 'warning', 'error')
- `is_read`: boolean
- `metadata`: jsonb (link to booking_id, etc)

---

## 🛡️ Row Level Security (RLS)

| Table | Admin | Client | User | Banned |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | All Access | Own Record (Read/Update*) | Own Record (Read/Update*) | Read Own (Status Only) |
| `service_types` | All Access | Read Only | Read Only | No Access |
| `jobs` | All Access | Read Only | Read Only | No Access |
| `bookings` | All Access | Own Records (Read/Create) | No Access | No Access |
| `enquiries` | All Access | No Access | No Access | No Access |
| `notifications` | All Access | Own Only (Read/Update) | Own Only (Read/Update) | No Access |

*\*Update restricted to specific fields (name, address, avatar)*

---

## ⚡ Edge Functions

1. **`on-signup`**: 
   - Trigger: `auth.users` insert.
   - Logic: Create `profiles` row with role 'user', send welcome email via Resend.
2. **`on-booking-status-change`**:
   - Trigger: `bookings` update.
   - Logic: 
     - If `confirmed`: Check profile role. If 'user', promote to 'client'.
     - Log to `booking_history`.
     - Notify client via in-app notification + email.
3. **`on-job-status-change`**:
   - Trigger: `jobs` update.
   - Logic: Log to `job_history`, notify booked clients if cancelled or rescheduled.
4. **`log-login-event`**:
   - Trigger: `auth.on_auth_state_change` (client-side) or DB trigger on `auth.sessions`.
   - Logic: Insert into `login_history`.
5. **`promote-to-client`**:
   - Internal utility called by `on-booking-status-change`.

---

## 🎨 Branding & UI/UX

### Visual Identity
- **Background**: `#0D0D0D` (Deep Black)
- **Surfaces**: `#1A1A1A` (Dark Grey)
- **Primary Accent**: `#E8640A` (SecureGuard Orange)
- **Text**: `#FFFFFF` (Primary), `#9CA3AF` (Secondary)
- **Typography**: Inter (Sans-serif)

### UI Components
- **Buttons**: `rounded-full` (Pill shape) for CTAs. Orange background with white text.
- **Cards**: Surface color, 1px border `#2E2E2E`, `border-radius: 16px`.
- **Badges**:
  - `pending`: Amber dot + text
  - `confirmed`: Green dot + text
  - `in_progress`: Blue dot + text
  - `completed`: Grey dot + text
  - `cancelled/rejected/banned`: Red dot + text
- **Toasts**: Top-left position, 4s duration, color-coded by type.

### Role Transition Logic
- Users are assigned the `user` role upon signup.
- Upon the first confirmation of a booking by an admin, the `on-booking-confirmed` edge function checks the current role.
- If the role is `user`, it is automatically updated to `client`.
- Admins can manually assign roles or ban users (role = `banned`) with a stored reason via the Admin Dashboard.

---

## 🗺️ Implementation Phases

### Phase 1: Foundation & Auth Setup (2-3 Days)
- [ ] Initialize Supabase project & local CLI.
- [ ] **Database Setup**: Create all tables and role ENUMs (Profiles, Service Types, Jobs, Bookings, etc.).
- [ ] **Auth Configuration**: Setup `auth.users` trigger for profile creation.
- [ ] **Auth Pages**: Implement `/login`, `/signup`, `/logout` pages.
- [ ] **Mockup Dashboards**: Build `/admin/dashboard` and `/user/dashboard` mockups to test auth and roles.
- [ ] **Access Control**: Implement Private Route wrappers and role-based redirects.

### Phase 2: Booking System & Client Flow (4-5 Days)
- [ ] Public Service catalog (Read-only jobs).
- [ ] Booking creation form: Photo upload (Storage) + Service selection.
- [ ] **Critical Logic**: User → Client role promotion on first booking confirmation.
- [ ] Admin Booking Management: Confirm/Reject/Reschedule.
- [ ] History logs for all booking transitions.

### Phase 3: Admin Core Development (3-4 Days)
- [ ] Full Dashboard layout with Sidebar.
- [ ] Service Type CRUD management.
- [ ] Job Creation engine: Basic details + Availability rules + Slug generation.
- [ ] Job Listing view with status/type filters.
- [ ] Audit logging for Job status changes.

### Phase 4: Notification Center & Final Polish (3 Days)
- [ ] Notification System: Database table + Realtime subscription + Email fallback.
- [ ] Account management: Profile editing, photo upload, login history.
- [ ] Dashboard KPIs and Calendar View for Admin.
- [ ] Comprehensive RLS policy testing for all roles.
- [ ] Final mobile responsiveness checks and QA.

---

## 🚫 Out of Scope (V1)
- Stripe Payment integration (Reserved for V2).
- Dedicated Engineer logins (Admins handle assignment).
- SMS/WhatsApp alerts.
- Google/Outlook Calendar sync.
