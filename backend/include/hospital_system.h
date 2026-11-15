#ifndef HOSPITAL_SYSTEM_H
#define HOSPITAL_SYSTEM_H

#include <vector>
#include <string>
#include <memory>
#include "models.h"
#include "database.h"
#include "json.hpp"

using json = nlohmann::json;

class HospitalManagementSystem {
private:
    std::shared_ptr<Database> db;
    std::vector<Patient> patients;
    std::vector<Doctor> doctors;
    std::vector<Appointment> appointments;

    bool validDateFormat(const std::string& date) const;
    bool validTimeFormat(const std::string& time) const;

public:
    HospitalManagementSystem(std::shared_ptr<Database> database);
    ~HospitalManagementSystem();

    void loadData();

    // Patients
    std::vector<Patient> getPatients() const;
    bool getPatient(int id, Patient& outPatient) const;
    bool registerPatient(int requestedId, const std::string& name, int age,
                         const std::string& illness, Patient& outPatient, std::string& errorMsg);
    bool deletePatient(int id, std::string& errorMsg);

    // Doctors
    std::vector<Doctor> getDoctors() const;
    bool getDoctor(int id, Doctor& outDoctor) const;
    bool addDoctor(int requestedId, const std::string& name, int age,
                   const std::string& specialization, Doctor& outDoctor, std::string& errorMsg);

    // Appointments
    std::vector<Appointment> getAppointments(const std::string& statusFilter = "", const std::string& dateFilter = "") const;
    bool getAppointment(int id, Appointment& outAppt) const;
    bool bookAppointment(int patientId, int doctorId, const std::string& date,
                         const std::string& time, Appointment& outAppt, std::string& errorMsg);
    bool cancelAppointment(int id, std::string& errorMsg);
    std::vector<std::string> getDoctorBookedSlots(int doctorId, const std::string& date) const;

    // Dashboard
    json getDashboardData() const;

    // Staff Authorization
    bool authenticateUser(const std::string& username, const std::string& password, StaffUser& outUser) const;
    std::vector<StaffUser> getStaffUsers() const;
};

#endif // HOSPITAL_SYSTEM_H
