#include <iostream>
#include <string>
#include <vector>
#include <limits>
#include "sqlite3.h"
#include <sstream>
#include <cstdlib>
using namespace std;

// Abstract base class
class Person {
private:
    int id;
    string name;
    int age;

public:
    Person(int personId, string personName, int personAge)
        : id(personId), name(personName), age(personAge) {}

    virtual ~Person() {}

    int getId() const { return id; }
    string getName() const { return name; }
    int getAge() const { return age; }

    virtual void displayDetails() const = 0;
};

// Patient class
class Patient : public Person {
private:
    string illness;

public:
    Patient(int id, string name, int age, string patientIllness)
        : Person(id, name, age), illness(patientIllness) {}

    void displayDetails() const override {
        cout << "Patient ID: " << getId()
             << " | Name: " << getName()
             << " | Age: " << getAge()
             << " | Illness: " << illness << '\n';
    }


    string getIllness() const {
    return illness;
}
};

// Doctor class
class Doctor : public Person {
private:
    string specialization;

public:
    Doctor(int id, string name, int age, string doctorSpecialization)
        : Person(id, name, age), specialization(doctorSpecialization) {}

    void displayDetails() const override {
        cout << "Doctor ID: " << getId()
             << " | Name: " << getName()
             << " | Age: " << getAge()
             << " | Specialization: " << specialization << '\n';
    }

    string getSpecialization() const {
    return specialization;
}
};

// Appointment class
class Appointment {
private:
    int appointmentId;
    int patientId;
    int doctorId;
    string date;
    string time;
    bool cancelled;

public:
    Appointment(int aId, int pId, int dId, string aDate,
            string aTime, bool isCancelledValue = false)
    : appointmentId(aId), patientId(pId), doctorId(dId),
      date(aDate), time(aTime), cancelled(isCancelledValue) {}

    int getAppointmentId() const { return appointmentId; }
    int getPatientId() const { return patientId; }
    int getDoctorId() const { return doctorId; }
    string getDate() const { return date; }
    string getTime() const { return time; }
    bool isCancelled() const { return cancelled; }

    void cancel() { cancelled = true; }

    void displayDetails() const {
        cout << "Appointment ID: " << appointmentId
             << " | Patient ID: " << patientId
             << " | Doctor ID: " << doctorId
             << " | Date: " << date
             << " | Time: " << time
             << " | Status: " << (cancelled ? "Cancelled" : "Booked")
             << '\n';
    }
};

// Hospital Management System
class HospitalManagementSystem {
private:
    vector<Patient> patients;
    vector<Doctor> doctors;
    vector<Appointment> appointments;
    int nextAppointmentId;
    sqlite3* db;

public:
    HospitalManagementSystem() : nextAppointmentId(1), db(NULL) {
        if (sqlite3_open("hospital.db", &db) != SQLITE_OK) {
            cerr << "Could not open database: "
                 << (db ? sqlite3_errmsg(db) : "unknown error") << '\n';
            if (db) sqlite3_close(db);
            db = NULL;
            exit(1);
        }

        if (!initializeDatabase()) {
            if (db) sqlite3_close(db);
            db = NULL;
            exit(1);
        }
        loadData();
    }

    ~HospitalManagementSystem() {
        if (db) sqlite3_close(db);
    }

    void registerPatient() {
        int id, age;
        string name, illness;

        cout << "\nEnter Patient ID: ";
        if (!(cin >> id) || id <= 0) {
            cout << "Invalid patient ID.\n";
            resetInput();
            return;
        }

        if (patientIdExists(id)) {
            cout << "Patient ID already exists!\n";
            return;
        }

        cout << "Enter Patient Name: ";
        cin >> ws;
        getline(cin, name);

        cout << "Enter Patient Age: ";
        if (!(cin >> age) || age <= 0 || age > 120) {
            cout << "Invalid age.\n";
            resetInput();
            return;
        }

        cout << "Enter Illness: ";
        cin >> ws;
        getline(cin, illness);

        patients.push_back(Patient(id, name, age, illness));
        saveData();
        cout << "Patient registered successfully!\n";
    }

