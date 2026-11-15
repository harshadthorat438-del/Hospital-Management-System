#include "database.h"
#include <iostream>
#include <sstream>
#include <ctime>

Database::Database(const std::string& path) : db(nullptr), dbPath(path) {
    int rc = sqlite3_open(dbPath.c_str(), &db);
    if (rc != SQLITE_OK) {
        std::cerr << "Failed to open SQLite database at " << dbPath << ": "
                  << (db ? sqlite3_errmsg(db) : "Unknown error") << std::endl;
        if (db) {
            sqlite3_close(db);
            db = nullptr;
        }
    }
}

Database::~Database() {
    if (db) {
        sqlite3_close(db);
        db = nullptr;
    }
}

bool Database::executeSQL(const std::string& sql) {
    if (!db) return false;
    char* errMsg = nullptr;
    int rc = sqlite3_exec(db, sql.c_str(), nullptr, nullptr, &errMsg);
    if (rc != SQLITE_OK) {
        std::cerr << "Database execute error: " << (errMsg ? errMsg : sqlite3_errmsg(db)) << std::endl;
        if (errMsg) sqlite3_free(errMsg);
        return false;
    }
    return true;
}

bool Database::initialize() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    if (!executeSQL("PRAGMA foreign_keys = ON;")) return false;

    const char* schema =
        "CREATE TABLE IF NOT EXISTS patients ("
        "  id INTEGER PRIMARY KEY,"
        "  name TEXT NOT NULL,"
        "  age INTEGER NOT NULL,"
        "  illness TEXT NOT NULL"
        ");"
        "CREATE TABLE IF NOT EXISTS doctors ("
        "  id INTEGER PRIMARY KEY,"
        "  name TEXT NOT NULL,"
        "  age INTEGER NOT NULL,"
        "  specialization TEXT NOT NULL"
        ");"
        "CREATE TABLE IF NOT EXISTS appointments ("
        "  id INTEGER PRIMARY KEY,"
        "  patient_id INTEGER NOT NULL,"
        "  doctor_id INTEGER NOT NULL,"
        "  date TEXT NOT NULL,"
        "  time TEXT NOT NULL,"
        "  cancelled INTEGER NOT NULL DEFAULT 0,"
        "  FOREIGN KEY(patient_id) REFERENCES patients(id),"
        "  FOREIGN KEY(doctor_id) REFERENCES doctors(id)"
        ");"
        "CREATE TABLE IF NOT EXISTS staff_users ("
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  username TEXT UNIQUE NOT NULL,"
        "  password TEXT NOT NULL,"
        "  full_name TEXT NOT NULL,"
        "  role TEXT NOT NULL,"
        "  department TEXT NOT NULL"
        ");";

    if (!executeSQL(schema)) return false;

    // Seed default staff accounts for dashboard & registration authorization if table is empty
    sqlite3_stmt* checkStmt = nullptr;
    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM staff_users;", -1, &checkStmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(checkStmt) == SQLITE_ROW) {
            int count = sqlite3_column_int(checkStmt, 0);
            sqlite3_finalize(checkStmt);
            if (count == 0) {
                executeSQL(
                    "INSERT INTO staff_users (username, password, full_name, role, department) VALUES "
                    "('admin', 'admin123', 'Dr. Sunita Deshmukh', 'Administrator', 'Executive Administration'),"
                    "('reception', 'recep123', 'Kavita Verma', 'Receptionist', 'Patient Admissions & Booking'),"
                    "('doctor', 'doc123', 'Dr. Rajesh Sharma', 'Physician', 'Cardiology & Internal Medicine');"
                );
            }
        } else {
            sqlite3_finalize(checkStmt);
        }
    }

    // Check if doctors table has records. If not, seed a few standard doctors so system is ready to use immediately
    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM doctors;", -1, &checkStmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(checkStmt) == SQLITE_ROW) {
            int docCount = sqlite3_column_int(checkStmt, 0);
            sqlite3_finalize(checkStmt);
            if (docCount == 0) {
                executeSQL(
                    "INSERT INTO doctors (id, name, age, specialization) VALUES "
                    "(101, 'Dr. Ananya Iyer', 42, 'General Pediatrics & Child Health'),"
                    "(102, 'Dr. Rajesh Sharma', 48, 'Cardiology & Vascular Medicine'),"
                    "(103, 'Dr. Vikramaditya Kulkarni', 41, 'Orthopedics & Joint Replacement'),"
                    "(104, 'Dr. Priya Nair', 45, 'Neurology & Cognitive Health'),"
                    "(105, 'Dr. Arvind Swaminathan', 39, 'Internal Medicine & Diabetology');"
                );
            }
        } else {
            sqlite3_finalize(checkStmt);
        }
    }

    return true;
}

