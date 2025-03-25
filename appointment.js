document.addEventListener("DOMContentLoaded", function () {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();

    function fetchAppointments() {
        fetch("backend/get_appointments.php")
            .then(response => response.json())
            .then(data => {
                const appointmentList = document.getElementById("appointment-list");
                appointmentList.innerHTML = "";
                data.forEach(appt => {
                    const div = document.createElement("div");
                    div.innerHTML = `<strong>${appt.patient}</strong> with Dr. ${appt.doctor} at ${appt.time}
                    <button onclick="cancelAppointment(${appt.id})">Cancel</button>
                    <button onclick="rescheduleAppointment(${appt.id})">Reschedule</button>`;
                    appointmentList.appendChild(div);
                });
            });
    }

    function fetchPatients() {
        fetch("backend/get_patients.php")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("patient-select");
                data.forEach(patient => {
                    const option = document.createElement("option");
                    option.value = patient.id;
                    option.textContent = patient.name;
                    select.appendChild(option);
                });
            });
    }

    function fetchDoctors() {
        fetch("backend/get_doctors.php")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("doctor-select");
                data.forEach(doctor => {
                    const option = document.createElement("option");
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    select.appendChild(option);
                });
            });
    }

    window.addAppointment = function () {
        const patientId = document.getElementById("patient-select").value;
        const doctorId = document.getElementById("doctor-select").value;
        const dateTime = document.getElementById("appointment-date").value;

        fetch("backend/add_appointment.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId, start_time: dateTime })
        }).then(() => fetchAppointments());
    };

    window.cancelAppointment = function (id) {
        fetch(`backend/cancel_appointment.php?id=${id}`, { method: "POST" })
            .then(() => fetchAppointments());
    };

    window.rescheduleAppointment = function (id) {
        const newDate = prompt("Enter new date and time (YYYY-MM-DD HH:MM):");
        if (newDate) {
            fetch(`backend/reschedule_appointment.php?id=${id}&new_date=${newDate}`, { method: "POST" })
                .then(() => fetchAppointments());
        }
    };
});