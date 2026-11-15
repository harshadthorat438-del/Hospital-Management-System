#include <iostream>
#include <memory>
#include <string>
#include <cstdlib>
#include "httplib.h"
#include "json.hpp"
#include "database.h"
#include "hospital_system.h"

using json = nlohmann::json;

// Helper to set standard JSON and CORS headers
void setResponseHeaders(httplib::Response& res, const std::string& contentType = "application/json") {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.set_header("Content-Type", contentType);
}

int main(int argc, char* argv[]) {
    int port = 8080;
    if (argc > 1) {
        port = std::atoi(argv[1]);
        if (port <= 0) port = 8080;
    }

    std::string dbPath = "../database/hospital.db";
    // Check if running from root or backend directory
    std::ifstream testFile(dbPath);
    if (!testFile.good()) {
        dbPath = "database/hospital.db";
        std::ifstream testFile2(dbPath);
        if (!testFile2.good()) {
            dbPath = "hospital.db";
        }
    }

    std::cout << "========================================================\n";
    std::cout << "  EVERGREEN CARE HOSPITAL - C++ BACKEND REST API SERVER \n";
    std::cout << "========================================================\n";
    std::cout << "Database path: " << dbPath << "\n";

    auto db = std::make_shared<Database>(dbPath);
    if (!db->initialize()) {
        std::cerr << "CRITICAL: Could not initialize database at " << dbPath << "\n";
        return 1;
    }

    HospitalManagementSystem hospital(db);
    std::cout << "Hospital Management System loaded with "
              << hospital.getPatients().size() << " patients, "
              << hospital.getDoctors().size() << " doctors, and "
              << hospital.getAppointments().size() << " appointments.\n";

    httplib::Server svr;

    // Handle Preflight OPTIONS requests for CORS
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        setResponseHeaders(res, "text/plain");
        res.status = 204;
    });

    // 1. Health Check
    svr.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        setResponseHeaders(res);
        json out = {
            {"status", "ok"},
            {"service", "Evergreen Care Hospital REST API"},
            {"version", "2.0.0"},
            {"backend", "C++ / SQLite3 native backend"}
        };
        res.set_content(out.dump(), "application/json");
    });

    // 2. Dashboard Statistics & Recent Appointments
    svr.Get("/api/dashboard", [&hospital](const httplib::Request&, httplib::Response& res) {
        setResponseHeaders(res);
        json dashboard = hospital.getDashboardData();
        res.set_content(dashboard.dump(), "application/json");
    });

    // -------------------------------------------------------------
    // Patients Endpoints
    // -------------------------------------------------------------

    // GET /api/patients
    svr.Get("/api/patients", [&hospital](const httplib::Request&, httplib::Response& res) {
        setResponseHeaders(res);
        auto patients = hospital.getPatients();
        json arr = json::array();
        for (const auto& p : patients) {
            arr.push_back(p.toJson());
        }
        res.set_content(arr.dump(), "application/json");
    });

    // GET /api/patients/:id
    svr.Get(R"(/api/patients/(\d+))", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        int id = std::stoi(req.matches[1].str());
        Patient p(0, "", 0, "");
        if (hospital.getPatient(id, p)) {
            res.set_content(p.toJson().dump(), "application/json");
        } else {
            res.status = 404;
            json err = {{"error", "Patient not found"}, {"id", id}};
            res.set_content(err.dump(), "application/json");
        }
    });

    // POST /api/patients
    svr.Post("/api/patients", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        try {
            auto body = json::parse(req.body);
            std::string name = body.value("name", "");
            int age = body.value("age", 0);
            std::string illness = body.value("illness", "");
            int reqId = body.value("id", 0);

            Patient newPatient(0, "", 0, "");
            std::string errMsg;
            if (hospital.registerPatient(reqId, name, age, illness, newPatient, errMsg)) {
                res.status = 201;
                json out = {
                    {"success", true},
                    {"message", "Patient registered successfully."},
                    {"patient", newPatient.toJson()}
                };
                res.set_content(out.dump(), "application/json");
            } else {
                res.status = 400;
                json out = {{"success", false}, {"error", errMsg}};
                res.set_content(out.dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            json out = {{"success", false}, {"error", std::string("Invalid JSON payload: ") + e.what()}};
            res.set_content(out.dump(), "application/json");
        }
    });

    // DELETE /api/patients/:id
    svr.Delete(R"(/api/patients/(\d+))", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        int id = std::stoi(req.matches[1].str());
        std::string errMsg;
        if (hospital.deletePatient(id, errMsg)) {
            json out = {{"success", true}, {"message", "Patient record deleted successfully."}};
            res.set_content(out.dump(), "application/json");
        } else {
            res.status = 400;
            json out = {{"success", false}, {"error", errMsg}};
            res.set_content(out.dump(), "application/json");
        }
    });

    // -------------------------------------------------------------
    // Doctors Endpoints
    // -------------------------------------------------------------

    // GET /api/doctors
    svr.Get("/api/doctors", [&hospital](const httplib::Request&, httplib::Response& res) {
        setResponseHeaders(res);
        auto doctors = hospital.getDoctors();
        json arr = json::array();
        for (const auto& d : doctors) {
            arr.push_back(d.toJson());
        }
        res.set_content(arr.dump(), "application/json");
    });

    // GET /api/doctors/:id
    svr.Get(R"(/api/doctors/(\d+))", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        int id = std::stoi(req.matches[1].str());
        Doctor d(0, "", 0, "");
        if (hospital.getDoctor(id, d)) {
            res.set_content(d.toJson().dump(), "application/json");
        } else {
            res.status = 404;
            json err = {{"error", "Doctor not found"}, {"id", id}};
            res.set_content(err.dump(), "application/json");
        }
    });

    // POST /api/doctors
    svr.Post("/api/doctors", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        try {
            auto body = json::parse(req.body);
            std::string name = body.value("name", "");
            int age = body.value("age", 0);
            std::string specialization = body.value("specialization", "");
            int reqId = body.value("id", 0);

            Doctor newDoctor(0, "", 0, "");
            std::string errMsg;
            if (hospital.addDoctor(reqId, name, age, specialization, newDoctor, errMsg)) {
                res.status = 201;
                json out = {
                    {"success", true},
                    {"message", "Doctor added successfully."},
                    {"doctor", newDoctor.toJson()}
                };
                res.set_content(out.dump(), "application/json");
            } else {
                res.status = 400;
                json out = {{"success", false}, {"error", errMsg}};
                res.set_content(out.dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            json out = {{"success", false}, {"error", std::string("Invalid JSON payload: ") + e.what()}};
            res.set_content(out.dump(), "application/json");
        }
    });

    // GET /api/doctors/:id/availability
    svr.Get(R"(/api/doctors/(\d+)/availability)", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        int id = std::stoi(req.matches[1].str());
        std::string date = req.get_param_value("date");

        Doctor d(0, "", 0, "");
        if (!hospital.getDoctor(id, d)) {
            res.status = 404;
            json err = {{"error", "Doctor not found"}};
            res.set_content(err.dump(), "application/json");
            return;
        }

        auto bookedTimes = hospital.getDoctorBookedSlots(id, date);
        json out = {
            {"doctor_id", id},
            {"doctor_name", d.getName()},
            {"date", date},
            {"booked_slots", bookedTimes}
        };
        res.set_content(out.dump(), "application/json");
    });

    // -------------------------------------------------------------
    // Appointments Endpoints
    // -------------------------------------------------------------

    // GET /api/appointments
    svr.Get("/api/appointments", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        std::string status = req.get_param_value("status");
        std::string date = req.get_param_value("date");

        auto appts = hospital.getAppointments(status, date);
        json arr = json::array();
        for (const auto& a : appts) {
            arr.push_back(a.toJson());
        }
        res.set_content(arr.dump(), "application/json");
    });

    // GET /api/appointments/:id
    svr.Get(R"(/api/appointments/(\d+))", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        int id = std::stoi(req.matches[1].str());
        Appointment a(0, 0, 0, "", "");
        if (hospital.getAppointment(id, a)) {
            res.set_content(a.toJson().dump(), "application/json");
        } else {
            res.status = 404;
            json err = {{"error", "Appointment not found"}, {"id", id}};
            res.set_content(err.dump(), "application/json");
        }
    });

    // POST /api/appointments
    svr.Post("/api/appointments", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        try {
            auto body = json::parse(req.body);
            int patientId = body.value("patient_id", 0);
            int doctorId = body.value("doctor_id", 0);
            std::string date = body.value("date", "");
            if (date.empty()) date = body.value("appointment_date", "");
            std::string time = body.value("time", "");
            if (time.empty()) time = body.value("appointment_time", "");

            Appointment newAppt(0, 0, 0, "", "");
            std::string errMsg;
            if (hospital.bookAppointment(patientId, doctorId, date, time, newAppt, errMsg)) {
                res.status = 201;
                json out = {
                    {"success", true},
                    {"message", "Appointment booked successfully."},
                    {"appointment", newAppt.toJson()}
                };
                res.set_content(out.dump(), "application/json");
            } else {
                res.status = 400;
                json out = {{"success", false}, {"error", errMsg}};
                res.set_content(out.dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            json out = {{"success", false}, {"error", std::string("Invalid JSON payload: ") + e.what()}};
            res.set_content(out.dump(), "application/json");
        }
    });

    // POST /api/appointments/:id/cancel
    svr.Post(R"(/api/appointments/(\d+)/cancel)", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        int id = std::stoi(req.matches[1].str());
        std::string errMsg;
        if (hospital.cancelAppointment(id, errMsg)) {
            Appointment updated(0, 0, 0, "", "");
            hospital.getAppointment(id, updated);
            json out = {
                {"success", true},
                {"message", "Appointment #" + std::to_string(id) + " cancelled successfully."},
                {"appointment", updated.toJson()}
            };
            res.set_content(out.dump(), "application/json");
        } else {
            res.status = 400;
            json out = {{"success", false}, {"error", errMsg}};
            res.set_content(out.dump(), "application/json");
        }
    });

    // -------------------------------------------------------------
    // Staff Authorization & Authentication Endpoints
    // -------------------------------------------------------------

    // POST /api/auth/login
    svr.Post("/api/auth/login", [&hospital](const httplib::Request& req, httplib::Response& res) {
        setResponseHeaders(res);
        try {
            auto body = json::parse(req.body);
            std::string username = body.value("username", "");
            std::string password = body.value("password", "");

            StaffUser user;
            if (hospital.authenticateUser(username, password, user)) {
                json out = {
                    {"success", true},
                    {"message", "Authorization successful. Welcome, " + user.fullName + "."},
                    {"user", user.toJson()}
                };
                res.set_content(out.dump(), "application/json");
            } else {
                res.status = 401;
                json out = {
                    {"success", false},
                    {"error", "Invalid staff credentials. Please check your username and password."}
                };
                res.set_content(out.dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            json out = {{"success", false}, {"error", std::string("Malformed auth payload: ") + e.what()}};
            res.set_content(out.dump(), "application/json");
        }
    });

    // GET /api/auth/staff-list
    svr.Get("/api/auth/staff-list", [&hospital](const httplib::Request&, httplib::Response& res) {
        setResponseHeaders(res);
        auto users = hospital.getStaffUsers();
        json arr = json::array();
        for (const auto& u : users) {
            arr.push_back({
                {"username", u.username},
                {"full_name", u.fullName},
                {"role", u.role},
                {"department", u.department}
            });
        }
        res.set_content(arr.dump(), "application/json");
    });

    std::cout << "Starting server on http://localhost:" << port << " ...\n";
    std::cout << "Endpoints ready. Press Ctrl+C to terminate.\n";

    if (!svr.listen("0.0.0.0", port)) {
        std::cerr << "Failed to bind to port " << port << "!\n";
        return 1;
    }

    return 0;
}
