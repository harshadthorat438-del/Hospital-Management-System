import React, { useState, useMemo } from 'react';
import { Patient, StaffUser } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  Activity,
  Heart,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface PatientsPageProps {
  patients: Patient[];
  loading: boolean;
  currentUser: StaffUser | null;
  onOpenRegisterPatient: () => void;
  onSelectPatient: (patient: Patient) => void;
  onDeletePatient: (id: number) => void;
  onBookForPatient: (patientId: number) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  patients,
  loading,
  currentUser,
  onOpenRegisterPatient,
  onSelectPatient,
  onDeletePatient,
  onBookForPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIllness, setSelectedIllness] = useState('all');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'age'>('id');

  // Extract unique illness tags for filter
  const illnesses = useMemo(() => {
    const set = new Set<string>();
    patients.forEach((p) => {
      if (p.illness) set.add(p.illness);
    });
    return Array.from(set);
  }, [patients]);

  // Statistics calculation
  const pediatricCount = patients.filter((p) => p.age < 18).length;
  const adultCount = patients.filter((p) => p.age >= 18).length;

  // Filter & sort
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toString().includes(searchTerm) ||
          p.illness.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesIllness =
          selectedIllness === 'all' || p.illness === selectedIllness;

        return matchesSearch && matchesIllness;
      })
      .sort((a, b) => {
        if (sortBy === 'id') return a.id - b.id;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'age') return a.age - b.age;
        return 0;
      });
  }, [patients, searchTerm, selectedIllness, sortBy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* PAGE HEADER                                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9E4]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#294D3C]">
            Patient Management
          </h1>
          <p className="text-xs sm:text-sm text-[#788078] mt-1">
            Keep patient information organised, accessible, and synchronized with SQLite database.
          </p>
        </div>

        <button
          onClick={onOpenRegisterPatient}
          className="px-5 py-3 rounded-2xl bg-[#547B65] text-white text-xs sm:text-sm font-semibold hover:bg-[#294D3C] transition-all shadow-md shadow-[#547B65]/15 hover:shadow-lg flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register Patient</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PATIENT METRICS BAR                                           */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hospital-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#788078] uppercase font-bold tracking-wider">
              Total Registered
            </div>
            <div className="font-editorial text-2xl font-bold text-[#294D3C]">
              {patients.length} Patients
            </div>
          </div>
        </div>

        <div className="hospital-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E5EEF5] text-[#2A5372] flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#788078] uppercase font-bold tracking-wider">
              Adult Patients (18+)
            </div>
            <div className="font-editorial text-2xl font-bold text-[#2A5372]">
              {adultCount}
            </div>
          </div>
        </div>

        <div className="hospital-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5E3D7] text-[#8C4320] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#788078] uppercase font-bold tracking-wider">
              Pediatric Patients (&lt;18)
            </div>
            <div className="font-editorial text-2xl font-bold text-[#8C4320]">
              {pediatricCount}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH AND FILTERS TOOLBAR                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="hospital-card p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#788078] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Patient ID, Name, or Illness..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
          />
        </div>

        {/* Filter by Illness */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#788078] shrink-0" />
          <select
            value={selectedIllness}
            onChange={(e) => setSelectedIllness(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65]"
          >
            <option value="all">All Conditions ({patients.length})</option>
            {illnesses.map((ill) => (
              <option key={ill} value={ill}>
                {ill}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65]"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PATIENT TABLE                                                 */}
      {/* ------------------------------------------------------------- */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#788078]">
          Loading patient directory from SQLite database...
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="hospital-card p-12 text-center rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E9E4] text-[#788078] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-[#547B65]" />
          </div>
          <div>
            <h4 className="font-editorial text-xl font-bold text-[#294D3C]">
              No Patients Found
            </h4>
            <p className="text-xs sm:text-sm text-[#788078] mt-1 max-w-sm mx-auto">
              {searchTerm || selectedIllness !== 'all'
                ? 'Try clearing your search filters to find registered patients.'
                : 'No patients registered in the database yet.'}
            </p>
          </div>
          <button
            onClick={onOpenRegisterPatient}
            className="px-5 py-2.5 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-all shadow-sm"
          >
            + Register New Patient
          </button>
        </div>
      ) : (
        <div className="hospital-card rounded-2xl overflow-hidden border border-[#E6E9E4]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] border-b border-[#E6E9E4] text-xs font-bold uppercase tracking-wider text-[#788078]">
                <tr>
                  <th className="py-3.5 px-4">Patient ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Age</th>
                  <th className="py-3.5 px-4">Illness / Condition</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E4] text-[#29352F]">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-[#FAF9F6]/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectPatient(patient)}
                  >
                    <td className="py-4 px-4 font-mono font-bold text-xs text-[#294D3C]">
                      #{patient.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#29352F] group-hover:text-[#294D3C]">
                      {patient.name}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-[#788078]">
                      {patient.age} yrs
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF9F6] border border-[#E6E9E4] text-[#29352F]">
                        {patient.illness}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DDE9DF] text-[#294D3C]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D55]" />
                        Active
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-right space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6E9E4] text-xs font-medium text-[#29352F] hover:bg-[#FAF9F6] hover:border-[#547B65] transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onBookForPatient(patient.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#DDE9DF] text-[#294D3C] text-xs font-medium hover:bg-[#547B65] hover:text-white transition-colors"
                        title="Book appointment for this patient"
                      >
                        Book Visit
                      </button>
                      <button
                        onClick={() => onDeletePatient(patient.id)}
                        className="p-1.5 rounded-xl text-[#788078] hover:text-[#C94C4C] hover:bg-[#F5E3D7]/60 transition-colors"
                        title="Delete record if no active appointments"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-[#FAF9F6] border-t border-[#E6E9E4] text-xs text-[#788078] flex items-center justify-between">
            <span>Showing {filteredPatients.length} of {patients.length} patients</span>
            <span>SQLite Database: <code className="text-[#294D3C]">patients</code></span>
          </div>
        </div>
      )}
    </div>
  );
};
