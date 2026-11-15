import React from 'react';
import { DashboardData, Appointment, ActiveTab, StaffUser } from '../types';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  ArrowRight,
  UserPlus,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  HeartPulse,
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  dashboardData: DashboardData | null;
  loading: boolean;
  currentUser: StaffUser | null;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRegisterPatient: () => void;
  onOpenAddDoctor: () => void;
  onOpenBookAppointment: () => void;
  onViewAppointmentDetails: (appt: Appointment) => void;
  onCancelAppointment: (appt: Appointment) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  dashboardData,
  loading,
  currentUser,
  setActiveTab,
  onOpenRegisterPatient,
  onOpenAddDoctor,
  onOpenBookAppointment,
  onViewAppointmentDetails,
  onCancelAppointment,
}) => {
  const stats = dashboardData?.stats || {
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    upcoming_appointments: 0,
  };

  const recentAppts = dashboardData?.recent_appointments || [];

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* ----------------------------------------------------------------- */}
      {/* HERO SECTION (Editorial 2-Column Inspired by Little Oaks Reference) */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#DDE9DF]/50 via-white to-[#F5E3D7]/40 border border-[#E6E9E4] p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE9DF] text-[#294D3C] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMPASSIONATE CARE. BETTER TOMORROWS.</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#294D3C] leading-[1.12]">
              Better care starts with a better connection.
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-[#788078] leading-relaxed max-w-xl">
              Manage patients, coordinate doctors, and organise appointments through one simple, welcoming hospital management system.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenRegisterPatient}
                className="px-6 py-3.5 rounded-2xl bg-[#547B65] text-white font-semibold text-sm hover:bg-[#294D3C] transition-all shadow-md shadow-[#547B65]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register a Patient</span>
              </button>

              <button
                onClick={onOpenBookAppointment}
                className="px-6 py-3.5 rounded-2xl bg-white border border-[#E6E9E4] text-[#294D3C] font-semibold text-sm hover:bg-[#FAF9F6] hover:border-[#547B65] transition-all shadow-xs flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#547B65]" />
                <span>Book an Appointment</span>
              </button>
            </div>

            {/* 3 Value Pillars */}
            <div className="pt-6 border-t border-[#E6E9E4]/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-[#294D3C]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DDE9DF] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#547B65]" />
                </div>
                <span>Patient-focused care</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DDE9DF] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#547B65]" />
                </div>
                <span>Organised appointments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DDE9DF] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#547B65]" />
                </div>
                <span>Reliable SQL records</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Hospital Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft decorative background shape */}
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-[#DDE9DF]/60 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-56 h-56 bg-[#F5E3D7]/60 rounded-full blur-2xl pointer-events-none" />

              {/* Main Hospital Hero Card */}
              <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E6E9E4] shadow-xl p-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-tr from-[#547B65] to-[#DDE9DF] flex items-center justify-center">
                  {/* High quality medical graphic representation */}
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
                    alt="Evergreen Care Medical Staff"
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#294D3C]/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                      Evergreen Clinical Excellence
                    </span>
                    <h3 className="font-editorial text-xl font-bold mt-1">
                      Compassionate Medicine, Modern Architecture
                    </h3>
                  </div>
                </div>

                {/* Floating Floating Stat Badge */}
                <div className="mt-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E9E4] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#547B65] text-white flex items-center justify-center">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#788078] font-medium">Doctor Availability</div>
                      <div className="text-xs font-bold text-[#294D3C]">4 Active Departments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D55] bg-[#DDE9DF]/60 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D55] animate-ping" />
                    Live System
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* DASHBOARD STATISTICS CARDS (Connected to SQLite Backend)           */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#294D3C]">
              Hospital Overview
            </h2>
            <p className="text-xs sm:text-sm text-[#788078]">
              Live operational metrics queried directly from the SQLite persistent database.
            </p>
          </div>
          {currentUser && (
            <div className="text-xs font-medium text-[#788078] hidden sm:block">
              Session: <span className="font-semibold text-[#294D3C]">{currentUser.role}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Patients */}
          <div
            onClick={() => setActiveTab('patients')}
            className="hospital-card-interactive p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#788078]">
                Total Patients
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="font-editorial text-4xl font-bold text-[#294D3C]">
              {loading ? '...' : stats.total_patients}
            </div>
            <p className="text-xs text-[#788078] mt-2 flex items-center justify-between">
              <span>Registered medical profiles</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#547B65] group-hover:translate-x-1 transition-transform" />
            </p>
          </div>

          {/* Card 2: Total Doctors */}
          <div
            onClick={() => setActiveTab('doctors')}
            className="hospital-card-interactive p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#788078]">
                Total Doctors
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#E5EEF5] text-[#2A5372] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <div className="font-editorial text-4xl font-bold text-[#294D3C]">
              {loading ? '...' : stats.total_doctors}
            </div>
            <p className="text-xs text-[#788078] mt-2 flex items-center justify-between">
              <span>Licensed specialists</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#547B65] group-hover:translate-x-1 transition-transform" />
            </p>
          </div>

          {/* Card 3: Total Appointments */}
          <div
            onClick={() => setActiveTab('appointments')}
            className="hospital-card-interactive p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#788078]">
                Total Appointments
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F5E3D7] text-[#8C4320] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="font-editorial text-4xl font-bold text-[#294D3C]">
              {loading ? '...' : stats.total_appointments}
            </div>
            <p className="text-xs text-[#788078] mt-2 flex items-center justify-between">
              <span>All recorded visits</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#547B65] group-hover:translate-x-1 transition-transform" />
            </p>
          </div>

          {/* Card 4: Upcoming Appointments */}
          <div
            onClick={() => setActiveTab('appointments')}
            className="hospital-card-interactive p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#788078]">
                Upcoming Scheduled
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#ECE8F5] text-[#4A3A75] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="font-editorial text-4xl font-bold text-[#294D3C]">
              {loading ? '...' : stats.upcoming_appointments}
            </div>
            <p className="text-xs text-[#788078] mt-2 flex items-center justify-between">
              <span>Active consultations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#547B65] group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* QUICK ACTIONS PANEL                                               */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-4">
        <h3 className="font-editorial text-xl font-bold text-[#294D3C]">
          Quick Administrative Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={onOpenRegisterPatient}
            className="p-5 rounded-2xl bg-white border border-[#E6E9E4] hover:border-[#547B65] hover:bg-[#FAF9F6] text-left transition-all group flex items-start gap-4 shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center shrink-0 group-hover:bg-[#547B65] group-hover:text-white transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#29352F] group-hover:text-[#294D3C]">
                Register Patient
              </div>
              <p className="text-xs text-[#788078] mt-1 leading-snug">
                Record personal details & medical condition.
              </p>
            </div>
          </button>

          <button
            onClick={onOpenAddDoctor}
            className="p-5 rounded-2xl bg-white border border-[#E6E9E4] hover:border-[#547B65] hover:bg-[#FAF9F6] text-left transition-all group flex items-start gap-4 shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#E5EEF5] text-[#2A5372] flex items-center justify-center shrink-0 group-hover:bg-[#2A5372] group-hover:text-white transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#29352F] group-hover:text-[#294D3C]">
                Add Doctor
              </div>
              <p className="text-xs text-[#788078] mt-1 leading-snug">
                Expand medical staff and departmental specialties.
              </p>
            </div>
          </button>

          <button
            onClick={onOpenBookAppointment}
            className="p-5 rounded-2xl bg-white border border-[#E6E9E4] hover:border-[#547B65] hover:bg-[#FAF9F6] text-left transition-all group flex items-start gap-4 shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F5E3D7] text-[#8C4320] flex items-center justify-center shrink-0 group-hover:bg-[#8C4320] group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#29352F] group-hover:text-[#294D3C]">
                Book Appointment
              </div>
              <p className="text-xs text-[#788078] mt-1 leading-snug">
                Coordinate physician schedules without conflict.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className="p-5 rounded-2xl bg-white border border-[#E6E9E4] hover:border-[#547B65] hover:bg-[#FAF9F6] text-left transition-all group flex items-start gap-4 shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#ECE8F5] text-[#4A3A75] flex items-center justify-center shrink-0 group-hover:bg-[#4A3A75] group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#29352F] group-hover:text-[#294D3C]">
                View All Records
              </div>
              <p className="text-xs text-[#788078] mt-1 leading-snug">
                Browse, search, and manage all scheduled visits.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* UPCOMING APPOINTMENTS SECTION                                     */}
      {/* ----------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#294D3C]">
              Upcoming Appointments
            </h2>
            <p className="text-xs sm:text-sm text-[#788078]">
              Recently booked patient consultations and clinical visits.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('appointments')}
            className="text-xs font-semibold text-[#547B65] hover:text-[#294D3C] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentAppts.length === 0 ? (
          <div className="hospital-card p-12 text-center rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E9E4] text-[#788078] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-[#547B65]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-editorial text-xl font-bold text-[#294D3C]">
                No Appointments Scheduled Yet
              </h4>
              <p className="text-xs sm:text-sm text-[#788078] max-w-md mx-auto">
                Select an existing patient and doctor to schedule your first hospital appointment.
              </p>
            </div>
            <button
              onClick={onOpenBookAppointment}
              className="px-5 py-2.5 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-all shadow-sm"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="hospital-card rounded-2xl overflow-hidden border border-[#E6E9E4]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF9F6] border-b border-[#E6E9E4] text-xs font-bold uppercase tracking-wider text-[#788078]">
                  <tr>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Attending Doctor</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E9E4] text-[#29352F]">
                  {recentAppts.map((appt) => (
                    <tr key={appt.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-xs text-[#788078]">
                        #{appt.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#29352F]">{appt.patient_name}</div>
                        <div className="text-[11px] text-[#788078]">Patient ID: #{appt.patient_id}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#294D3C]">{appt.doctor_name}</div>
                        <div className="text-[11px] text-[#788078]">{appt.specialization}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-xs">{appt.appointment_date || appt.date}</div>
                        <div className="text-[11px] text-[#788078]">{appt.appointment_time || appt.time}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            appt.cancelled
                              ? 'bg-[#F5E3D7] text-[#8C4320]'
                              : 'bg-[#DDE9DF] text-[#294D3C]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              appt.cancelled ? 'bg-[#8C4320]' : 'bg-[#2E7D55]'
                            }`}
                          />
                          {appt.cancelled ? 'Cancelled' : 'Scheduled'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => onViewAppointmentDetails(appt)}
                          className="px-3 py-1.5 rounded-xl border border-[#E6E9E4] text-xs font-medium text-[#29352F] hover:bg-[#FAF9F6]"
                        >
                          Details
                        </button>
                        {!appt.cancelled && (
                          <button
                            onClick={() => onCancelAppointment(appt)}
                            className="px-3 py-1.5 rounded-xl border border-[#F5E3D7] text-xs font-medium text-[#C94C4C] hover:bg-[#F5E3D7]/50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* HOSPITAL INFORMATION PANEL                                        */}
      {/* ----------------------------------------------------------------- */}
      <section className="rounded-3xl bg-white border border-[#E6E9E4] p-8 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#294D3C]">
              Comprehensive Specialty Care
            </h4>
            <p className="text-xs text-[#788078] leading-relaxed">
              Our medical staff features board-certified practitioners across General Pediatrics, Cardiology, Orthopedics, and Neurology.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5E3D7] text-[#8C4320] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#294D3C]">
              Certified Data Integrity
            </h4>
            <p className="text-xs text-[#788078] leading-relaxed">
              Patient confidentiality and verified medical records are maintained with SQLite database persistence and prepared SQL statements.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5EEF5] text-[#2A5372] flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#294D3C]">
              24/7 Patient Registration
            </h4>
            <p className="text-xs text-[#788078] leading-relaxed">
              Streamlined admitting desk coordinates seamless patient intake, immediate medical indexing, and rapid specialist consultations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
