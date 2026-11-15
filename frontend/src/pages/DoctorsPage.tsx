import React, { useState, useMemo } from 'react';
import { Doctor, StaffUser } from '../types';
import {
  Stethoscope,
  Plus,
  Search,
  LayoutGrid,
  List,
  Award,
  Calendar,
  Eye,
  Activity,
  ArrowRight
} from 'lucide-react';

interface DoctorsPageProps {
  doctors: Doctor[];
  loading: boolean;
  currentUser: StaffUser | null;
  onOpenAddDoctor: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookWithDoctor: (doctorId: number) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctors,
  loading,
  currentUser,
  onOpenAddDoctor,
  onSelectDoctor,
  onBookWithDoctor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Extract specialties
  const specialties = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => {
      if (d.specialization) set.add(d.specialization);
    });
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id.toString().includes(searchTerm) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'all' || d.specialization === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* PAGE HEADER                                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9E4]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#294D3C]">
            Our Doctors
          </h1>
          <p className="text-xs sm:text-sm text-[#788078] mt-1">
            Manage your medical team, review clinical credentials, and coordinate specialties.
          </p>
        </div>

        <button
          onClick={onOpenAddDoctor}
          className="px-5 py-3 rounded-2xl bg-[#547B65] text-white text-xs sm:text-sm font-semibold hover:bg-[#294D3C] transition-all shadow-md shadow-[#547B65]/15 hover:shadow-lg flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Doctor</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOOLBAR: SEARCH, SPECIALTY FILTER & VIEW TOGGLE                */}
      {/* ------------------------------------------------------------- */}
      <div className="hospital-card p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#788078] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search doctors by Name, ID, or Specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Specialty Filter */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65]"
          >
            <option value="all">All Specialties ({doctors.length})</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF9F6] border border-[#E6E9E4]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-[#294D3C]'
                  : 'text-[#788078] hover:text-[#29352F]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white shadow-xs text-[#294D3C]'
                  : 'text-[#788078] hover:text-[#29352F]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DOCTORS CONTENT (Grid or Table)                               */}
      {/* ------------------------------------------------------------- */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#788078]">
          Loading medical staff directory from database...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="hospital-card p-12 text-center rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E9E4] text-[#788078] flex items-center justify-center mx-auto">
            <Stethoscope className="w-8 h-8 text-[#547B65]" />
          </div>
          <div>
            <h4 className="font-editorial text-xl font-bold text-[#294D3C]">
              No Doctors Found
            </h4>
            <p className="text-xs sm:text-sm text-[#788078] mt-1 max-w-sm mx-auto">
              {searchTerm || selectedSpecialty !== 'all'
                ? 'Try adjusting your search query or specialty filter.'
                : 'No doctors registered in the system yet. Add your first doctor to begin.'}
            </p>
          </div>
          <button
            onClick={onOpenAddDoctor}
            className="px-5 py-2.5 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-all shadow-sm"
          >
            + Add Your First Doctor
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="hospital-card rounded-2xl p-6 border border-[#E6E9E4] hover:border-[#DDE9DF] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center font-editorial text-2xl font-bold shadow-xs group-hover:scale-105 transition-transform">
                    {doctor.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#E6E9E4] text-[#788078]">
                    ID: #{doctor.id}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#294D3C] group-hover:text-[#547B65] transition-colors">
                  {doctor.name}
                </h3>

                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E5EEF5] text-[#2A5372]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{doctor.specialization}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E6E9E4] text-xs text-[#788078] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#547B65]" />
                    Age: {doctor.age} years
                  </span>
                  <span className="font-medium text-[#2E7D55]">Available for Bookings</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-6 pt-4 border-t border-[#E6E9E4] flex items-center gap-2">
                <button
                  onClick={() => onSelectDoctor(doctor)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E6E9E4] text-xs font-semibold text-[#29352F] hover:bg-[#FAF9F6] hover:border-[#547B65] transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => onBookWithDoctor(doctor.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-colors flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Layout */
        <div className="hospital-card rounded-2xl overflow-hidden border border-[#E6E9E4]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] border-b border-[#E6E9E4] text-xs font-bold uppercase tracking-wider text-[#788078]">
                <tr>
                  <th className="py-3.5 px-4">Doctor ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Specialization</th>
                  <th className="py-3.5 px-4">Age</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E4] text-[#29352F]">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-xs text-[#294D3C]">
                      #{doctor.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#29352F]">
                      {doctor.name}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#E5EEF5] text-[#2A5372]">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-[#788078]">
                      {doctor.age} yrs
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectDoctor(doctor)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6E9E4] text-xs font-medium text-[#29352F] hover:bg-[#FAF9F6]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onBookWithDoctor(doctor.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#547B65] text-white text-xs font-medium hover:bg-[#294D3C]"
                      >
                        Book Visit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
