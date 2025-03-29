document.addEventListener("DOMContentLoaded", function () {
    let currentAppointmentId = null;
    
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
    populateDoctorFilter();

    function fetchAppointments() {
        fetch("backend/get_appointments.php")
            .then(response => response.json())
            .then(data => {
                const appointmentList = document.getElementById("appointment-list");
                appointmentList.innerHTML = "";
                
                if (data.length === 0) {
                    appointmentList.innerHTML = '<div class="no-appointments"><i class="fas fa-calendar-times"></i> No appointments found</div>';
                    return;
                }

                data.forEach(appt => {
                    const appointmentDiv = document.createElement("div");
                    appointmentDiv.className = "appointment-item";
                    appointmentDiv.innerHTML = `
                        <div class="appointment-header">
                            <span class="appointment-time"><i class="far fa-clock"></i> ${formatDateTime(appt.time)}</span>
                            <span class="appointment-status ${appt.status.toLowerCase()}">${appt.status}</span>
                        </div>
                        <div class="appointment-body">
                            <div class="appointment-patient"><i class="fas fa-user"></i> ${appt.patient}</div>
                            <div class="appointment-doctor"><i class="fas fa-user-md"></i> Dr. ${appt.doctor}</div>
                            ${appt.notes ? `<div class="appointment-notes"><i class="fas fa-notes-medical"></i> ${appt.notes}</div>` : ''}
                        </div>
                        <div class="appointment-actions">
                            <button onclick="openRescheduleModal(${appt.id})" class="btn-warning"><i class="fas fa-calendar-alt"></i> Reschedule</button>
                            <button onclick="confirmCancel(${appt.id})" class="btn-danger"><i class="fas fa-trash-alt"></i> Cancel</button>
                        </div>
                    `;
                    appointmentList.appendChild(appointmentDiv);
                });
            });
    }

    function fetchPatients() {
        fetch("backend/get_patients.php")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("patient-select");
                select.innerHTML = '<option value="">Select a patient...</option>';
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
                select.innerHTML = '<option value="">Select a doctor...</option>';
                data.forEach(doctor => {
                    const option = document.createElement("option");
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    select.appendChild(option);
                });
            });
    }

    function populateDoctorFilter() {
        fetch("backend/get_doctors.php")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("filter-doctor");
                data.forEach(doctor => {
                    const option = document.createElement("option");
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    select.appendChild(option);
                });
            });
    }

    function formatDateTime(dateTimeStr) {
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateTimeStr).toLocaleString('en-US', options);
    }

    window.addAppointment = function () {
        const patientId = document.getElementById("patient-select").value;
        const doctorId = document.getElementById("doctor-select").value;
        const dateTime = document.getElementById("appointment-date").value;
        const notes = document.getElementById("appointment-notes").value;

        if (!patientId || !doctorId || !dateTime) {
            showAlert("Please fill in all required fields", "error");
            return;
        }

        fetch("backend/add_appointment.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                patient_id: patientId, 
                doctor_id: doctorId, 
                start_time: dateTime,
                notes: notes
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert("Appointment booked successfully!", "success");
                fetchAppointments();
                // Reset form
                document.getElementById("appointment-notes").value = "";
                document.getElementById("appointment-date").value = "";
            } else {
                showAlert(data.message || "Failed to book appointment", "error");
            }
        })
        .catch(error => {
            showAlert("An error occurred while booking the appointment", "error");
            console.error("Error:", error);
        });
    };

    window.confirmCancel = function (id) {
        currentAppointmentId = id;
        document.getElementById("modal-title").innerHTML = '<i class="fas fa-exclamation-triangle"></i> Confirm Cancellation';
        document.getElementById("modal-message").textContent = "Are you sure you want to cancel this appointment? This action cannot be undone.";
        document.getElementById("modal-confirm-btn").innerHTML = '<i class="fas fa-trash-alt"></i> Confirm Cancel';
        document.getElementById("modal-confirm-btn").onclick = function() { cancelAppointment(id); };
        openModal('confirmation-modal');
    };

    window.cancelAppointment = function (id) {
        fetch(`backend/cancel_appointment.php?id=${id}`, { 
            method: "POST" 
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert("Appointment cancelled successfully", "success");
                fetchAppointments();
                closeModal();
            } else {
                showAlert(data.message || "Failed to cancel appointment", "error");
            }
        });
    };

    window.openRescheduleModal = function (id) {
        currentAppointmentId = id;
        openModal('reschedule-modal');
    };

    window.confirmReschedule = function () {
        const newDate = document.getElementById("new-appointment-date").value;
        if (!newDate) {
            showAlert("Please select a new date and time", "error");
            return;
        }
        
        fetch(`backend/reschedule_appointment.php?id=${currentAppointmentId}&new_date=${newDate}`, { 
            method: "POST" 
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert("Appointment rescheduled successfully", "success");
                fetchAppointments();
                closeModal();
                document.getElementById("new-appointment-date").value = "";
            } else {
                showAlert(data.message || "Failed to reschedule appointment", "error");
            }
        });
    };

    window.filterAppointments = function () {
        const dateFilter = document.getElementById("filter-date").value;
        const doctorFilter = document.getElementById("filter-doctor").value;
        
        let url = "backend/get_appointments.php?";
        if (dateFilter) url += `date_filter=${dateFilter}&`;
        if (doctorFilter) url += `doctor_filter=${doctorFilter}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const appointmentList = document.getElementById("appointment-list");
                appointmentList.innerHTML = "";
                
                if (data.length === 0) {
                    appointmentList.innerHTML = '<div class="no-appointments"><i class="fas fa-calendar-times"></i> No appointments match your filters</div>';
                    return;
                }

                data.forEach(appt => {
                    const appointmentDiv = document.createElement("div");
                    appointmentDiv.className = "appointment-item";
                    appointmentDiv.innerHTML = `
                        <div class="appointment-header">
                            <span class="appointment-time"><i class="far fa-clock"></i> ${formatDateTime(appt.time)}</span>
                            <span class="appointment-status ${appt.status.toLowerCase()}">${appt.status}</span>
                        </div>
                        <div class="appointment-body">
                            <div class="appointment-patient"><i class="fas fa-user"></i> ${appt.patient}</div>
                            <div class="appointment-doctor"><i class="fas fa-user-md"></i> Dr. ${appt.doctor}</div>
                            ${appt.notes ? `<div class="appointment-notes"><i class="fas fa-notes-medical"></i> ${appt.notes}</div>` : ''}
                        </div>
                        <div class="appointment-actions">
                            <button onclick="openRescheduleModal(${appt.id})" class="btn-warning"><i class="fas fa-calendar-alt"></i> Reschedule</button>
                            <button onclick="confirmCancel(${appt.id})" class="btn-danger"><i class="fas fa-trash-alt"></i> Cancel</button>
                        </div>
                    `;
                    appointmentList.appendChild(appointmentDiv);
                });
            });
    };

    window.openModal = function (modalId) {
        document.getElementById(modalId).style.display = "block";
        document.body.style.overflow = "hidden";
    };

    window.closeModal = function () {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = "none";
        });
        document.body.style.overflow = "auto";
        currentAppointmentId = null;
    };

    window.showAlert = function (message, type) {
        const alertDiv = document.createElement("div");
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="close-alert">&times;</button>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target.className === "modal") {
            closeModal();
        }
    };
});