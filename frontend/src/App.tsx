import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveTab,
  Patient,
  Doctor,
  Appointment,
  DashboardData,
  StaffUser,
} from './types';
import { api } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { RegisterPatientModal } from './components/RegisterPatientModal';
import { AddDoctorModal } from './components/AddDoctorModal';
import { BookAppointmentModal } from './components/BookAppointmentModal';
import { CancelAppointmentModal } from './components/CancelAppointmentModal';
import { PatientDetailsModal } from './components/PatientDetailsModal';
import { DoctorDetailsModal } from './components/DoctorDetailsModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PatientsPage } from './pages/PatientsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Staff Authorization State - Pre-authorized with Chief Medical Admin
  const [currentUser, setCurrentUser] = useState<StaffUser | null>({
    id: 1,
    username: 'admin',
    full_name: 'Dr. Sunita Deshmukh',
    role: 'Administrator',
    department: 'Executive Administration',
    is_authorized: true,
  });

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [registerPatientModalOpen, setRegisterPatientModalOpen] = useState(false);
  const [addDoctorModalOpen, setAddDoctorModalOpen] = useState(false);
  const [bookAppointmentModalOpen, setBookAppointmentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [patientDetailsModalOpen, setPatientDetailsModalOpen] = useState(false);
  const [doctorDetailsModalOpen, setDoctorDetailsModalOpen] = useState(false);

  // Selected Entities
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [initialBookingPatientId, setInitialBookingPatientId] = useState<number | undefined>(undefined);
  const [initialBookingDoctorId, setInitialBookingDoctorId] = useState<number | undefined>(undefined);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all backend data from C++ REST API
  const refreshData = useCallback(async () => {
    try {
      const [dash, pts, docs, appts] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getPatients().catch(() => []),
        api.getDoctors().catch(() => []),
        api.getAppointments().catch(() => []),
      ]);
      if (dash) setDashboardData(dash);
      setPatients(pts);
      setDoctors(docs);
      setAppointments(appts);
    } catch (err: any) {
      console.error('Data refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handlers
  const handleOpenBookAppointment = (patientId?: number, doctorId?: number) => {
    setInitialBookingPatientId(patientId);
    setInitialBookingDoctorId(doctorId);
    setBookAppointmentModalOpen(true);
  };

  const handleOpenCancelAppointment = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setCancelModalOpen(true);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientDetailsModalOpen(true);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDoctorDetailsModalOpen(true);
  };

  const handleDeletePatient = async (id: number) => {
    if (!window.confirm(`Are you sure you want to remove patient #${id}? This requires no existing appointment records.`)) {
      return;
    }
    try {
      await api.deletePatient(id);
      showToast(`Patient #${id} record removed from database.`, 'success');
      setPatientDetailsModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Cannot delete patient record.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#29352F] antialiased">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenBookAppointment={() => handleOpenBookAppointment()}
        onOpenRegisterPatient={() => setRegisterPatientModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'home' && (
          <HomePage
            dashboardData={dashboardData}
            loading={loading}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            onOpenRegisterPatient={() => setRegisterPatientModalOpen(true)}
            onOpenAddDoctor={() => setAddDoctorModalOpen(true)}
            onOpenBookAppointment={() => handleOpenBookAppointment()}
            onViewAppointmentDetails={(appt) => {
              setSelectedAppointment(appt);
              showToast(`Appointment #${appt.id} with ${appt.doctor_name} for ${appt.appointment_date || appt.date} (${appt.status})`, 'info');
            }}
            onCancelAppointment={handleOpenCancelAppointment}
          />
        )}

        {activeTab === 'patients' && (
          <PatientsPage
            patients={patients}
            loading={loading}
            currentUser={currentUser}
            onOpenRegisterPatient={() => setRegisterPatientModalOpen(true)}
            onSelectPatient={handleSelectPatient}
            onDeletePatient={handleDeletePatient}
            onBookForPatient={(pId) => handleOpenBookAppointment(pId)}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorsPage
            doctors={doctors}
            loading={loading}
            currentUser={currentUser}
            onOpenAddDoctor={() => setAddDoctorModalOpen(true)}
            onSelectDoctor={handleSelectDoctor}
            onBookWithDoctor={(dId) => handleOpenBookAppointment(undefined, dId)}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsPage
            appointments={appointments}
            loading={loading}
            currentUser={currentUser}
            onOpenBookAppointment={() => handleOpenBookAppointment()}
            onSelectAppointment={(appt) => {
              showToast(`Appointment #${appt.id}: ${appt.patient_name} with ${appt.doctor_name} on ${appt.appointment_date || appt.date} at ${appt.appointment_time || appt.time}`, 'info');
            }}
            onCancelAppointment={handleOpenCancelAppointment}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* ------------------------------------------------------------- */}
      {/* MODALS                                                        */}
      {/* ------------------------------------------------------------- */}

      {/* 1. Staff Authorization Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
        onLogout={() => {
          setCurrentUser(null);
        }}
        onShowToast={showToast}
      />

      {/* 2. Register Patient Modal */}
      <RegisterPatientModal
        isOpen={registerPatientModalOpen}
        onClose={() => setRegisterPatientModalOpen(false)}
        onSuccess={refreshData}
        currentUser={currentUser}
        onShowToast={showToast}
      />

      {/* 3. Add Doctor Modal */}
      <AddDoctorModal
        isOpen={addDoctorModalOpen}
        onClose={() => setAddDoctorModalOpen(false)}
        onSuccess={refreshData}
        currentUser={currentUser}
        onShowToast={showToast}
      />

      {/* 4. Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={bookAppointmentModalOpen}
        onClose={() => setBookAppointmentModalOpen(false)}
        onSuccess={refreshData}
        initialPatientId={initialBookingPatientId}
        initialDoctorId={initialBookingDoctorId}
        onShowToast={showToast}
      />

      {/* 5. Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={cancelModalOpen}
        appointment={selectedAppointment}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={refreshData}
        onShowToast={showToast}
      />

      {/* 6. Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        onClose={() => {
          setPatientDetailsModalOpen(false);
          setSelectedPatient(null);
        }}
        onBookAppointment={(pId) => handleOpenBookAppointment(pId)}
        onDeletePatient={handleDeletePatient}
      />

      {/* 7. Doctor Details Modal */}
      <DoctorDetailsModal
        doctor={selectedDoctor}
        onClose={() => {
          setDoctorDetailsModalOpen(false);
          setSelectedDoctor(null);
        }}
        onBookAppointment={(dId) => handleOpenBookAppointment(undefined, dId)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
