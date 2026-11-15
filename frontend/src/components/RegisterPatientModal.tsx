import React, { useState, useEffect } from 'react';
import { StaffUser } from '../types';
import { api } from '../services/api';
import {
  UserPlus,
  X,
  Check,
  AlertCircle,
  Hash,
  User,
  Activity,
  Heart,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: StaffUser | null;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [illness, setIllness] = useState('');
  const [customId, setCustomId] = useState<number | ''>('');
  const [autoId, setAutoId] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common clinical illness presets for fast selection
  const commonIllnesses = [
    'Seasonal Viral Flu',
    'Essential Hypertension',
    'Type 2 Diabetes Routine Checkup',
    'Acute Bronchitis',
    'Pediatric Fever & Consultation',
    'Mild Sprain / Orthopedic Injury',
    'General Health Wellness Screening',
  ];

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAge('');
      setIllness('');
      setCustomId('');
      setAutoId(true);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Patient full name is required.');
      return;
    }

    const numAge = Number(age);
    if (!numAge || isNaN(numAge) || numAge <= 0 || numAge > 120) {
      setError('Please enter a valid age between 1 and 120.');
      return;
    }

    const cleanIllness = illness.trim();
    if (!cleanIllness) {
      setError('Illness or chief medical reason for visit is required.');
      return;
    }

    let patientIdToSend: number | undefined = undefined;
    if (!autoId && customId) {
      const idNum = Number(customId);
      if (idNum <= 0) {
        setError('Custom Patient ID must be a positive number.');
        return;
      }
      patientIdToSend = idNum;
    }

    setLoading(true);
    try {
      const result = await api.registerPatient({
        name: cleanName,
        age: numAge,
        illness: cleanIllness,
        id: patientIdToSend,
      });

      onShowToast(
        `Patient ${result.patient?.name || cleanName} (ID: #${result.patient?.id}) registered successfully and stored in hospital.db`,
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register patient in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FFFFFF] rounded-3xl max-w-lg w-full border border-[#E6E9E4] shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
            <UserPlus className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
              Register New Patient
            </h3>
            <p className="text-xs text-[#788078]">
              Create a permanent patient medical profile in Evergreen Care Hospital's database.
            </p>
          </div>
        </div>

        {/* Staff Authorization Status */}
        <div className="mb-5 p-3 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#547B65]" />
            <span className="text-[#788078]">Authorized by:</span>
            <span className="font-semibold text-[#294D3C]">
              {currentUser?.full_name || 'Staff Administrator'}
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DDE9DF] text-[#294D3C]">
            {currentUser?.role || 'Authorized'}
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-[#F5E3D7] border border-[#F5E3D7] text-xs text-[#C94C4C] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient ID Assignment */}
          <div className="p-3.5 rounded-2xl border border-[#E6E9E4] bg-[#FAF9F6]/60">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#29352F] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#547B65]" />
                Patient ID Allocation
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoId(true)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    autoId
                      ? 'bg-[#547B65] text-white shadow-xs'
                      : 'bg-white text-[#788078] border border-[#E6E9E4]'
                  }`}
                >
                  Auto-generate
                </button>
                <button
                  type="button"
                  onClick={() => setAutoId(false)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    !autoId
                      ? 'bg-[#547B65] text-white shadow-xs'
                      : 'bg-white text-[#788078] border border-[#E6E9E4]'
                  }`}
                >
                  Custom ID
                </button>
              </div>
            </div>

            {autoId ? (
              <p className="text-[11px] text-[#788078]">
                The backend SQL database will automatically allocate the next unique sequential ID.
              </p>
            ) : (
              <input
                type="number"
                min="1"
                placeholder="Enter unique Patient ID (e.g. 501)"
                value={customId}
                onChange={(e) => setCustomId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E6E9E4] bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65]"
                required
              />
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#547B65]" />
              Full Name <span className="text-[#C94C4C]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rohan Mehta (or Maya Joshi)"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#547B65]" />
              Age <span className="text-[#C94C4C]">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Age in years (1 - 120)"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
            />
          </div>

          {/* Illness / Condition */}
          <div>
            <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#547B65]" />
              Illness / Chief Medical Reason <span className="text-[#C94C4C]">*</span>
            </label>
            <input
              type="text"
              value={illness}
              onChange={(e) => setIllness(e.target.value)}
              placeholder="e.g. Seasonal Allergies, Bronchitis, Blood Pressure Check"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
            />

            {/* Quick Illness Presets */}
            <div className="mt-2.5">
              <span className="text-[11px] text-[#788078] flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3 text-[#547B65]" /> Quick suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonIllnesses.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setIllness(c)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#DDE9DF]/60 border border-[#E6E9E4] text-[#29352F] transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-all shadow-md shadow-[#547B65]/15 hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving to Database...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Register Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
