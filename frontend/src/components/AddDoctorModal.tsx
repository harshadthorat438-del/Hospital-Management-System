import React, { useState, useEffect } from 'react';
import { StaffUser } from '../types';
import { api } from '../services/api';
import {
  Stethoscope,
  X,
  Check,
  AlertCircle,
  Hash,
  User,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: StaffUser | null;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [customId, setCustomId] = useState<number | ''>('');
  const [autoId, setAutoId] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const specializations = [
    'General Pediatrics & Child Health',
    'Cardiology & Vascular Medicine',
    'Orthopedics & Sports Medicine',
    'Neurology & Cognitive Health',
    'Internal Medicine & Primary Care',
    'Dermatology & Clinical Aesthetics',
    'Pulmonology & Respiratory Care',
    'Endocrinology & Diabetes',
  ];

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAge('');
      setSpecialization('');
      setCustomId('');
      setAutoId(true);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let cleanName = name.trim();
    if (!cleanName) {
      setError('Doctor name is required.');
      return;
    }
    if (!cleanName.toLowerCase().startsWith('dr.')) {
      cleanName = `Dr. ${cleanName}`;
    }

    const numAge = Number(age);
    if (!numAge || isNaN(numAge) || numAge < 21 || numAge > 100) {
      setError('Please enter a valid age between 21 and 100.');
      return;
    }

    const cleanSpec = specialization.trim();
    if (!cleanSpec) {
      setError('Specialization is required.');
      return;
    }

    let doctorIdToSend: number | undefined = undefined;
    if (!autoId && customId) {
      const idNum = Number(customId);
      if (idNum <= 0) {
        setError('Doctor ID must be a positive number.');
        return;
      }
      doctorIdToSend = idNum;
    }

    setLoading(true);
    try {
      const result = await api.addDoctor({
        name: cleanName,
        age: numAge,
        specialization: cleanSpec,
        id: doctorIdToSend,
      });

      onShowToast(
        `Doctor ${result.doctor?.name || cleanName} (ID: #${result.doctor?.id}) added successfully.`,
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add doctor to database.');
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
            <Stethoscope className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
              Add Medical Practitioner
            </h3>
            <p className="text-xs text-[#788078]">
              Register a licensed physician or specialist to the hospital directory.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-[#F5E3D7] border border-[#F5E3D7] text-xs text-[#C94C4C] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor ID Assignment */}
          <div className="p-3.5 rounded-2xl border border-[#E6E9E4] bg-[#FAF9F6]/60">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#29352F] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#547B65]" />
                Doctor ID Assignment
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
                Auto-assigned next numerical ID (e.g. 105) in SQLite database.
              </p>
            ) : (
              <input
                type="number"
                min="1"
                placeholder="e.g. 105"
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
              Doctor Full Name <span className="text-[#C94C4C]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Sharma (or Dr. Ananya Iyer)"
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
              min="21"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 42"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-xs font-semibold text-[#29352F] mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#547B65]" />
              Specialization / Clinical Department <span className="text-[#C94C4C]">*</span>
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. General Pediatrics & Child Health"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
            />

            {/* Quick Specialization Tags */}
            <div className="mt-2.5">
              <span className="text-[11px] text-[#788078] flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3 text-[#547B65]" /> Select common specialization:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {specializations.slice(0, 4).map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSpecialization(spec)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#DDE9DF]/60 border border-[#E6E9E4] text-[#29352F] transition-colors"
                  >
                    {spec}
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
                <span>Adding to Directory...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Add Doctor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
