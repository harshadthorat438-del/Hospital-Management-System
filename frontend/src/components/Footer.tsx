import React from 'react';
import { HeartPulse, Phone, Clock, MapPin, ShieldCheck, Database, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E6E9E4] mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#E6E9E4]">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#547B65] text-white flex items-center justify-center shadow-md shadow-[#547B65]/20">
                <HeartPulse className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#294D3C]">
                Evergreen Care
              </span>
            </div>
            <p className="text-sm text-[#788078] leading-relaxed">
              Providing compassionate, patient-centered medical care with seamless digital coordination for patients, doctors, and healthcare administrators.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-[#294D3C] bg-[#DDE9DF]/60 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-[#547B65]" />
              <span>Accredited Healthcare Facility</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#788078]">
              Contact & Location
            </h4>
            <div className="space-y-2.5 text-sm text-[#29352F]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#547B65] shrink-0 mt-0.5" />
                <span>Sector 12, Health City Campus, Near Ring Road, Pune, Maharashtra 411038</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#547B65] shrink-0" />
                <span>Emergency: +91 (020) 2567-9100 / Toll Free: 1800-200-CARE</span>
              </div>
            </div>
          </div>

          {/* Clinic Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#788078]">
              Operating Hours
            </h4>
            <div className="space-y-2 text-sm text-[#29352F]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#547B65] shrink-0" />
                <span className="font-medium">Monday – Friday:</span>
                <span className="text-[#788078]">8:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#547B65] shrink-0" />
                <span className="font-medium">Saturday – Sunday:</span>
                <span className="text-[#788078]">9:00 AM – 5:00 PM</span>
              </div>
              <p className="text-xs text-[#2E7D55] font-medium pt-1">
                24/7 Emergency Admissions Available
              </p>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#788078]">
              Backend Architecture
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] text-xs space-y-2 text-[#29352F]">
              <div className="flex items-center gap-2 font-semibold text-[#294D3C]">
                <Cpu className="w-4 h-4 text-[#547B65]" />
                <span>C++ Object-Oriented Core</span>
              </div>
              <p className="text-[#788078] text-[11px] leading-relaxed">
                Inheritance hierarchy (<code className="text-[#294D3C]">Person</code> → <code className="text-[#294D3C]">Patient</code> / <code className="text-[#294D3C]">Doctor</code>), <code className="text-[#294D3C]">Appointment</code>, and <code className="text-[#294D3C]">HospitalManagementSystem</code>.
              </p>
              <div className="flex items-center gap-2 font-semibold text-[#294D3C] pt-1">
                <Database className="w-4 h-4 text-[#547B65]" />
                <span>SQLite3 Persistent Storage</span>
              </div>
              <p className="text-[#788078] text-[11px]">
                File: <span className="font-mono text-[#294D3C]">hospital.db</span> with foreign-key enforcement & prepared queries.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#788078] gap-4">
          <p>© 2026 Evergreen Care Hospital. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Patient Privacy & Confidentiality</span>
            <span>Terms of Healthcare Service</span>
            <span className="text-[#547B65] font-semibold">C++ Web Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