    void addDoctor() {
        int id, age;
        string name, specialization;

        cout << "\nEnter Doctor ID: ";
        if (!(cin >> id) || id <= 0) {
            cout << "Invalid doctor ID.\n";
            resetInput();
            return;
        }

        if (doctorIdExists(id)) {
            cout << "Doctor ID already exists!\n";
            return;
        }

        cout << "Enter Doctor Name: ";
        cin >> ws;
        getline(cin, name);

        cout << "Enter Doctor Age: ";
        if (!(cin >> age) || age <= 0 || age > 120) {
            cout << "Invalid age.\n";
            resetInput();
            return;
        }

        cout << "Enter Specialization: ";
        cin >> ws;
        getline(cin, specialization);

        doctors.push_back(Doctor(id, name, age, specialization));
        saveData();
        cout << "Doctor added successfully!\n";
    }

    void viewPatients() const {
        cout << "\n========== PATIENT LIST ==========\n";

        if (patients.empty()) {
            cout << "No patients registered yet.\n";
            return;
        }

        for (size_t i = 0; i < patients.size(); ++i) {
            patients[i].displayDetails();
        }
    }

    void viewDoctors() const {
        cout << "\n========== DOCTOR LIST ==========\n";

        if (doctors.empty()) {
            cout << "No doctors added yet.\n";
            return;
        }

        for (size_t i = 0; i < doctors.size(); ++i) {
            doctors[i].displayDetails();
        }
    }

    void bookAppointment() {
        int patientId, doctorId;
        string date, time;

        if (patients.empty() || doctors.empty()) {
            cout << "\nPlease register at least one patient and add "
                 << "at least one doctor first.\n";
            return;
        }

        cout << "\n========== BOOK APPOINTMENT ==========\n";
        viewPatients();
        cout << "\nEnter Patient ID: ";

        if (!(cin >> patientId)) {
            cout << "Invalid patient ID.\n";
            resetInput();
            return;
        }

        if (!patientIdExists(patientId)) {
            cout << "Patient not found!\n";
            return;
        }

        viewDoctors();
        cout << "\nEnter Doctor ID: ";

        if (!(cin >> doctorId)) {
            cout << "Invalid doctor ID.\n";
            resetInput();
            return;
        }

        if (!doctorIdExists(doctorId)) {
            cout << "Doctor not found!\n";
            return;
        }

        cout << "Enter Date (YYYY-MM-DD): ";
        cin >> date;

        cout << "Enter Time (HH:MM): ";
        cin >> time;

        if (!validDateFormat(date) || !validTimeFormat(time)) {
            cout << "Invalid date or time format.\n";
            cout << "Use YYYY-MM-DD and 24-hour HH:MM format.\n";
            return;
        }

        if (doctorHasAppointment(doctorId, date, time)) {
            cout << "This doctor already has an appointment "
                 << "at that date and time!\n";
            return;
        }

        appointments.push_back(
            Appointment(nextAppointmentId, patientId, doctorId, date, time)
        );

        ++nextAppointmentId;
        saveData();

        cout << "Appointment booked successfully!\nAppointment ID: "
             << nextAppointmentId - 1 << '\n';
    }

    void viewAppointments() const {
        cout << "\n========== APPOINTMENT LIST ==========\n";

        if (appointments.empty()) {
            cout << "No appointments available.\n";
            return;
        }

        for (size_t i = 0; i < appointments.size(); ++i) {
            appointments[i].displayDetails();
        }
    }

    void cancelAppointment() {
        int id;

        cout << "\nEnter Appointment ID to cancel: ";

        if (!(cin >> id)) {
            cout << "Invalid appointment ID.\n";
            resetInput();
            return;
        }

        for (size_t i = 0; i < appointments.size(); ++i) {
            if (appointments[i].getAppointmentId() == id) {
                if (appointments[i].isCancelled()) {
                    cout << "This appointment is already cancelled.\n";
                } else {
                    appointments[i].cancel();
                    saveData();
                    cout << "Appointment cancelled successfully.\n";
                }
                return;
            }
        }

        cout << "Appointment not found.\n";
    }

