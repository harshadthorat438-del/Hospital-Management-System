import React, { useState } from 'react';
import { StaffUser } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  X,
  Check,
  AlertCircle,
  Building,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StaffUser | null;
  onAuthSuccess: (user: StaffUser) => void;
  onLogout: () => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  onShowToast,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (u = username, p = password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.loginStaff(u, p);
      onAuthSuccess(user);
      onShowToast(`Authorized as ${user.full_name} (${user.role})`, 'success');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      u: 'admin',
      p: 'admin123',
      name: 'Dr. Sunita Deshmukh',
      role: 'Administrator',
      dept: 'Executive Administration',
      desc: 'Full administrative access: register patients, add doctors, cancel appointments, oversight.',
      badgeClass: 'badge-sage',
    },
    {
      u: 'reception',
      p: 'recep123',
      name: 'Kavita Verma',
      role: 'Receptionist',
      dept: 'Admissions & Booking',
      desc: 'Operational access: register arriving patients, book appointments, check doctor availability.',
      badgeClass: 'badge-blue',
    },
    {
      u: 'doctor',
      p: 'doc123',
      name: 'Dr. Rajesh Sharma',
      role: 'Attending Physician',
      dept: 'Cardiology & Medicine',
      desc: 'Clinical access: view patient histories, schedule consultations, view departmental calendar.',
      badgeClass: 'badge-peach',
    },
  ];

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
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#294D3C]">
              Staff & Dashboard Authorization
            </h3>
            <p className="text-xs text-[#788078]">
              Authorize your session to manage patients, coordinate doctors, and configure appointments.
            </p>
          </div>
        </div>

        {/* Current Session Banner */}
        {currentUser?.is_authorized && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#DDE9DF] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#547B65] text-white flex items-center justify-center font-bold text-sm">
                {currentUser.full_name.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-[#788078] font-medium">Currently Authorized:</div>
                <div className="text-sm font-bold text-[#294D3C]">{currentUser.full_name}</div>
                <div className="text-[11px] text-[#547B65] font-semibold">{currentUser.role} • {currentUser.department}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                onShowToast('Session signed out. Now viewing as guest.', 'info');
              }}
              className="px-3 py-1.5 rounded-xl border border-[#E6E9E4] text-xs font-semibold text-[#C94C4C] hover:bg-[#F5E3D7]/50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Quick Select Preset Staff Roles */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#788078] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#547B65]" />
              One-Click Staff Role Authorization
            </span>
            <span className="text-[11px] text-[#788078]">Pre-configured credentials</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {demoAccounts.map((account) => {
              const isSelected = currentUser?.username === account.u;
              return (
                <div
                  key={account.u}
                  onClick={() => handleLogin(account.u, account.p)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'border-[#547B65] bg-[#DDE9DF]/30 ring-1 ring-[#547B65]'
                      : 'border-[#E6E9E4] bg-white hover:border-[#547B65] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#29352F] group-hover:text-[#294D3C]">
                        {account.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${account.badgeClass}`}>
                        {account.role}
                      </span>
                    </div>
                    <div className="text-xs text-[#788078] line-clamp-1">{account.desc}</div>
                    <div className="text-[11px] text-[#547B65] font-medium flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {account.dept}
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className={`shrink-0 ml-3 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#294D3C] text-white'
                        : 'bg-[#DDE9DF] text-[#294D3C] group-hover:bg-[#547B65] group-hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Switch Role'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E6E9E4]"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-[#788078] font-medium">
            Or login with custom credentials
          </span>
        </div>

        {/* Manual Credentials Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-[#F5E3D7]/80 border border-[#F5E3D7] text-xs text-[#C94C4C] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#29352F] mb-1.5">
                Staff Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#788078] absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29352F] mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#788078] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
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
              className="px-5 py-2.5 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authorizing...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Verify & Authorize</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
