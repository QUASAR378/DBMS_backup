document.addEventListener('DOMContentLoaded', function() {
  loadPatients();
  setupFormSubmit();
});

let currentPatientId = null;
let currentAction = null;

function setupFormSubmit() {
  document.getElementById('patient-form').addEventListener('submit', function(e) {
      e.preventDefault();
      if (currentAction === 'create') {
          createPatient();
      } else if (currentAction === 'update') {
          updatePatient();
      }
  });
}

function loadPatients() {
  fetch('api/fetch_patients.php')
      .then(response => response.json())
      .then(data => {
          renderPatientList(data);
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Failed to load patients');
      });
}

function renderPatientList(patients) {
  const tableBody = document.getElementById('patient-list');
  tableBody.innerHTML = '';

  patients.forEach(patient => {
      const statusClass = patient.status === "1" ? 'status-active' : 'status-inactive';
      const statusText = patient.status === "1" ? 'Active' : 'Inactive';
      
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${patient.name}</td>
          <td>${patient.phone}</td>
          <td>${patient.email}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
              <button class="action-btn edit-btn" onclick="prepareUpdate(${patient.id})">Edit</button>
              ${patient.status === "1" ? 
                  `<button class="action-btn deactivate-btn" onclick="showConfirmModal(${patient.id}, 'deactivate')">Deactivate</button>` :
                  `<button class="action-btn activate-btn" onclick="showConfirmModal(${patient.id}, 'activate')">Activate</button>`
              }
          </td>
      `;
      tableBody.appendChild(row);
  });
}

// CREATE PATIENT
function openModal(action) {
  currentAction = action;
  const modal = document.getElementById('patient-modal');
  
  if (action === 'create') {
      document.getElementById('modal-title').textContent = 'New Patient';
      document.getElementById('patient-form').reset();
      document.getElementById('status').value = '1';
  }
  
  modal.style.display = 'flex';
}

// UPDATE PATIENT
function prepareUpdate(patientId) {
  currentPatientId = patientId;
  currentAction = 'update';
  
  fetch(`api/get_patient.php?id=${patientId}`)
      .then(response => response.json())
      .then(patient => {
          if (patient) {
              document.getElementById('modal-title').textContent = 'Edit Patient';
              document.getElementById('patient-id').value = patient.id;
              document.getElementById('name').value = patient.name;
              document.getElementById('phone').value = patient.phone;
              document.getElementById('email').value = patient.email;
              document.getElementById('status').value = patient.status;
              openModal('update');
          } else {
              alert('Patient not found');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Failed to load patient data');
      });
}

function createPatient() {
  const formData = new FormData(document.getElementById('patient-form'));
  
  fetch('api/create_patient.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          closeModal();
          loadPatients();
          alert('Patient created successfully!');
      } else {
          alert(data.message || 'Creation failed');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Failed to create patient');
  });
}

function updatePatient() {
  const formData = new FormData(document.getElementById('patient-form'));
  formData.append('id', currentPatientId);
  
  fetch('api/update_patient.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          closeModal();
          loadPatients();
          alert('Patient updated successfully!');
      } else {
          alert(data.message || 'Update failed');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Failed to update patient');
  });
}

// DEACTIVATE/ACTIVATE PATIENT
function showConfirmModal(patientId, action) {
  currentPatientId = patientId;
  const confirmModal = document.getElementById('confirm-modal');
  const confirmBtn = document.getElementById('confirm-action-btn');
  
  if (action === 'deactivate') {
      document.getElementById('confirm-message').textContent = 'Are you sure you want to deactivate this patient?';
      confirmBtn.textContent = 'Deactivate';
      confirmBtn.className = 'confirm-btn deactivate-btn';
      confirmBtn.onclick = deactivatePatient;
  } else {
      document.getElementById('confirm-message').textContent = 'Are you sure you want to activate this patient?';
      confirmBtn.textContent = 'Activate';
      confirmBtn.className = 'confirm-btn activate-btn';
      confirmBtn.onclick = activatePatient;
  }
  
  confirmModal.style.display = 'flex';
}

function deactivatePatient() {
  fetch(`api/deactivate_patient.php?id=${currentPatientId}`)
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
          console.error('Error:', error);
          alert('Failed to deactivate patient');
      });
}

function activatePatient() {
  fetch(`api/activate_patient.php?id=${currentPatientId}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              closeConfirmModal();
              loadPatients();
              alert('Patient activated successfully');
          } else {
              alert(data.message || 'Activation failed');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Failed to activate patient');
      });
}

function closeModal() {
  document.getElementById('patient-modal').style.display = 'none';
  currentPatientId = null;
  currentAction = null;
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').style.display = 'none';
  currentPatientId = null;
}