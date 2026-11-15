import React, { useState } from 'react';
import { Appointment } from '../types';
import { api } from '../services/api';
import {
  AlertTriangle,
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Trash2
} from 'lucide-react';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSuccess,
  onShowToast,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !appointment) return null;

  const handleConfirmCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.cancelAppointment(appointment.id);
      onShowToast(
        res.message || `Appointment #${appointment.id} was successfully marked as cancelled in the database.`,
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FFFFFF] rounded-3xl max-w-md w-full border border-[#E6E9E4] shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#788078] hover:text-[#29352F] hover:bg-[#FAF9F6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#F5E3D7] text-[#C58A38] flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#29352F]">
              Cancel Appointment
            </h3>
            <p className="text-xs text-[#788078]">
              Are you sure you want to cancel this visit?
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-[#F5E3D7] border border-[#F5E3D7] text-xs text-[#C94C4C]">
            {error}
          </div>
        )}

        {/* Appointment Card Preview */}
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] space-y-2.5 mb-5 text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E9E4]">
            <span className="text-xs font-semibold text-[#788078]">Appointment ID:</span>
            <span className="font-mono font-bold text-[#294D3C]">#{appointment.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#788078] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#547B65]" /> Patient:
            </span>
            <span className="font-semibold text-[#29352F]">{appointment.patient_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#788078] flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#547B65]" /> Doctor:
            </span>
            <span className="font-semibold text-[#29352F]">{appointment.doctor_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#788078] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#547B65]" /> Date & Time:
            </span>
            <span className="font-semibold text-[#29352F]">
              {appointment.appointment_date || appointment.date} at {appointment.appointment_time || appointment.time}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#788078] leading-relaxed mb-6">
          This appointment will be permanently marked as <span className="font-semibold text-[#8C4320]">Cancelled</span> in the hospital SQLite database. The physician’s calendar slot will immediately reopen for other waiting patients.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E6E9E4] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E6E9E4] text-xs font-semibold text-[#29352F] hover:bg-[#FAF9F6] transition-colors"
          >
            Keep Appointment
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmCancel}
            className="px-5 py-2.5 rounded-xl bg-[#C94C4C] text-white text-xs font-semibold hover:bg-[#A83838] transition-all shadow-md shadow-[#C94C4C]/20 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Updating Database...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Cancellation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
