# Evergreen Care Hospital — Modern Hospital Management System

A full-stack Hospital Management System web application built upon an Object-Oriented C++ core and persistent SQLite database, featuring a warm, welcoming visual design inspired by modern healthcare platforms.

---

## 1. Project Overview

Evergreen Care Hospital integrates a native C++ REST API backend with a responsive React & TypeScript frontend. The system provides real-time patient registration, doctor specialty coordination, appointment booking with automated conflict detection, appointment cancellation, and staff authorization for administrative actions.

### Visual Design & Brand Identity
- **Hospital Identity:** Evergreen Care Hospital (*"Care that makes a difference."*)
- **Design Philosophy:** Welcoming editorial layout, generous whitespace, rounded card components (12–20px), subtle elevation shadows, and accessible typography (Newsreader serif headings & Plus Jakarta Sans interface text).
- **Pastel Healthcare Palette:**
  - Background: `#FAF9F6`
  - Cards: `#FFFFFF`
  - Soft Sage Green: `#DDE9DF`
  - Primary Green: `#547B65`
  - Dark Forest Green: `#294D3C`
  - Soft Peach: `#F5E3D7`
  - Pale Blue: `#E5EEF5`
  - Lavender Accent: `#ECE8F5`

---

## 2. Object-Oriented C++ Backend & Database

The backend preserves the original C++ OOP architecture:

1. **`Person` (Abstract Base Class):**
   - Encapsulates `id`, `name`, `age`.
   - Pure virtual method `virtual void displayDetails() const = 0` and virtual destructor.
2. **`Patient` (Derived Class):**
   - Inherits from `Person`.
   - Manages diagnosed `illness` and clinical details.
3. **`Doctor` (Derived Class):**
   - Inherits from `Person`.
   - Manages physician `specialization` and clinical department.
4. **`Appointment` (Entity Class):**
   - Coordinates `patient_id`, `doctor_id`, `date`, `time`, and `cancelled` status.
5. **`HospitalManagementSystem` (Domain Controller):**
   - Maintains synchronized collections of `Patient`, `Doctor`, and `Appointment` objects.
   - Handles business logic, date/time format validation, doctor conflict checks, and SQLite database persistence.
6. **SQLite3 Persistence (`hospital.db`):**
   - `PRAGMA foreign_keys = ON;`
   - Parameterized SQL statements (`sqlite3_bind_*`) across all endpoints.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Browser Client                       │
│    (React 19 + TypeScript + Tailwind CSS + Lucide)     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON API Requests
                            ▼
┌────────────────────────────────────────────────────────┐
│               C++ HTTP REST API Server                 │
│         (hospital_server.exe on port 8080)             │
├────────────────────────────────────────────────────────┤
│  HospitalManagementSystem  │  Database Engine (C++)    │
│  - Models (Person, Patient,│  - Prepared Statements    │
│    Doctor, Appointment)    │  - Conflict Verification  │
│  - Staff Authorization     │  - Foreign Key Pragma     │
└───────────────────────────┬────────────────────────────┘
                            │ Native C API
                            ▼
┌────────────────────────────────────────────────────────┐
│            SQLite Database (hospital.db)               │
│        Tables: patients, doctors, appointments,        │
│                     staff_users                        │
└────────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```
d:\oop project\
|-- backend/
|   |-- include/
|   |   |-- httplib.h           # Lightweight C++ HTTP server header
|   |   |-- json.hpp            # Modern JSON serialization header
|   |   |-- sqlite3.h           # SQLite C interface header
|   |   |-- sqlite3ext.h        # SQLite extension header
|   |   |-- models.h            # Person, Patient, Doctor, Appointment, StaffUser classes
|   |   |-- database.h          # Database persistence declarations
|   |   `-- hospital_system.h   # HospitalManagementSystem class declaration
|   |-- src/
|   |   |-- database.cpp        # SQLite operations and prepared statements
|   |   |-- hospital_system.cpp # Business logic & conflict verification
|   |   `-- main.cpp            # REST API routes and HTTP server entrypoint
|   |-- sqlite3.c               # SQLite3 amalgamation source
|   |-- sqlite3.o               # Pre-compiled SQLite object file
|   |-- build.bat               # One-click MinGW g++ compilation script
|   |-- run.bat                 # Backend startup script
|   `-- hospital_server.exe     # Compiled native server binary
|
|-- database/
|   `-- hospital.db             # Disk-persistent SQLite database file
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Navbar.tsx                 # Top navigation & authorization status
|   |   |   |-- Footer.tsx                 # Hospital contact & architecture details
|   |   |   |-- AuthModal.tsx              # Staff Authorization & Role Selector GUI
|   |   |   |-- RegisterPatientModal.tsx   # Patient Registration GUI form
|   |   |   |-- AddDoctorModal.tsx         # Doctor Creation GUI form
|   |   |   |-- BookAppointmentModal.tsx   # Appointment Booking & Conflict UI
|   |   |   |-- CancelAppointmentModal.tsx # Cancellation Confirmation Dialog
|   |   |   |-- PatientDetailsModal.tsx    # Patient Medical History modal
|   |   |   |-- DoctorDetailsModal.tsx     # Physician Schedule modal
|   |   |   `-- Toast.tsx                  # Toast notification alerts
|   |   |-- pages/
|   |   |   |-- HomePage.tsx               # Warm editorial hero & live stats
|   |   |   |-- PatientsPage.tsx           # Patient management, search & filters
|   |   |   |-- DoctorsPage.tsx            # Doctors grid/table directory
|   |   |   |-- AppointmentsPage.tsx       # Appointment scheduling & filters
|   |   |   `-- AboutPage.tsx              # Clinical mission & OOP architecture
|   |   |-- services/
|   |   |   `-- api.ts                     # Frontend API client
|   |   |-- types/
|   |   |   `-- index.ts                   # TypeScript interfaces
|   |   |-- App.tsx                        # Root application component
|   |   |-- main.tsx                       # React DOM entrypoint
|   |   `-- index.css                      # Tailwind CSS & custom design tokens
|   |-- package.json
|   |-- vite.config.ts
|   `-- tsconfig.json
|
|-- backup_original_OOPS_P/     # Complete untouched backup of original project
`-- README.md
```

---

## 5. Staff Authorization GUI

As requested, the application includes a dedicated **Staff & Dashboard Authorization GUI**:
- **Administrator Role (`admin` / `admin123`):** Full privileges (patient registration, doctor onboarding, appointment scheduling, cancellations, and clinical oversight).
- **Receptionist Role (`reception` / `recep123`):** Patient intake and appointment booking.
- **Attending Physician (`doctor` / `doc123`):** Consultation review and department scheduling.
- **One-Click Role Switching:** Easily switch between authorized administrative roles directly via the top navigation shield badge.

---

## 6. How to Run the Application

### Prerequisites
- **C++ Compiler:** MinGW-w64 `g++` (GCC 11+)
- **Node.js & npm:** Node.js v18+ (tested on Node v24)

---

### Step 1: Start the C++ Backend Server

Open a terminal or command prompt in the `backend` directory:
```bash
cd "d:\oop project\backend"

