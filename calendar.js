document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("calendar-date");
    const appointmentList = document.getElementById("appointment-list");

    dateInput.addEventListener("change", function () {
        fetchAppointments(dateInput.value);
    });

    function fetchAppointments(date) {
        fetch(`backend/get_appointments.php?date=${date}`)
            .then(response => response.json())
            .then(data => {
                appointmentList.innerHTML = "";
                data.forEach(appointment => {
                    const div = document.createElement("div");
                    div.classList.add("appointment");
                    div.innerHTML = `<strong>${appointment.patient}</strong> with Dr. ${appointment.doctor} at ${appointment.time}`;
                    appointmentList.appendChild(div);
                });
            });
    }
});