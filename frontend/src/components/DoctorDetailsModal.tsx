import React, { useState, useEffect } from 'react';
import { Doctor, Appointment } from '../types';
import { api } from '../services/api';
import {
  Stethoscope,
  X,
  Award,
  Activity,
  Calendar,
  Clock,
  User,
  Plus
} from 'lucide-react';

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctorId: number) => void;
}

export const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      setLoading(true);
      api.getAppointments()
        .then((all) => {
          const docAppts = all.filter((a) => a.doctor_id === doctor.id);
          setAppointments(docAppts);
        })
        .finally(() => setLoading(false));
    }
  }, [doctor]);

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FFFFFF] rounded-3xl max-w-xl w-full border border-[#E6E9E4] shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#788078] hover:text-[#29352F] hover:bg-[#FAF9F6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#547B65] text-white flex items-center justify-center font-editorial font-bold text-2xl shadow-xs shrink-0">
            {doctor.name.replace('Dr. ', '').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
                {doctor.name}
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#E5EEF5] text-[#2A5372]">
                ID: #{doctor.id}
              </span>
            </div>
            <p className="text-xs text-[#788078] mt-0.5">
              Medical Staff Physician • Evergreen Care Hospital
            </p>
          </div>
        </div>

        {/* Professional Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4]">
            <span className="text-xs text-[#788078] flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-[#547B65]" /> Clinical Specialty
            </span>
            <div className="text-sm font-bold text-[#29352F] line-clamp-1">{doctor.specialization}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4]">
            <span className="text-xs text-[#788078] flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5 text-[#547B65]" /> Age / Experience
            </span>
            <div className="text-sm font-semibold text-[#294D3C]">{doctor.age} years old</div>
          </div>
        </div>

        {/* Scheduled Appointments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#788078] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#547B65]" />
              Scheduled Consultations ({appointments.length})
            </h4>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor.id);
              }}
              className="text-xs font-semibold text-[#547B65] hover:text-[#294D3C] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Book with Doctor
            </button>
          </div>

          {loading ? (
            <div className="text-xs text-[#788078] py-4 text-center">Loading doctor appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] text-center text-xs text-[#788078]">
              No active or previous appointments booked for this doctor.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl border border-[#E6E9E4] bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#29352F] flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#547B65]" /> {a.patient_name}
                      <span className="text-[10px] text-[#788078]">({a.appointment_date || a.date})</span>
                    </div>
                    <div className="text-[#788078] mt-0.5 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{a.appointment_time || a.time}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                      a.cancelled
                        ? 'bg-[#F5E3D7] text-[#8C4320]'
                        : 'bg-[#DDE9DF] text-[#294D3C]'
                    }`}
                  >
                    {a.cancelled ? 'Cancelled' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E6E9E4] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E6E9E4] text-xs font-semibold text-[#29352F] hover:bg-[#FAF9F6]"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookAppointment(doctor.id);
            }}
            className="px-4 py-2 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