# If compiling from scratch:
build.bat

# Or compile manually:
g++ -std=c++17 -O2 -Iinclude src/main.cpp src/database.cpp src/hospital_system.cpp sqlite3.o -lws2_32 -lcrypt32 -o hospital_server.exe

# Start the server (default port 8080):
hospital_server.exe 8080
```
*The server will initialize `hospital.db`, enforce foreign keys, and listen on `http://localhost:8080`.*

---

### Step 2: Start the Modern Frontend Web Application

In a second terminal:
```bash
cd "d:\oop project\frontend"

# Install dependencies (already prepared):
npm install

# Start Vite development server:
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

*(Requests to `/api/*` are automatically proxied by Vite to the C++ server on port 8080).*

---

## 7. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status check & version info |
| `GET` | `/api/dashboard` | Live statistics (patients, doctors, appointments, upcoming) |
| `GET` | `/api/patients` | Retrieve all registered patients |
| `GET` | `/api/patients/:id` | Retrieve patient record by ID |
| `POST` | `/api/patients` | Register new patient (`name`, `age`, `illness`, optional `id`) |
| `DELETE` | `/api/patients/:id` | Safely remove patient record (if no appointments) |
| `GET` | `/api/doctors` | Retrieve medical practitioners list |
| `GET` | `/api/doctors/:id` | Retrieve doctor record by ID |
| `POST` | `/api/doctors` | Add doctor (`name`, `age`, `specialization`, optional `id`) |
| `GET` | `/api/doctors/:id/availability?date=YYYY-MM-DD` | Check doctor's booked time slots |
| `GET` | `/api/appointments?status=&date=` | Retrieve appointments with optional filters |
| `GET` | `/api/appointments/:id` | Retrieve appointment details |
| `POST` | `/api/appointments` | Book appointment with conflict validation |
| `POST` | `/api/appointments/:id/cancel` | Mark appointment cancelled (frees doctor slot) |
| `POST` | `/api/auth/login` | Authenticate staff user |
| `GET` | `/api/auth/staff-list` | Get demo staff directory |

---

## 8. Verification & Test Suite

All 10 required operational tests have been executed and verified against the live C++ server and SQLite database:

1. **Backend Health Check:** Responds with HTTP 200 and JSON status confirmation.
2. **Patient Registration:** Validated input persisted into SQLite `patients` table.
3. **Doctor Management:** Specialty and practitioner data stored in SQLite `doctors` table.
4. **Appointment Booking:** Linked patient and doctor IDs stored in SQLite `appointments` table.
5. **Conflict Prevention:** Backend rejected double-booking attempts for the same doctor at the same date and time.
6. **Appointment Cancellation:** Marked appointment as `Cancelled` (`cancelled = 1`), reopening the doctor's time slot for subsequent bookings.
7. **Database Persistence:** Validated records survive server restarts and persist in `database/hospital.db`.
8. **Dashboard Accuracy:** Statistics match live SQLite counts directly.
9. **Input Validation:** Rejects invalid ages (&le; 0 or &gt; 120), empty names, and malformed dates/times.
10. **Responsive Design:** Verified desktop, tablet, and mobile layouts with responsive navigation drawer and adaptive grid.