    void run() {
        int choice = 0;

        do {
            cout << "\n====================================\n";
            cout << "     HOSPITAL MANAGEMENT SYSTEM\n";
            cout << "====================================\n";
            cout << "1. Register Patient\n";
            cout << "2. View Patients\n";
            cout << "3. Add Doctor\n";
            cout << "4. View Doctors\n";
            cout << "5. Book Appointment\n";
            cout << "6. View Appointments\n";
            cout << "7. Cancel Appointment\n";
            cout << "8. Exit\n";
            cout << "Enter your choice: ";

            if (!(cin >> choice)) {
                cout << "Please enter a valid number.\n";
                resetInput();
                continue;
            }

            switch (choice) {
                case 1: registerPatient(); break;
                case 2: viewPatients(); break;
                case 3: addDoctor(); break;
                case 4: viewDoctors(); break;
                case 5: bookAppointment(); break;
                case 6: viewAppointments(); break;
                case 7: cancelAppointment(); break;
                case 8:
                    saveData();
                    cout << "Thank you for using the system!\n";
                    break;
                default:
                    cout << "Invalid choice. Please try again.\n";
            }

        } while (choice != 8);
    }

private:
    bool patientIdExists(int id) const {
        for (size_t i = 0; i < patients.size(); ++i) {
            if (patients[i].getId() == id) return true;
        }
        return false;
    }

    bool doctorIdExists(int id) const {
        for (size_t i = 0; i < doctors.size(); ++i) {
            if (doctors[i].getId() == id) return true;
        }
        return false;
    }

    bool doctorHasAppointment(int doctorId, const string& date,
                              const string& time) const {
        for (size_t i = 0; i < appointments.size(); ++i) {
            const Appointment& a = appointments[i];

            if (a.getDoctorId() == doctorId &&
                a.getDate() == date &&
                a.getTime() == time &&
                !a.isCancelled()) {
                return true;
            }
        }
        return false;
    }

    bool validDateFormat(const string& date) const {
        if (date.length() != 10) return false;
        if (date[4] != '-' || date[7] != '-') return false;

        for (size_t i = 0; i < date.length(); ++i) {
            if (i == 4 || i == 7) continue;
            if (date[i] < '0' || date[i] > '9') return false;
        }

        return true;
    }

    bool validTimeFormat(const string& time) const {
        if (time.length() != 5 || time[2] != ':') return false;

        if (time[0] < '0' || time[0] > '9' ||
            time[1] < '0' || time[1] > '9' ||
            time[3] < '0' || time[3] > '9' ||
            time[4] < '0' || time[4] > '9') {
            return false;
        }

        int hour = (time[0] - '0') * 10 + (time[1] - '0');
        int minute = (time[3] - '0') * 10 + (time[4] - '0');

        return hour >= 0 && hour <= 23 &&
               minute >= 0 && minute <= 59;
    }

