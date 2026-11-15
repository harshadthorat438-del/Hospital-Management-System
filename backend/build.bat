@echo off
echo ========================================================
echo  BUILDING EVERGREEN CARE HOSPITAL C++ BACKEND
echo ========================================================

if not exist "sqlite3.o" (
    echo Compiling SQLite3 engine...
    gcc -O2 -Iinclude -c sqlite3.c -o sqlite3.o
)

echo Compiling C++ server with MinGW g++...
g++ -std=c++17 -O2 -Iinclude src/main.cpp src/database.cpp src/hospital_system.cpp sqlite3.o -lws2_32 -lcrypt32 -o hospital_server.exe

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Backend compiled successfully: backend/hospital_server.exe
) else (
    echo.
    echo [ERROR] Backend compilation failed.
)
