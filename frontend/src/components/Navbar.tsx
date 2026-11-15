import React, { useState } from 'react';
import { ActiveTab, StaffUser } from '../types';
import {
  Calendar,
  Users,
  UserPlus,
  Stethoscope,
  Home,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  HeartPulse,
  Info
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: StaffUser | null;
  onOpenAuth: () => void;
  onOpenBookAppointment: () => void;
  onOpenRegisterPatient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenBookAppointment,
  onOpenRegisterPatient,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'patients' as ActiveTab, label: 'Patients', icon: Users },
    { id: 'doctors' as ActiveTab, label: 'Doctors', icon: Stethoscope },
    { id: 'appointments' as ActiveTab, label: 'Appointments', icon: Calendar },
    { id: 'about' as ActiveTab, label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E6E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Original Hospital Identity */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#547B65] text-white flex items-center justify-center shadow-md shadow-[#547B65]/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#294D3C]">
                  Evergreen Care
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DDE9DF] text-[#294D3C] tracking-wide">
                  HOSPITAL
                </span>
              </div>
              <p className="text-xs text-[#788078] font-medium tracking-wide">
                Care that makes a difference.
              </p>
            </div>
          </div>

          {/* Center: Main Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/70 p-1.5 rounded-2xl border border-[#E6E9E4] shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#547B65] text-white shadow-sm'
                      : 'text-[#29352F] hover:bg-[#DDE9DF]/50 hover:text-[#294D3C]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#788078]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: User Authorization Pill & Book Appointment Button */}
          <div className="hidden lg:flex items-center gap-3">
            {/* User Authorization Badge */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                currentUser?.is_authorized
                  ? 'bg-white border-[#DDE9DF] text-[#294D3C] hover:border-[#547B65] shadow-xs'
                  : 'bg-[#F5E3D7]/60 border-[#F5E3D7] text-[#8C4320] hover:bg-[#F5E3D7]'
              }`}
              title="Click to view or switch staff authorization"
            >
              {currentUser?.is_authorized ? (
                <div className="w-2 h-2 rounded-full bg-[#2E7D55] animate-pulse" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-[#C58A38]" />
              )}
              <div className="text-left">
                <span className="block font-semibold">
                  {currentUser?.full_name || 'Guest Access'}
                </span>
                <span className="text-[10px] text-[#788078]">
                  {currentUser?.role ? `${currentUser.role}` : 'Click to Authorize'}
                </span>
              </div>
            </button>

            {/* Quick Register Patient (if authorized) */}
            <button
              onClick={onOpenRegisterPatient}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#DDE9DF] bg-white text-[#294D3C] text-sm font-semibold hover:bg-[#DDE9DF]/30 hover:border-[#547B65] transition-all shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-[#547B65]" />
              <span>Register Patient</span>
            </button>

            {/* Prominent Book Appointment CTA */}
            <button
              onClick={onOpenBookAppointment}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#294D3C] text-white text-sm font-semibold hover:bg-[#1E372B] transition-all shadow-md shadow-[#294D3C]/15 hover:shadow-lg hover:shadow-[#294D3C]/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenBookAppointment}
              className="p-2 rounded-xl bg-[#294D3C] text-white text-xs font-medium"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-[#E6E9E4] bg-white text-[#29352F] hover:bg-[#FAF9F6]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E9E4] bg-[#FAF9F6] px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-[#547B65] text-white font-semibold'
                      : 'text-[#29352F] hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E6E9E4] space-y-2">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E9E4] text-xs font-medium text-[#294D3C]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#547B65]" />
                <span>
                  {currentUser?.full_name ? `${currentUser.full_name} (${currentUser.role})` : 'Authorize Staff / Admin'}
                </span>
              </div>
              <span className="text-[11px] text-[#547B65] font-semibold underline">Manage</span>
            </button>

            <button
              onClick={() => {
                onOpenRegisterPatient();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDE9DF] bg-white text-[#294D3C] text-sm font-semibold"
            >
              <UserPlus className="w-4 h-4 text-[#547B65]" />
              <span>Register Patient</span>
            </button>

            <button
              onClick={() => {
                onOpenBookAppointment();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#294D3C] text-white text-sm font-semibold"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