// -------------------------------------------------------------
// Patients
// -------------------------------------------------------------

std::vector<Patient> Database::getAllPatients() {
    std::lock_guard<std::mutex> lock(dbMutex);
    std::vector<Patient> list;
    if (!db) return list;

    const char* sql = "SELECT id, name, age, illness FROM patients ORDER BY id ASC;";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int id = sqlite3_column_int(stmt, 0);
            const unsigned char* nameTxt = sqlite3_column_text(stmt, 1);
            int age = sqlite3_column_int(stmt, 2);
            const unsigned char* illnessTxt = sqlite3_column_text(stmt, 3);

            std::string name = nameTxt ? reinterpret_cast<const char*>(nameTxt) : "";
            std::string illness = illnessTxt ? reinterpret_cast<const char*>(illnessTxt) : "";

            list.push_back(Patient(id, name, age, illness));
        }
        sqlite3_finalize(stmt);
    }
    return list;
}

bool Database::getPatientById(int id, Patient& outPatient) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql = "SELECT id, name, age, illness FROM patients WHERE id = ?;";
    sqlite3_stmt* stmt = nullptr;
    bool found = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, id);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            int pId = sqlite3_column_int(stmt, 0);
            const unsigned char* nameTxt = sqlite3_column_text(stmt, 1);
            int age = sqlite3_column_int(stmt, 2);
            const unsigned char* illnessTxt = sqlite3_column_text(stmt, 3);

            std::string name = nameTxt ? reinterpret_cast<const char*>(nameTxt) : "";
            std::string illness = illnessTxt ? reinterpret_cast<const char*>(illnessTxt) : "";

            outPatient = Patient(pId, name, age, illness);
            found = true;
        }
        sqlite3_finalize(stmt);
    }
    return found;
}

bool Database::patientExists(int id) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql = "SELECT 1 FROM patients WHERE id = ? LIMIT 1;";
    sqlite3_stmt* stmt = nullptr;
    bool exists = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, id);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            exists = true;
        }
        sqlite3_finalize(stmt);
    }
    return exists;
}

bool Database::insertPatient(int id, const std::string& name, int age, const std::string& illness, std::string& errorMsg) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) {
        errorMsg = "Database not open";
        return false;
    }

    const char* sql = "INSERT INTO patients (id, name, age, illness) VALUES (?, ?, ?, ?);";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }

    sqlite3_bind_int(stmt, 1, id);
    sqlite3_bind_text(stmt, 2, name.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 3, age);
    sqlite3_bind_text(stmt, 4, illness.c_str(), -1, SQLITE_TRANSIENT);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (rc != SQLITE_DONE) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }
    return true;
}

bool Database::deletePatient(int id, std::string& errorMsg) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) {
        errorMsg = "Database not open";
        return false;
    }

    // Check if patient has any appointments
    const char* checkSql = "SELECT COUNT(*) FROM appointments WHERE patient_id = ?;";
    sqlite3_stmt* checkStmt = nullptr;
    if (sqlite3_prepare_v2(db, checkSql, -1, &checkStmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(checkStmt, 1, id);
        if (sqlite3_step(checkStmt) == SQLITE_ROW) {
            int count = sqlite3_column_int(checkStmt, 0);
            if (count > 0) {
                sqlite3_finalize(checkStmt);
                errorMsg = "Cannot delete patient with existing appointment records";
                return false;
            }
        }
        sqlite3_finalize(checkStmt);
    }

    const char* sql = "DELETE FROM patients WHERE id = ?;";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }

    sqlite3_bind_int(stmt, 1, id);
    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (rc != SQLITE_DONE) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }
    return true;
}

int Database::getNextPatientId() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 1;

    const char* sql = "SELECT COALESCE(MAX(id), 0) + 1 FROM patients;";
    sqlite3_stmt* stmt = nullptr;
    int nextId = 1;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            nextId = sqlite3_column_int(stmt, 0);
        }
        sqlite3_finalize(stmt);
    }
    return nextId;
}

// -------------------------------------------------------------
// Doctors
// -------------------------------------------------------------

