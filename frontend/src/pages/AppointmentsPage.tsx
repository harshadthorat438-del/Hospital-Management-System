import React, { useState, useMemo } from 'react';
import { Appointment, StaffUser } from '../types';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface AppointmentsPageProps {
  appointments: Appointment[];
  loading: boolean;
  currentUser: StaffUser | null;
  onOpenBookAppointment: () => void;
  onSelectAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  loading,
  currentUser,
  onOpenBookAppointment,
  onSelectAppointment,
  onCancelAppointment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState('');

  // Metrics
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter((a) => !a.cancelled).length;
  const cancelledCount = appointments.filter((a) => a.cancelled).length;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        a.id.toString().includes(searchLower) ||
        a.patient_name.toLowerCase().includes(searchLower) ||
        a.doctor_name.toLowerCase().includes(searchLower) ||
        a.specialization.toLowerCase().includes(searchLower);

      // Status
      let matchesStatus = true;
      if (statusFilter === 'scheduled') matchesStatus = !a.cancelled;
      if (statusFilter === 'cancelled') matchesStatus = a.cancelled;

      // Date
      let matchesDate = true;
      const apptDate = a.appointment_date || a.date;
      if (dateFilter) matchesDate = apptDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* PAGE HEADER                                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9E4]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#294D3C]">
            Appointment Management
          </h1>
          <p className="text-xs sm:text-sm text-[#788078] mt-1">
            Schedule and manage hospital visits in one place with automated conflict detection.
          </p>
        </div>

        <button
          onClick={onOpenBookAppointment}
          className="px-5 py-3 rounded-2xl bg-[#547B65] text-white text-xs sm:text-sm font-semibold hover:bg-[#294D3C] transition-all shadow-md shadow-[#547B65]/15 hover:shadow-lg flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Book Appointment</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* APPOINTMENT STATISTICS                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hospital-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E6E9E4] text-[#294D3C] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[#547B65]" />
          </div>
          <div>
            <div className="text-xs text-[#788078] uppercase font-bold tracking-wider">
              Total Appointments
            </div>
            <div className="font-editorial text-2xl font-bold text-[#294D3C]">
              {totalCount}
            </div>
          </div>
        </div>

        <div className="hospital-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDE9DF] text-[#294D3C] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#2E7D55]" />
          </div>
          <div>
            <div className="text-xs text-[#788078] uppercase font-bold tracking-wider">
              Upcoming Scheduled
            </div>
            <div className="font-editorial text-2xl font-bold text-[#2E7D55]">
              {scheduledCount}
            </div>
          </div>
        </div>

        <div className="hospital-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5E3D7] text-[#8C4320] flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-[#C94C4C]" />
          </div>
          <div>
            <div className="text-xs text-[#788078] uppercase font-bold tracking-wider">
              Cancelled Visits
            </div>
            <div className="font-editorial text-2xl font-bold text-[#C94C4C]">
              {cancelledCount}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FILTERS & SEARCH TOOLBAR                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="hospital-card p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF9F6] border border-[#E6E9E4] self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-[#294D3C] shadow-xs'
                : 'text-[#788078] hover:text-[#29352F]'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'scheduled'
                ? 'bg-[#547B65] text-white shadow-xs'
                : 'text-[#788078] hover:text-[#29352F]'
            }`}
          >
            Scheduled ({scheduledCount})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-[#C94C4C] text-white shadow-xs'
                : 'text-[#788078] hover:text-[#29352F]'
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>

        {/* Search & Date Filter */}
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#788078] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, Patient, Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-[#E6E9E4] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#547B65]"
              title="Filter by specific date"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-[#788078] hover:text-[#C94C4C] underline px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* APPOINTMENTS TABLE                                            */}
      {/* ------------------------------------------------------------- */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#788078]">
          Loading appointments from SQLite database...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="hospital-card p-12 text-center rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E9E4] text-[#788078] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-[#547B65]" />
          </div>
          <div>
            <h4 className="font-editorial text-xl font-bold text-[#294D3C]">
              No Appointments Found
            </h4>
            <p className="text-xs sm:text-sm text-[#788078] mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' || dateFilter
                ? 'Try adjusting your search criteria or date filter.'
                : 'No appointments on record yet. Schedule your first visit.'}
            </p>
          </div>
          <button
            onClick={onOpenBookAppointment}
            className="px-5 py-2.5 rounded-xl bg-[#547B65] text-white text-xs font-semibold hover:bg-[#294D3C] transition-all shadow-sm"
          >
            + Book Appointment
          </button>
        </div>
      ) : (
        <div className="hospital-card rounded-2xl overflow-hidden border border-[#E6E9E4]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] border-b border-[#E6E9E4] text-xs font-bold uppercase tracking-wider text-[#788078]">
                <tr>
                  <th className="py-3.5 px-4">Appt ID</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Doctor & Specialty</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E4] text-[#29352F]">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-xs text-[#294D3C]">
                      #{appt.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#29352F]">{appt.patient_name}</div>
                      <div className="text-[11px] text-[#788078]">Patient ID: #{appt.patient_id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#294D3C]">{appt.doctor_name}</div>
                      <div className="text-[11px] text-[#788078]">{appt.specialization} (Doc #{appt.doctor_id})</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-xs text-[#29352F]">
                        {appt.appointment_date || appt.date}
                      </div>
                      <div className="text-[11px] text-[#788078] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appt.appointment_time || appt.time}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          appt.cancelled
                            ? 'bg-[#F5E3D7] text-[#8C4320]'
                            : 'bg-[#DDE9DF] text-[#294D3C]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            appt.cancelled ? 'bg-[#8C4320]' : 'bg-[#2E7D55]'
                          }`}
                        />
                        {appt.cancelled ? 'Cancelled' : 'Scheduled'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectAppointment(appt)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6E9E4] text-xs font-medium text-[#29352F] hover:bg-[#FAF9F6] transition-colors"
                      >
                        Details
                      </button>
                      {!appt.cancelled && (
                        <button
                          onClick={() => onCancelAppointment(appt)}
                          className="px-3 py-1.5 rounded-xl border border-[#F5E3D7] text-xs font-medium text-[#C94C4C] hover:bg-[#F5E3D7]/60 transition-colors"
                          title="Cancel appointment and reopen physician slot"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-[#FAF9F6] border-t border-[#E6E9E4] text-xs text-[#788078] flex items-center justify-between">
            <span>Showing {filteredAppointments.length} of {appointments.length} appointments</span>
            <span>SQLite Database: <code className="text-[#294D3C]">appointments</code></span>
          </div>
        </div>
      )}
    </div>
  );
};
