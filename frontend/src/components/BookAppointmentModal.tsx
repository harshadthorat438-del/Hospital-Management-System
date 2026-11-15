import React, { useState, useEffect } from 'react';
import { Patient, Doctor } from '../types';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  X,
  Check,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialPatientId?: number;
  initialDoctorId?: number;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPatientId,
  initialDoctorId,
  onShowToast,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | ''>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:30');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suggested time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Set default date to today or tomorrow
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
      setTime('10:00');
      setError(null);
      loadPatientsAndDoctors();
    }
  }, [isOpen]);

  const loadPatientsAndDoctors = async () => {
    setFetchingData(true);
    try {
      const [pts, docs] = await Promise.all([
        api.getPatients(),
        api.getDoctors(),
      ]);
      setPatients(pts);
      setDoctors(docs);

      if (initialPatientId && pts.some(p => p.id === initialPatientId)) {
        setSelectedPatientId(initialPatientId);
      } else if (pts.length > 0) {
        setSelectedPatientId(pts[0].id);
      }

      if (initialDoctorId && docs.some(d => d.id === initialDoctorId)) {
        setSelectedDoctorId(initialDoctorId);
      } else if (docs.length > 0) {
        setSelectedDoctorId(docs[0].id);
      }
    } catch (err: any) {
      setError('Could not load patients or doctors from backend.');
    } finally {
      setFetchingData(false);
    }
  };

  // Fetch doctor booked slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && date) {
      api.getDoctorAvailability(Number(selectedDoctorId), date)
        .then((data) => {
          setBookedSlots(data.booked_slots || []);
        })
        .catch(() => {
          setBookedSlots([]);
        });
    }
  }, [selectedDoctorId, date]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pId = Number(selectedPatientId);
    const dId = Number(selectedDoctorId);

    if (!pId) {
      setError('Please select a registered patient.');
      return;
    }
    if (!dId) {
      setError('Please select an attending doctor.');
      return;
    }
    if (!date) {
      setError('Please choose an appointment date (YYYY-MM-DD).');
      return;
    }
    if (!time) {
      setError('Please choose an appointment time (HH:MM).');
      return;
    }

    setLoading(true);
    try {
      const result = await api.bookAppointment({
        patient_id: pId,
        doctor_id: dId,
        date,
        time,
      });

      onShowToast(
        `Appointment #${result.appointment?.id} booked with ${result.appointment?.doctor_name} for ${date} at ${time}.`,
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FFFFFF] rounded-3xl max-w-xl w-full border border-[#E6E9E4] shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#788078] hover:text-[#29352F] hover:bg-[#FAF9F6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center shadow-xs">
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
              Book Medical Appointment
            </h3>
            <p className="text-xs text-[#788078]">
              Coordinate doctor schedules and patient consultations with conflict prevention.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#F5E3D7] border border-[#F5E3D7] text-xs text-[#C94C4C] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        {fetchingData ? (
          <div className="py-12 text-center text-sm text-[#788078]">
            Loading registered patients and available doctors...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#547B65]" />
                Select Patient <span className="text-[#C94C4C]">*</span>
              </label>
              {patients.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#F5E3D7] text-xs text-[#8C4320]">
                  No patients registered yet. Please register a patient first.
                </div>
              ) : (
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} — {p.name} (Age: {p.age}, Condition: {p.illness})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[#547B65]" />
                Select Doctor & Specialization <span className="text-[#C94C4C]">*</span>
              </label>
              {doctors.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#F5E3D7] text-xs text-[#8C4320]">
                  No doctors registered yet. Please add a doctor first.
                </div>
              ) : (
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization} (ID: #{d.id})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#547B65]" />
                  Date (YYYY-MM-DD) <span className="text-[#C94C4C]">*</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#547B65]" />
                  Time Slot (HH:MM) <span className="text-[#C94C4C]">*</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
                />
              </div>
            </div>

            {/* Available Time Slots Quick Picker */}
            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#29352F] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#547B65]" /> Quick Select Slot
                </span>
                <span className="text-[11px] text-[#788078]">
                  {bookedSlots.length > 0 ? `${bookedSlots.length} slot(s) already booked` : 'All slots available'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setTime(slot)}
                      className={`py-1.5 px-1 rounded-xl text-xs font-medium text-center transition-all ${
                        isBooked
                          ? 'bg-[#E6E9E4] text-[#788078] line-through cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-[#547B65] text-white shadow-xs font-bold'
                          : 'bg-white hover:bg-[#DDE9DF] text-[#29352F] border border-[#E6E9E4]'
                      }`}
                      title={isBooked ? 'Doctor already booked at this time' : 'Available slot'}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E9E4]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E6E9E4] text-xs font-semibold text-[#788078] hover:bg-[#FAF9F6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || patients.length === 0 || doctors.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#294D3C] text-white text-xs font-semibold hover:bg-[#1E372B] transition-all shadow-md shadow-[#294D3C]/15 hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Checking & Booking...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Book Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