std::vector<Doctor> Database::getAllDoctors() {
    std::lock_guard<std::mutex> lock(dbMutex);
    std::vector<Doctor> list;
    if (!db) return list;

    const char* sql = "SELECT id, name, age, specialization FROM doctors ORDER BY id ASC;";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int id = sqlite3_column_int(stmt, 0);
            const unsigned char* nameTxt = sqlite3_column_text(stmt, 1);
            int age = sqlite3_column_int(stmt, 2);
            const unsigned char* specTxt = sqlite3_column_text(stmt, 3);

            std::string name = nameTxt ? reinterpret_cast<const char*>(nameTxt) : "";
            std::string spec = specTxt ? reinterpret_cast<const char*>(specTxt) : "";

            list.push_back(Doctor(id, name, age, spec));
        }
        sqlite3_finalize(stmt);
    }
    return list;
}

bool Database::getDoctorById(int id, Doctor& outDoctor) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql = "SELECT id, name, age, specialization FROM doctors WHERE id = ?;";
    sqlite3_stmt* stmt = nullptr;
    bool found = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, id);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            int dId = sqlite3_column_int(stmt, 0);
            const unsigned char* nameTxt = sqlite3_column_text(stmt, 1);
            int age = sqlite3_column_int(stmt, 2);
            const unsigned char* specTxt = sqlite3_column_text(stmt, 3);

            std::string name = nameTxt ? reinterpret_cast<const char*>(nameTxt) : "";
            std::string spec = specTxt ? reinterpret_cast<const char*>(specTxt) : "";

            outDoctor = Doctor(dId, name, age, spec);
            found = true;
        }
        sqlite3_finalize(stmt);
    }
    return found;
}

bool Database::doctorExists(int id) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql = "SELECT 1 FROM doctors WHERE id = ? LIMIT 1;";
    sqlite3_stmt* stmt = nullptr;
    bool exists = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, id);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            exists = true;
        }
        sqlite3_finalize(stmt);
    }
    return exists;
}

bool Database::insertDoctor(int id, const std::string& name, int age, const std::string& specialization, std::string& errorMsg) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) {
        errorMsg = "Database not open";
        return false;
    }

    const char* sql = "INSERT INTO doctors (id, name, age, specialization) VALUES (?, ?, ?, ?);";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }

    sqlite3_bind_int(stmt, 1, id);
    sqlite3_bind_text(stmt, 2, name.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 3, age);
    sqlite3_bind_text(stmt, 4, specialization.c_str(), -1, SQLITE_TRANSIENT);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (rc != SQLITE_DONE) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }
    return true;
}

int Database::getNextDoctorId() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 101;

    const char* sql = "SELECT COALESCE(MAX(id), 100) + 1 FROM doctors;";
    sqlite3_stmt* stmt = nullptr;
    int nextId = 101;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            nextId = sqlite3_column_int(stmt, 0);
        }
        sqlite3_finalize(stmt);
    }
    return nextId;
}

// -------------------------------------------------------------
// Appointments
// -------------------------------------------------------------

std::vector<Appointment> Database::getAllAppointments() {
    std::lock_guard<std::mutex> lock(dbMutex);
    std::vector<Appointment> list;
    if (!db) return list;

    const char* sql =
        "SELECT a.id, a.patient_id, a.doctor_id, a.date, a.time, a.cancelled, "
        "       COALESCE(p.name, 'Unknown Patient') AS patient_name, "
        "       COALESCE(d.name, 'Unknown Doctor') AS doctor_name, "
        "       COALESCE(d.specialization, 'General') AS specialization "
        "FROM appointments a "
        "LEFT JOIN patients p ON a.patient_id = p.id "
        "LEFT JOIN doctors d ON a.doctor_id = d.id "
        "ORDER BY a.date DESC, a.time DESC;";

    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int aId = sqlite3_column_int(stmt, 0);
            int pId = sqlite3_column_int(stmt, 1);
            int dId = sqlite3_column_int(stmt, 2);
            const unsigned char* dTxt = sqlite3_column_text(stmt, 3);
            const unsigned char* tTxt = sqlite3_column_text(stmt, 4);
            int cancelled = sqlite3_column_int(stmt, 5);
            const unsigned char* pNameTxt = sqlite3_column_text(stmt, 6);
            const unsigned char* dNameTxt = sqlite3_column_text(stmt, 7);
            const unsigned char* specTxt = sqlite3_column_text(stmt, 8);

            std::string date = dTxt ? reinterpret_cast<const char*>(dTxt) : "";
            std::string time = tTxt ? reinterpret_cast<const char*>(tTxt) : "";
            std::string pName = pNameTxt ? reinterpret_cast<const char*>(pNameTxt) : "";
            std::string dName = dNameTxt ? reinterpret_cast<const char*>(dNameTxt) : "";
            std::string spec = specTxt ? reinterpret_cast<const char*>(specTxt) : "";

            list.push_back(Appointment(aId, pId, dId, date, time, cancelled != 0, pName, dName, spec));
        }
        sqlite3_finalize(stmt);
    }
    return list;
}

