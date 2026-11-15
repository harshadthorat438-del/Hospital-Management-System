#include "hospital_system.h"
#include <iostream>
#include <algorithm>
#include <regex>

HospitalManagementSystem::HospitalManagementSystem(std::shared_ptr<Database> database)
    : db(database) {
    loadData();
}

HospitalManagementSystem::~HospitalManagementSystem() {}

void HospitalManagementSystem::loadData() {
    if (!db) return;
    patients = db->getAllPatients();
    doctors = db->getAllDoctors();
    appointments = db->getAllAppointments();
}

bool HospitalManagementSystem::validDateFormat(const std::string& date) const {
    if (date.length() != 10) return false;
    if (date[4] != '-' || date[7] != '-') return false;
    for (size_t i = 0; i < date.length(); ++i) {
        if (i == 4 || i == 7) continue;
        if (date[i] < '0' || date[i] > '9') return false;
    }
    int year = std::stoi(date.substr(0, 4));
    int month = std::stoi(date.substr(5, 2));
    int day = std::stoi(date.substr(8, 2));

    if (year < 2020 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
}

bool HospitalManagementSystem::validTimeFormat(const std::string& time) const {
    if (time.length() != 5 || time[2] != ':') return false;
    if (time[0] < '0' || time[0] > '9' ||
        time[1] < '0' || time[1] > '9' ||
        time[3] < '0' || time[3] > '9' ||
        time[4] < '0' || time[4] > '9') {
        return false;
    }
    int hour = (time[0] - '0') * 10 + (time[1] - '0');
    int minute = (time[3] - '0') * 10 + (time[4] - '0');
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

// -------------------------------------------------------------
// Patients
// -------------------------------------------------------------

std::vector<Patient> HospitalManagementSystem::getPatients() const {
    if (db) return db->getAllPatients();
    return patients;
}

bool HospitalManagementSystem::getPatient(int id, Patient& outPatient) const {
    if (db) return db->getPatientById(id, outPatient);
    for (const auto& p : patients) {
        if (p.getId() == id) {
            outPatient = p;
            return true;
        }
    }
    return false;
}

bool HospitalManagementSystem::registerPatient(int requestedId, const std::string& name, int age,
                                              const std::string& illness, Patient& outPatient, std::string& errorMsg) {
    if (name.empty()) {
        errorMsg = "Patient name cannot be empty.";
        return false;
    }
    if (age <= 0 || age > 120) {
        errorMsg = "Invalid age. Age must be between 1 and 120.";
        return false;
    }
    if (illness.empty()) {
        errorMsg = "Illness or reason for visit cannot be empty.";
        return false;
    }

    int id = requestedId;
    if (id <= 0) {
        id = db ? db->getNextPatientId() : 1;
    } else {
        if (db && db->patientExists(id)) {
            errorMsg = "Patient ID " + std::to_string(id) + " already exists.";
            return false;
        }
    }

    if (!db->insertPatient(id, name, age, illness, errorMsg)) {
        return false;
    }

    outPatient = Patient(id, name, age, illness);
    patients.push_back(outPatient);
    return true;
}

bool HospitalManagementSystem::deletePatient(int id, std::string& errorMsg) {
    if (!db) {
        errorMsg = "Database not initialized.";
        return false;
    }
    if (!db->deletePatient(id, errorMsg)) {
        return false;
    }
    loadData();
    return true;
}

// -------------------------------------------------------------
// Doctors
// -------------------------------------------------------------

std::vector<Doctor> HospitalManagementSystem::getDoctors() const {
    if (db) return db->getAllDoctors();
    return doctors;
}

bool HospitalManagementSystem::getDoctor(int id, Doctor& outDoctor) const {
    if (db) return db->getDoctorById(id, outDoctor);
    for (const auto& d : doctors) {
        if (d.getId() == id) {
            outDoctor = d;
            return true;
        }
    }
    return false;
}

bool HospitalManagementSystem::addDoctor(int requestedId, const std::string& name, int age,
                                        const std::string& specialization, Doctor& outDoctor, std::string& errorMsg) {
    if (name.empty()) {
        errorMsg = "Doctor name cannot be empty.";
        return false;
    }
    if (age <= 20 || age > 100) {
        errorMsg = "Invalid doctor age. Must be a licensed practitioner between 21 and 100.";
        return false;
    }
    if (specialization.empty()) {
        errorMsg = "Specialization cannot be empty.";
        return false;
    }

    int id = requestedId;
    if (id <= 0) {
        id = db ? db->getNextDoctorId() : 101;
    } else {
        if (db && db->doctorExists(id)) {
            errorMsg = "Doctor ID " + std::to_string(id) + " already exists.";
            return false;
        }
    }

    if (!db->insertDoctor(id, name, age, specialization, errorMsg)) {
        return false;
    }

    outDoctor = Doctor(id, name, age, specialization);
    doctors.push_back(outDoctor);
    return true;
}

// -------------------------------------------------------------
// Appointments
// -------------------------------------------------------------

std::vector<Appointment> HospitalManagementSystem::getAppointments(const std::string& statusFilter, const std::string& dateFilter) const {
    std::vector<Appointment> all = db ? db->getAllAppointments() : appointments;
    if (statusFilter.empty() && dateFilter.empty()) {
        return all;
    }

    std::vector<Appointment> filtered;
    for (const auto& a : all) {
        if (!statusFilter.empty()) {
            if (statusFilter == "scheduled" && a.isCancelled()) continue;
            if (statusFilter == "cancelled" && !a.isCancelled()) continue;
        }
        if (!dateFilter.empty() && a.getDate() != dateFilter) {
            continue;
        }
        filtered.push_back(a);
    }
    return filtered;
}

bool HospitalManagementSystem::getAppointment(int id, Appointment& outAppt) const {
    if (db) return db->getAppointmentById(id, outAppt);
    for (const auto& a : appointments) {
        if (a.getAppointmentId() == id) {
            outAppt = a;
            return true;
        }
    }
    return false;
}

bool HospitalManagementSystem::bookAppointment(int patientId, int doctorId, const std::string& date,
                                              const std::string& time, Appointment& outAppt, std::string& errorMsg) {
    // 1. Verify Patient exists
    Patient patient(0, "", 0, "");
    if (!getPatient(patientId, patient)) {
        errorMsg = "Selected patient (ID: " + std::to_string(patientId) + ") does not exist.";
        return false;
    }

    // 2. Verify Doctor exists
    Doctor doctor(0, "", 0, "");
    if (!getDoctor(doctorId, doctor)) {
        errorMsg = "Selected doctor (ID: " + std::to_string(doctorId) + ") does not exist.";
        return false;
    }

    // 3. Format validation
    if (!validDateFormat(date)) {
        errorMsg = "Invalid date format. Expected YYYY-MM-DD.";
        return false;
    }
    if (!validTimeFormat(time)) {
        errorMsg = "Invalid time format. Expected 24-hour format HH:MM (e.g. 09:30 or 14:00).";
        return false;
    }

    // 4. Conflict detection: check if doctor has conflicting active appointment
    if (db->doctorHasConflict(doctorId, date, time)) {
        errorMsg = "Doctor " + doctor.getName() + " already has an active appointment scheduled on " +
                   date + " at " + time + ". Please select another time slot.";
        return false;
    }

    // 5. Generate next ID and persist
    int nextId = db->getNextAppointmentId();
    if (!db->insertAppointment(nextId, patientId, doctorId, date, time, errorMsg)) {
        return false;
    }

    outAppt = Appointment(nextId, patientId, doctorId, date, time, false,
                          patient.getName(), doctor.getName(), doctor.getSpecialization());
    appointments.push_back(outAppt);
    return true;
}

bool HospitalManagementSystem::cancelAppointment(int id, std::string& errorMsg) {
    if (!db) {
        errorMsg = "Database not initialized.";
        return false;
    }

    if (!db->cancelAppointment(id, errorMsg)) {
        return false;
    }

    loadData();
    return true;
}

std::vector<std::string> HospitalManagementSystem::getDoctorBookedSlots(int doctorId, const std::string& date) const {
    std::vector<std::string> bookedTimes;
    std::vector<Appointment> all = db ? db->getAllAppointments() : appointments;
    for (const auto& a : all) {
        if (a.getDoctorId() == doctorId && a.getDate() == date && !a.isCancelled()) {
            bookedTimes.push_back(a.getTime());
        }
    }
    return bookedTimes;
}

// -------------------------------------------------------------
// Dashboard Data
// -------------------------------------------------------------

json HospitalManagementSystem::getDashboardData() const {
    int totalPatients = db ? db->getPatientCount() : static_cast<int>(patients.size());
    int totalDoctors = db ? db->getDoctorCount() : static_cast<int>(doctors.size());
    int totalAppointments = db ? db->getAppointmentCount() : static_cast<int>(appointments.size());
    int upcomingAppointments = db ? db->getUpcomingAppointmentCount() : 0;

    std::vector<Appointment> allAppts = db ? db->getAllAppointments() : appointments;
    json recentList = json::array();

    // Take top 5 most recent appointments
    int limit = 5;
    for (size_t i = 0; i < allAppts.size() && static_cast<int>(i) < limit; ++i) {
        recentList.push_back(allAppts[i].toJson());
    }

    return json{
        {"stats", {
            {"total_patients", totalPatients},
            {"total_doctors", totalDoctors},
            {"total_appointments", totalAppointments},
            {"upcoming_appointments", upcomingAppointments}
        }},
        {"recent_appointments", recentList}
    };
}

// -------------------------------------------------------------
// Staff Authorization
// -------------------------------------------------------------

bool HospitalManagementSystem::authenticateUser(const std::string& username, const std::string& password, StaffUser& outUser) const {
    if (!db) return false;
    return db->authenticateUser(username, password, outUser);
}

std::vector<StaffUser> HospitalManagementSystem::getStaffUsers() const {
    if (!db) return {};
    return db->getStaffUsers();
}
