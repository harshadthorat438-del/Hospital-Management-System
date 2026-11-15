#ifndef DATABASE_H
#define DATABASE_H

#include <string>
#include <vector>
#include <memory>
#include <mutex>
#include "sqlite3.h"
#include "models.h"

class Database {
private:
    sqlite3* db;
    std::string dbPath;
    mutable std::mutex dbMutex;

    bool executeSQL(const std::string& sql);

public:
    Database(const std::string& path);
    ~Database();

    bool initialize();
    bool isOpen() const { return db != nullptr; }

    // Patients
    std::vector<Patient> getAllPatients();
    bool getPatientById(int id, Patient& outPatient);
    bool patientExists(int id);
    bool insertPatient(int id, const std::string& name, int age, const std::string& illness, std::string& errorMsg);
    bool deletePatient(int id, std::string& errorMsg);
    int getNextPatientId();

    // Doctors
    std::vector<Doctor> getAllDoctors();
    bool getDoctorById(int id, Doctor& outDoctor);
    bool doctorExists(int id);
    bool insertDoctor(int id, const std::string& name, int age, const std::string& specialization, std::string& errorMsg);
    int getNextDoctorId();

    // Appointments
    std::vector<Appointment> getAllAppointments();
    bool getAppointmentById(int id, Appointment& outAppt);
    bool doctorHasConflict(int doctorId, const std::string& date, const std::string& time, int excludeApptId = -1);
    bool insertAppointment(int id, int patientId, int doctorId, const std::string& date, const std::string& time, std::string& errorMsg);
    bool cancelAppointment(int id, std::string& errorMsg);
    int getNextAppointmentId();

    // Staff Users / Authorization
    bool authenticateUser(const std::string& username, const std::string& password, StaffUser& outUser);
    std::vector<StaffUser> getStaffUsers();

    // Stats
    int getPatientCount();
    int getDoctorCount();
    int getAppointmentCount();
    int getUpcomingAppointmentCount();
};

#endif // DATABASE_H