bool Database::getAppointmentById(int id, Appointment& outAppt) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql =
        "SELECT a.id, a.patient_id, a.doctor_id, a.date, a.time, a.cancelled, "
        "       COALESCE(p.name, 'Unknown Patient') AS patient_name, "
        "       COALESCE(d.name, 'Unknown Doctor') AS doctor_name, "
        "       COALESCE(d.specialization, 'General') AS specialization "
        "FROM appointments a "
        "LEFT JOIN patients p ON a.patient_id = p.id "
        "LEFT JOIN doctors d ON a.doctor_id = d.id "
        "WHERE a.id = ?;";

    sqlite3_stmt* stmt = nullptr;
    bool found = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, id);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            int aId = sqlite3_column_int(stmt, 0);
            int pId = sqlite3_column_int(stmt, 1);
            int dId = sqlite3_column_int(stmt, 2);
            const unsigned char* dTxt = sqlite3_column_text(stmt, 3);
            const unsigned char* tTxt = sqlite3_column_text(stmt, 4);
            int cancelled = sqlite3_column_int(stmt, 5);
            const unsigned char* pNameTxt = sqlite3_column_text(stmt, 6);
            const unsigned char* dNameTxt = sqlite3_column_text(stmt, 7);
            const unsigned char* specTxt = sqlite3_column_text(stmt, 8);

            std::string date = dTxt ? reinterpret_cast<const char*>(dTxt) : "";
            std::string time = tTxt ? reinterpret_cast<const char*>(tTxt) : "";
            std::string pName = pNameTxt ? reinterpret_cast<const char*>(pNameTxt) : "";
            std::string dName = dNameTxt ? reinterpret_cast<const char*>(dNameTxt) : "";
            std::string spec = specTxt ? reinterpret_cast<const char*>(specTxt) : "";

            outAppt = Appointment(aId, pId, dId, date, time, cancelled != 0, pName, dName, spec);
            found = true;
        }
        sqlite3_finalize(stmt);
    }
    return found;
}

bool Database::doctorHasConflict(int doctorId, const std::string& date, const std::string& time, int excludeApptId) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql =
        "SELECT COUNT(*) FROM appointments "
        "WHERE doctor_id = ? AND date = ? AND time = ? AND cancelled = 0 AND id != ?;";

    sqlite3_stmt* stmt = nullptr;
    bool conflict = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, doctorId);
        sqlite3_bind_text(stmt, 2, date.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, time.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int(stmt, 4, excludeApptId);

        if (sqlite3_step(stmt) == SQLITE_ROW) {
            conflict = sqlite3_column_int(stmt, 0) > 0;
        }
        sqlite3_finalize(stmt);
    }
    return conflict;
}

bool Database::insertAppointment(int id, int patientId, int doctorId, const std::string& date, const std::string& time, std::string& errorMsg) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) {
        errorMsg = "Database not open";
        return false;
    }

    const char* sql = "INSERT INTO appointments (id, patient_id, doctor_id, date, time, cancelled) VALUES (?, ?, ?, ?, ?, 0);";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }

    sqlite3_bind_int(stmt, 1, id);
    sqlite3_bind_int(stmt, 2, patientId);
    sqlite3_bind_int(stmt, 3, doctorId);
    sqlite3_bind_text(stmt, 4, date.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, time.c_str(), -1, SQLITE_TRANSIENT);

    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (rc != SQLITE_DONE) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }
    return true;
}

bool Database::cancelAppointment(int id, std::string& errorMsg) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) {
        errorMsg = "Database not open";
        return false;
    }

    // Check current state
    const char* checkSql = "SELECT cancelled FROM appointments WHERE id = ?;";
    sqlite3_stmt* checkStmt = nullptr;
    if (sqlite3_prepare_v2(db, checkSql, -1, &checkStmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(checkStmt, 1, id);
        if (sqlite3_step(checkStmt) == SQLITE_ROW) {
            int cancelled = sqlite3_column_int(checkStmt, 0);
            if (cancelled == 1) {
                sqlite3_finalize(checkStmt);
                errorMsg = "Appointment is already cancelled.";
                return false;
            }
        } else {
            sqlite3_finalize(checkStmt);
            errorMsg = "Appointment not found.";
            return false;
        }
        sqlite3_finalize(checkStmt);
    }

    const char* sql = "UPDATE appointments SET cancelled = 1 WHERE id = ?;";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }

    sqlite3_bind_int(stmt, 1, id);
    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (rc != SQLITE_DONE) {
        errorMsg = sqlite3_errmsg(db);
        return false;
    }
    return true;
}

