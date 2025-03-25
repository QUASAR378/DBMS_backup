document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const doctorFilter = document.getElementById("doctorFilter");
    const patientSearch = document.getElementById("patientSearch");

    let appointments = [];
    let doctors = [];

    // Function to fetch data
    async function fetchData() {
        try {
            const apptResponse = await fetch("http://localhost:8000/api/appointments/");
            appointments = await apptResponse.json();

            const docResponse = await fetch("http://localhost:8000/api/doctors/");
            doctors = await docResponse.json();

            populateDoctors();
            renderCalendar(appointments);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Function to populate doctor dropdown
    function populateDoctors() {
        doctors.forEach(doc => {
            const option = document.createElement("option");
            option.value = doc.name;
            option.textContent = doc.name;
            doctorFilter.appendChild(option);
        });
    }

    // Function to filter and render calendar
    function renderCalendar(filteredAppointments) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            events: filteredAppointments.map(appt => ({
                title: `${appt.patient} - ${appt.reason}`,
                start: appt.start_time,
                end: appt.end_time,
                className: appt.urgency === "High" ? "event-high" : appt.urgency === "Medium" ? "event-medium" : "event-low",
            })),
        });

        calendar.render();
    }

    // Function to filter appointments
    function filterAppointments() {
        let filtered = appointments;

        if (doctorFilter.value) {
            filtered = filtered.filter(appt => appt.doctor === doctorFilter.value);
        }

        if (patientSearch.value) {
            filtered = filtered.filter(appt => appt.patient.toLowerCase().includes(patientSearch.value.toLowerCase()));
        }

        renderCalendar(filtered);
    }

    // Event listeners for filtering
    doctorFilter.addEventListener("change", filterAppointments);
    patientSearch.addEventListener("input", filterAppointments);

    // Fetch data and initialize
    fetchData();
});