    void resetInput() {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    bool executeSQL(const string& sql) const {
        char* errorMessage = NULL;
        int result = sqlite3_exec(db, sql.c_str(), NULL, NULL, &errorMessage);
        if (result != SQLITE_OK) {
            cerr << "Database error: "
                 << (errorMessage ? errorMessage : sqlite3_errmsg(db)) << '\n';
            if (errorMessage) sqlite3_free(errorMessage);
            return false;
        }
        return true;
    }

    bool initializeDatabase() {
        if (!executeSQL("PRAGMA foreign_keys = ON;")) return false;

        const char* schema =
            "CREATE TABLE IF NOT EXISTS patients ("
            "id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER NOT NULL, "
            "illness TEXT NOT NULL);"
            "CREATE TABLE IF NOT EXISTS doctors ("
            "id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER NOT NULL, "
            "specialization TEXT NOT NULL);"
            "CREATE TABLE IF NOT EXISTS appointments ("
            "id INTEGER PRIMARY KEY, patient_id INTEGER NOT NULL, "
            "doctor_id INTEGER NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, "
            "cancelled INTEGER NOT NULL DEFAULT 0, "
            "FOREIGN KEY(patient_id) REFERENCES patients(id), "
            "FOREIGN KEY(doctor_id) REFERENCES doctors(id));";

        return executeSQL(schema);
    }

    // Save records in SQL tables inside hospital.db.
    void saveData() const {
        if (!executeSQL("BEGIN TRANSACTION;")) return;

        bool ok = executeSQL(
            "DELETE FROM appointments; DELETE FROM doctors; DELETE FROM patients;");

        sqlite3_stmt* statement = NULL;

        if (ok && sqlite3_prepare_v2(db,
            "INSERT INTO patients(id, name, age, illness) VALUES(?, ?, ?, ?);",
            -1, &statement, NULL) == SQLITE_OK) {
            for (size_t i = 0; ok && i < patients.size(); ++i) {
                sqlite3_bind_int(statement, 1, patients[i].getId());
                sqlite3_bind_text(statement, 2, patients[i].getName().c_str(), -1, SQLITE_TRANSIENT);
                sqlite3_bind_int(statement, 3, patients[i].getAge());
                sqlite3_bind_text(statement, 4, patients[i].getIllness().c_str(), -1, SQLITE_TRANSIENT);
                if (sqlite3_step(statement) != SQLITE_DONE) ok = false;
                sqlite3_reset(statement);
                sqlite3_clear_bindings(statement);
            }
            sqlite3_finalize(statement);
            statement = NULL;
        } else if (ok) {
            cerr << "Could not prepare patient insert: " << sqlite3_errmsg(db) << '\n';
            ok = false;
        }

        if (ok && sqlite3_prepare_v2(db,
            "INSERT INTO doctors(id, name, age, specialization) VALUES(?, ?, ?, ?);",
            -1, &statement, NULL) == SQLITE_OK) {
            for (size_t i = 0; ok && i < doctors.size(); ++i) {
                sqlite3_bind_int(statement, 1, doctors[i].getId());
                sqlite3_bind_text(statement, 2, doctors[i].getName().c_str(), -1, SQLITE_TRANSIENT);
                sqlite3_bind_int(statement, 3, doctors[i].getAge());
                sqlite3_bind_text(statement, 4, doctors[i].getSpecialization().c_str(), -1, SQLITE_TRANSIENT);
                if (sqlite3_step(statement) != SQLITE_DONE) ok = false;
                sqlite3_reset(statement);
                sqlite3_clear_bindings(statement);
            }
            sqlite3_finalize(statement);
            statement = NULL;
        } else if (ok) {
            cerr << "Could not prepare doctor insert: " << sqlite3_errmsg(db) << '\n';
            ok = false;
        }

        if (ok && sqlite3_prepare_v2(db,
            "INSERT INTO appointments(id, patient_id, doctor_id, date, time, cancelled) "
            "VALUES(?, ?, ?, ?, ?, ?);", -1, &statement, NULL) == SQLITE_OK) {
            for (size_t i = 0; ok && i < appointments.size(); ++i) {
                sqlite3_bind_int(statement, 1, appointments[i].getAppointmentId());
                sqlite3_bind_int(statement, 2, appointments[i].getPatientId());
                sqlite3_bind_int(statement, 3, appointments[i].getDoctorId());
                sqlite3_bind_text(statement, 4, appointments[i].getDate().c_str(), -1, SQLITE_TRANSIENT);
                sqlite3_bind_text(statement, 5, appointments[i].getTime().c_str(), -1, SQLITE_TRANSIENT);
                sqlite3_bind_int(statement, 6, appointments[i].isCancelled() ? 1 : 0);
                if (sqlite3_step(statement) != SQLITE_DONE) ok = false;
                sqlite3_reset(statement);
                sqlite3_clear_bindings(statement);
            }
            sqlite3_finalize(statement);
            statement = NULL;
        } else if (ok) {
            cerr << "Could not prepare appointment insert: " << sqlite3_errmsg(db) << '\n';
            ok = false;
        }

        if (ok) {
            if (!executeSQL("COMMIT;")) {
                executeSQL("ROLLBACK;");
                cerr << "Could not commit database changes.\n";
                return;
            }
            cout << "Records saved to SQL database successfully.\n";
        } else {
            executeSQL("ROLLBACK;");
            cerr << "Could not save records to SQL database.\n";
        }
    }

    // Load all records from SQL tables into the program's vectors.
    void loadData() {
        sqlite3_stmt* statement = NULL;

        if (sqlite3_prepare_v2(db,
            "SELECT id, name, age, illness FROM patients ORDER BY id;",
            -1, &statement, NULL) == SQLITE_OK) {
            while (sqlite3_step(statement) == SQLITE_ROW) {
                int id = sqlite3_column_int(statement, 0);
                const unsigned char* nameValue = sqlite3_column_text(statement, 1);
                int age = sqlite3_column_int(statement, 2);
                const unsigned char* illnessValue = sqlite3_column_text(statement, 3);
                string name = nameValue ? reinterpret_cast<const char*>(nameValue) : "";
                string illness = illnessValue ? reinterpret_cast<const char*>(illnessValue) : "";
                if (id > 0 && age > 0 && age <= 120 && !patientIdExists(id))
                    patients.push_back(Patient(id, name, age, illness));
            }
            sqlite3_finalize(statement);
            statement = NULL;
        } else {
            cerr << "Could not load patients: " << sqlite3_errmsg(db) << '\n';
        }

        if (sqlite3_prepare_v2(db,
            "SELECT id, name, age, specialization FROM doctors ORDER BY id;",
            -1, &statement, NULL) == SQLITE_OK) {
            while (sqlite3_step(statement) == SQLITE_ROW) {
                int id = sqlite3_column_int(statement, 0);
                const unsigned char* nameValue = sqlite3_column_text(statement, 1);
                int age = sqlite3_column_int(statement, 2);
                const unsigned char* specializationValue = sqlite3_column_text(statement, 3);
                string name = nameValue ? reinterpret_cast<const char*>(nameValue) : "";
                string specialization = specializationValue ? reinterpret_cast<const char*>(specializationValue) : "";
                if (id > 0 && age > 0 && age <= 120 && !doctorIdExists(id))
                    doctors.push_back(Doctor(id, name, age, specialization));
            }
            sqlite3_finalize(statement);
            statement = NULL;
        } else {
            cerr << "Could not load doctors: " << sqlite3_errmsg(db) << '\n';
        }

        if (sqlite3_prepare_v2(db,
            "SELECT id, patient_id, doctor_id, date, time, cancelled "
            "FROM appointments ORDER BY id;", -1, &statement, NULL) == SQLITE_OK) {
            while (sqlite3_step(statement) == SQLITE_ROW) {
                int appointmentId = sqlite3_column_int(statement, 0);
                int patientId = sqlite3_column_int(statement, 1);
                int doctorId = sqlite3_column_int(statement, 2);
                const unsigned char* dateValue = sqlite3_column_text(statement, 3);
                const unsigned char* timeValue = sqlite3_column_text(statement, 4);
                bool cancelled = sqlite3_column_int(statement, 5) != 0;
                string date = dateValue ? reinterpret_cast<const char*>(dateValue) : "";
                string time = timeValue ? reinterpret_cast<const char*>(timeValue) : "";

                if (appointmentId > 0 && patientIdExists(patientId) && doctorIdExists(doctorId)) {
                    appointments.push_back(Appointment(
                        appointmentId, patientId, doctorId, date, time, cancelled));
                    if (appointmentId >= nextAppointmentId)
                        nextAppointmentId = appointmentId + 1;
                }
            }
            sqlite3_finalize(statement);
        } else {
            cerr << "Could not load appointments: " << sqlite3_errmsg(db) << '\n';
        }
    }
};

int main() {
    HospitalManagementSystem hospital;
    hospital.run();
    return 0;
}