document.addEventListener("DOMContentLoaded", function () {
    fetchDoctors();
    fetchPatients();

    function fetchDoctors() {
        fetch("backend/get_doctors.php")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("doctor-report-select");
                data.forEach(doctor => {
                    const option = document.createElement("option");
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    select.appendChild(option);
                });
            });
    }

    function fetchPatients() {
        fetch("backend/get_patients.php")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("patient-report-select");
                data.forEach(patient => {
                    const option = document.createElement("option");
                    option.value = patient.id;
                    option.textContent = patient.name;
                    select.appendChild(option);
                });
            });
    }

    window.fetchDoctorReport = function () {
        const doctorId = document.getElementById("doctor-report-select").value;

        fetch(`backend/get_doctor_report.php?id=${doctorId}`)
            .then(response => response.json())
            .then(data => {
                const reportDiv = document.getElementById("doctor-report");
                reportDiv.innerHTML = `<h3>Appointments for Dr. ${data.doctor}</h3>`;
                data.appointments.forEach(appt => {
                    const p = document.createElement("p");
                    p.textContent = `${appt.patient} at ${appt.time}`;
                    reportDiv.appendChild(p);
                });
            });
    };

    window.fetchPatientReport = function () {
        const patientId = document.getElementById("patient-report-select").value;

        fetch(`backend/get_patient_report.php?id=${patientId}`)
            .then(response => response.json())
            .then(data => {
                const reportDiv = document.getElementById("patient-report");
                reportDiv.innerHTML = `<h3>Appointments for ${data.patient}</h3>`;
                data.appointments.forEach(appt => {
                    const p = document.createElement("p");
                    p.textContent = `Dr. ${appt.doctor} at ${appt.time}`;
                    reportDiv.appendChild(p);
                });
            });
    };
});