import {
  Patient,
  Doctor,
  Appointment,
  DashboardData,
  StaffUser,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
    return res.json();
  },

  // Patients
  async getPatients(): Promise<Patient[]> {
    const res = await fetch(`${API_BASE}/patients`);
    if (!res.ok) throw new Error('Failed to fetch patients list');
    return res.json();
  },

  async getPatientById(id: number): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    if (!res.ok) throw new Error(`Patient #${id} not found`);
    return res.json();
  },

  async registerPatient(data: { name: string; age: number; illness: string; id?: number }) {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to register patient');
    }
    return result;
  },

  async deletePatient(id: number) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete patient');
    }
    return result;
  },

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    const res = await fetch(`${API_BASE}/doctors`);
    if (!res.ok) throw new Error('Failed to fetch doctors list');
    return res.json();
  },

  async getDoctorById(id: number): Promise<Doctor> {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    if (!res.ok) throw new Error(`Doctor #${id} not found`);
    return res.json();
  },

  async addDoctor(data: { name: string; age: number; specialization: string; id?: number }) {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to add doctor');
    }
    return result;
  },

  async getDoctorAvailability(doctorId: number, date: string) {
    const res = await fetch(`${API_BASE}/doctors/${doctorId}/availability?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch doctor availability');
    return res.json();
  },

  // Appointments
  async getAppointments(status?: string, date?: string): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (date) params.append('date', date);

    const res = await fetch(`${API_BASE}/appointments?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async getAppointmentById(id: number): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/appointments/${id}`);
    if (!res.ok) throw new Error(`Appointment #${id} not found`);
    return res.json();
  },

  async bookAppointment(data: {
    patient_id: number;
    doctor_id: number;
    date: string;
    time: string;
  }) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to book appointment');
    }
    return result;
  },

  async cancelAppointment(id: number) {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'POST',
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to cancel appointment');
    }
    return result;
  },

  // Staff Authorization
  async loginStaff(username: string, password: string): Promise<StaffUser> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Authentication failed');
    }
    return result.user;
  },

  async getStaffList(): Promise<StaffUser[]> {
    const res = await fetch(`${API_BASE}/auth/staff-list`);
    if (!res.ok) return [];
    return res.json();
  },
};
