<?php include "header.php"; ?>

<div class="container">
    <h2>Manage Patients</h2>

    <button onclick="openPatientModal()">New Patient</button>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="patient-list">
            <!-- Patients will be loaded here -->
        </tbody>
    </table>
</div>

<!-- Patient Modal -->
<div id="patient-modal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closePatientModal()">&times;</span>
        <h3 id="modal-title">New Patient</h3>
        <form id="patient-form">
            <input type="hidden" id="patient_id">
            
            <label>Name:</label>
            <input type="text" id="name" required>

            <label>Phone:</label>
            <input type="text" id="phone" required>

            <label>Email:</label>
            <input type="email" id="email" required>

            <button type="submit">Save</button>
        </form>
    </div>
</div>

<script src="patients.js"></script>
<?php include "footer.php"; ?>