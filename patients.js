document.addEventListener('DOMContentLoaded', function() {
  loadPatients();
  setupEventListeners();
});

let currentPatientId = null;

function setupEventListeners() {
  // Form submission
  document.getElementById('patient-form').addEventListener('submit', function(e) {
      e.preventDefault();
      savePatient();
  });
}

function loadPatients() {
  fetch('fetch_patients.php')
      .then(response => response.json())
      .then(data => {
          renderPatientList(data);
      })
      .catch(error => {
          console.error('Error loading patients:', error);
          alert('Failed to load patients. Please try again.');
      });
}

function renderPatientList(patients) {
  const tableBody = document.getElementById('patient-list');
  tableBody.innerHTML = '';

  patients.forEach(patient => {
      const row = document.createElement('tr');
      
      const statusClass = patient.status === "1" ? 'status-active' : 'status-inactive';
      const statusText = patient.status === "1" ? 'Active' : 'Inactive';
      const actionButton = patient.status === "1" ? 
          `<button class="action-btn deactivate-btn" onclick="showDeactivateConfirm(${patient.id})">Deactivate</button>` :
          `<button class="action-btn activate-btn" onclick="activatePatient(${patient.id})">Activate</button>`;
      
      row.innerHTML = `
          <td>${patient.name}</td>
          <td>${patient.phone}</td>
          <td>${patient.email}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
              <button class="action-btn edit-btn" onclick="editPatient(${patient.id})">Edit</button>
              ${actionButton}
          </td>
      `;
      
      tableBody.appendChild(row);
  });
}

function openCreateModal() {
  currentPatientId = null;
  document.getElementById('modal-title').textContent = 'New Patient';
  document.getElementById('patient-form').reset();
  document.getElementById('status').value = '1';
  document.getElementById('patient-modal').style.display = 'flex';
}

function editPatient(id) {
  currentPatientId = id;
  
  fetch(`get_patient.php?id=${id}`)
      .then(response => response.json())
      .then(patient => {
          if (patient) {
              document.getElementById('modal-title').textContent = 'Edit Patient';
              document.getElementById('patient-id').value = patient.id;
              document.getElementById('name').value = patient.name;
              document.getElementById('phone').value = patient.phone;
              document.getElementById('email').value = patient.email;
              document.getElementById('status').value = patient.status;
              document.getElementById('patient-modal').style.display = 'flex';
          } else {
              alert('Patient not found');
          }
      })
      .catch(error => {
          console.error('Error fetching patient:', error);
          alert('Failed to load patient data.');
      });
}

function savePatient() {
  const formData = new FormData(document.getElementById('patient-form'));
  const url = currentPatientId ? 'update_patient.php' : 'create_patient.php';
  
  if (currentPatientId) {
      formData.append('id', currentPatientId);
  }
  
  fetch(url, {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          closeModal();
          loadPatients();
          alert(`Patient ${currentPatientId ? 'updated' : 'created'} successfully!`);
      } else {
          alert(data.message || 'Operation failed');
      }
  })
  .catch(error => {
      console.error('Error saving patient:', error);
      alert('Failed to save patient. Please try again.');
  });
}

function showDeactivateConfirm(id) {
  currentPatientId = id;
  document.getElementById('confirm-message').textContent = 'Are you sure you want to deactivate this patient?';
  document.getElementById('confirm-action-btn').onclick = deactivatePatient;
  document.getElementById('confirm-action-btn').className = 'confirm-btn';
  document.getElementById('confirm-action-btn').textContent = 'Deactivate';
  document.getElementById('confirm-modal').style.display = 'flex';
}

function deactivatePatient() {
  fetch(`deactivate_patient.php?id=${currentPatientId}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              closeConfirmModal();
              loadPatients();
              alert('Patient deactivated successfully');
          } else {
              alert(data.message || 'Deactivation failed');
          }
      })
      .catch(error => {
          console.error('Error deactivating patient:', error);
          alert('Failed to deactivate patient');
      });
}

function activatePatient(id) {
  currentPatientId = id;
  
  fetch(`activate_patient.php?id=${id}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              loadPatients();
              alert('Patient activated successfully');
          } else {
              alert(data.message || 'Activation failed');
          }
      })
      .catch(error => {
          console.error('Error activating patient:', error);
          alert('Failed to activate patient');
      });
}

function closeModal() {
  document.getElementById('patient-modal').style.display = 'none';
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').style.display = 'none';
}