<?php include "db_connect.php"; 

<div class="container">
    <h2>Manage Appointments</h2>

    <button onclick="openModal()">New Appointment</button>
    
    <table>
        <thead>
            <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="appointment-list">
            <!-- Appointments will be loaded here -->
        </tbody>
    </table>
</div>

<!-- Appointment Modal -->
<div id="appointment-modal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h3>New Appointment</h3>
        <form id="appointment-form">
            <label>Patient:</label>
            <select id="patient" required></select>

            <label>Doctor:</label>
            <select id="doctor" required></select>

            <label>Start Time:</label>
            <input type="datetime-local" id="start_time" required>

            <label>End Time:</label>
            <input type="datetime-local" id="end_time" required>

            <button type="submit">Save</button>
        </form>
    </div>
</div>

<script src="appointments.js"></script>
?>