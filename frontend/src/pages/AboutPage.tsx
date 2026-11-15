import React from 'react';
import {
  HeartPulse,
  ShieldCheck,
  Cpu,
  Database,
  Award,
  Users,
  Building,
  CheckCircle2,
  FileCode2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE9DF] text-[#294D3C] text-xs font-bold tracking-wider uppercase">
          <span>ABOUT EVERGREEN CARE HOSPITAL</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#294D3C]">
          Care that makes a difference.
        </h1>
        <p className="text-sm sm:text-base text-[#788078] leading-relaxed">
          Founded on compassionate medicine and modern object-oriented software engineering.
        </p>
      </div>

      {/* Hospital Identity & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hospital-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
            Our Clinical Mission
          </h3>
          <p className="text-sm text-[#788078] leading-relaxed">
            Evergreen Care Hospital provides community-focused clinical care across all age demographics. Our patient-centered model ensures every patient receives attentive, coordinated healthcare from dedicated physicians and pediatric practitioners.
          </p>
          <div className="pt-2 space-y-2 text-xs font-semibold text-[#294D3C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#547B65]" />
              <span>Full outpatient consultation and diagnostics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#547B65]" />
              <span>Dedicated child health & adolescent medicine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#547B65]" />
              <span>Transparent scheduling without conflicting appointments</span>
            </div>
          </div>
        </div>

        <div className="hospital-card p-8 rounded-3xl space-y-4 bg-gradient-to-br from-white via-[#FAF9F6] to-[#DDE9DF]/30">
          <div className="w-12 h-12 rounded-2xl bg-[#E5EEF5] text-[#2A5372] flex items-center justify-center">
            <Cpu className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
            C++ Object-Oriented Foundation
          </h3>
          <p className="text-sm text-[#788078] leading-relaxed">
            This platform is built directly upon the C++ Hospital Management System codebase, honoring core object-oriented principles:
          </p>
          <div className="space-y-2 text-xs text-[#29352F]">
            <div className="p-3 rounded-xl bg-white border border-[#E6E9E4]">
              <span className="font-bold text-[#294D3C]">Polymorphism & Abstraction:</span> Base class <code className="font-mono text-[#547B65]">Person</code> with virtual <code className="font-mono text-[#547B65]">displayDetails()</code> and derived classes <code className="font-mono text-[#547B65]">Patient</code> and <code className="font-mono text-[#547B65]">Doctor</code>.
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E6E9E4]">
              <span className="font-bold text-[#294D3C]">Domain Modeling:</span> <code className="font-mono text-[#547B65]">Appointment</code> and <code className="font-mono text-[#547B65]">HospitalManagementSystem</code> managing synchronized vector collections and business rules.
            </div>
          </div>
        </div>
      </div>

      {/* SQL & Persistence Architecture */}
      <div className="hospital-card p-8 sm:p-10 rounded-3xl border border-[#E6E9E4]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F5E3D7] text-[#8C4320] flex items-center justify-center">
            <Database className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
              Persistent SQLite Database Architecture
            </h3>
            <p className="text-xs text-[#788078]">
              Direct disk-persisted database replacing flat text files.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] space-y-2">
            <div className="font-bold text-[#294D3C] text-sm">PRAGMA Foreign Keys</div>
            <p className="text-[#788078]">
              Foreign key constraints enforced on appointment relations referencing verified patient and doctor IDs in <code className="text-[#547B65]">hospital.db</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] space-y-2">
            <div className="font-bold text-[#294D3C] text-sm">Prepared Statements</div>
            <p className="text-[#788078]">
              All queries use SQLite parameterized statements (<code className="text-[#547B65]">sqlite3_bind_text</code>, <code className="text-[#547B65]">sqlite3_bind_int</code>) ensuring complete SQL injection protection.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] space-y-2">
            <div className="font-bold text-[#294D3C] text-sm">Conflict Rejection Engine</div>
            <p className="text-[#788078]">
              Real-time query checks whether an active appointment exists for a doctor on the selected date and time before allowing confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
