#ifndef MODELS_H
#define MODELS_H

#include <string>
#include <vector>
#include <iostream>
#include "json.hpp"

using json = nlohmann::json;

// Abstract Base Class: Person
class Person {
protected:
    int id;
    std::string name;
    int age;

public:
    Person(int personId, const std::string& personName, int personAge)
        : id(personId), name(personName), age(personAge) {}

    virtual ~Person() {}

    int getId() const { return id; }
    std::string getName() const { return name; }
    int getAge() const { return age; }

    virtual void displayDetails() const = 0;
    virtual json toJson() const = 0;
};

// Derived Class: Patient
class Patient : public Person {
private:
    std::string illness;

public:
    Patient(int id, const std::string& name, int age, const std::string& patientIllness)
        : Person(id, name, age), illness(patientIllness) {}

    std::string getIllness() const { return illness; }

    void displayDetails() const override {
        std::cout << "Patient ID: " << getId()
                  << " | Name: " << getName()
                  << " | Age: " << getAge()
                  << " | Illness: " << illness << '\n';
    }

    json toJson() const override {
        return json{
            {"id", id},
            {"patient_id", id},
            {"name", name},
            {"age", age},
            {"illness", illness}
        };
    }
};

// Derived Class: Doctor
class Doctor : public Person {
private:
    std::string specialization;

public:
    Doctor(int id, const std::string& name, int age, const std::string& doctorSpecialization)
        : Person(id, name, age), specialization(doctorSpecialization) {}

    std::string getSpecialization() const { return specialization; }

    void displayDetails() const override {
        std::cout << "Doctor ID: " << getId()
                  << " | Name: " << getName()
                  << " | Age: " << getAge()
                  << " | Specialization: " << specialization << '\n';
    }

    json toJson() const override {
        return json{
            {"id", id},
            {"doctor_id", id},
            {"name", name},
            {"age", age},
            {"specialization", specialization}
        };
    }
};

// Appointment Class
class Appointment {
private:
    int appointmentId;
    int patientId;
    int doctorId;
    std::string date;
    std::string time;
    bool cancelled;
    std::string patientName;
    std::string doctorName;
    std::string specialization;

public:
    Appointment(int aId, int pId, int dId, const std::string& aDate,
                const std::string& aTime, bool isCancelledValue = false,
                const std::string& pName = "", const std::string& dName = "",
                const std::string& spec = "")
        : appointmentId(aId), patientId(pId), doctorId(dId),
          date(aDate), time(aTime), cancelled(isCancelledValue),
          patientName(pName), doctorName(dName), specialization(spec) {}

    int getAppointmentId() const { return appointmentId; }
    int getPatientId() const { return patientId; }
    int getDoctorId() const { return doctorId; }
    std::string getDate() const { return date; }
    std::string getTime() const { return time; }
    bool isCancelled() const { return cancelled; }

    std::string getPatientName() const { return patientName; }
    std::string getDoctorName() const { return doctorName; }
    std::string getSpecialization() const { return specialization; }

    void setPatientName(const std::string& name) { patientName = name; }
    void setDoctorName(const std::string& name) { doctorName = name; }
    void setSpecialization(const std::string& spec) { specialization = spec; }

    void cancel() { cancelled = true; }

    void displayDetails() const {
        std::cout << "Appointment ID: " << appointmentId
                  << " | Patient ID: " << patientId
                  << " | Doctor ID: " << doctorId
                  << " | Date: " << date
                  << " | Time: " << time
                  << " | Status: " << (cancelled ? "Cancelled" : "Booked")
                  << '\n';
    }

    json toJson() const {
        return json{
            {"id", appointmentId},
            {"appointment_id", appointmentId},
            {"patient_id", patientId},
            {"patient_name", patientName.empty() ? ("Patient #" + std::to_string(patientId)) : patientName},
            {"doctor_id", doctorId},
            {"doctor_name", doctorName.empty() ? ("Dr. #" + std::to_string(doctorId)) : doctorName},
            {"specialization", specialization},
            {"appointment_date", date},
            {"date", date},
            {"appointment_time", time},
            {"time", time},
            {"status", cancelled ? "Cancelled" : "Scheduled"},
            {"cancelled", cancelled}
        };
    }
};

// Staff / Admin User Model for Dashboard & Registration Authorization
struct StaffUser {
    int id;
    std::string username;
    std::string fullName;
    std::string role; // "Administrator", "Receptionist", "Doctor"
    std::string department;

    json toJson() const {
        return json{
            {"id", id},
            {"username", username},
            {"full_name", fullName},
            {"role", role},
            {"department", department},
            {"is_authorized", true}
        };
    }
};

#endif // MODELS_H
