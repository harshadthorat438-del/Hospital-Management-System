export interface Patient {
  id: number;
  patient_id?: number;
  name: string;
  age: number;
  illness: string;
}

export interface Doctor {
  id: number;
  doctor_id?: number;
  name: string;
  age: number;
  specialization: string;
}

export interface Appointment {
  id: number;
  appointment_id?: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  appointment_date: string;
  date: string;
  appointment_time: string;
  time: string;
  status: 'Scheduled' | 'Cancelled';
  cancelled: boolean;
}

export interface DashboardStats {
  total_patients: number;
  total_doctors: number;
  total_appointments: number;
  upcoming_appointments: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_appointments: Appointment[];
}

export interface StaffUser {
  id?: number;
  username: string;
  full_name: string;
  role: string;
  department: string;
  is_authorized?: boolean;
}

export type ActiveTab = 'home' | 'patients' | 'doctors' | 'appointments' | 'about';