int Database::getNextAppointmentId() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 1;

    const char* sql = "SELECT COALESCE(MAX(id), 0) + 1 FROM appointments;";
    sqlite3_stmt* stmt = nullptr;
    int nextId = 1;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            nextId = sqlite3_column_int(stmt, 0);
        }
        sqlite3_finalize(stmt);
    }
    return nextId;
}

// -------------------------------------------------------------
// Staff Authorization
// -------------------------------------------------------------

bool Database::authenticateUser(const std::string& username, const std::string& password, StaffUser& outUser) {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return false;

    const char* sql = "SELECT id, username, full_name, role, department FROM staff_users WHERE username = ? AND password = ?;";
    sqlite3_stmt* stmt = nullptr;
    bool auth = false;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 2, password.c_str(), -1, SQLITE_TRANSIENT);

        if (sqlite3_step(stmt) == SQLITE_ROW) {
            outUser.id = sqlite3_column_int(stmt, 0);
            const unsigned char* uTxt = sqlite3_column_text(stmt, 1);
            const unsigned char* fTxt = sqlite3_column_text(stmt, 2);
            const unsigned char* rTxt = sqlite3_column_text(stmt, 3);
            const unsigned char* dTxt = sqlite3_column_text(stmt, 4);

            outUser.username = uTxt ? reinterpret_cast<const char*>(uTxt) : "";
            outUser.fullName = fTxt ? reinterpret_cast<const char*>(fTxt) : "";
            outUser.role = rTxt ? reinterpret_cast<const char*>(rTxt) : "";
            outUser.department = dTxt ? reinterpret_cast<const char*>(dTxt) : "";
            auth = true;
        }
        sqlite3_finalize(stmt);
    }
    return auth;
}

std::vector<StaffUser> Database::getStaffUsers() {
    std::lock_guard<std::mutex> lock(dbMutex);
    std::vector<StaffUser> list;
    if (!db) return list;

    const char* sql = "SELECT id, username, full_name, role, department FROM staff_users ORDER BY id ASC;";
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            StaffUser u;
            u.id = sqlite3_column_int(stmt, 0);
            const unsigned char* uTxt = sqlite3_column_text(stmt, 1);
            const unsigned char* fTxt = sqlite3_column_text(stmt, 2);
            const unsigned char* rTxt = sqlite3_column_text(stmt, 3);
            const unsigned char* dTxt = sqlite3_column_text(stmt, 4);

            u.username = uTxt ? reinterpret_cast<const char*>(uTxt) : "";
            u.fullName = fTxt ? reinterpret_cast<const char*>(fTxt) : "";
            u.role = rTxt ? reinterpret_cast<const char*>(rTxt) : "";
            u.department = dTxt ? reinterpret_cast<const char*>(dTxt) : "";
            list.push_back(u);
        }
        sqlite3_finalize(stmt);
    }
    return list;
}

// -------------------------------------------------------------
// Dashboard Statistics
// -------------------------------------------------------------

int Database::getPatientCount() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 0;
    sqlite3_stmt* stmt = nullptr;
    int count = 0;
    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM patients;", -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) count = sqlite3_column_int(stmt, 0);
        sqlite3_finalize(stmt);
    }
    return count;
}

int Database::getDoctorCount() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 0;
    sqlite3_stmt* stmt = nullptr;
    int count = 0;
    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM doctors;", -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) count = sqlite3_column_int(stmt, 0);
        sqlite3_finalize(stmt);
    }
    return count;
}

int Database::getAppointmentCount() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 0;
    sqlite3_stmt* stmt = nullptr;
    int count = 0;
    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM appointments;", -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) count = sqlite3_column_int(stmt, 0);
        sqlite3_finalize(stmt);
    }
    return count;
}

int Database::getUpcomingAppointmentCount() {
    std::lock_guard<std::mutex> lock(dbMutex);
    if (!db) return 0;
    sqlite3_stmt* stmt = nullptr;
    int count = 0;
    // Appointments that are not cancelled
    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM appointments WHERE cancelled = 0;", -1, &stmt, nullptr) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW) count = sqlite3_column_int(stmt, 0);
        sqlite3_finalize(stmt);
    }
    return count;
}
