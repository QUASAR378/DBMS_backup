document.addEventListener("DOMContentLoaded", function() {
  loadPatients();
});

function loadPatients() {
  fetch("fetch_patients.php")
    .then(res => res.json())
    .then(data => {
      let table = document.getElementById("patient-list");
      table.innerHTML = "";
      data.forEach(patient => {
        table.innerHTML += `
                    <tr>
                        <td>${patient.name}</td>
                        <td>${patient.phone}</td>
                        <td>${patient.email}</td>
                        <td>${patient.status === "1" ? "Active" : "Inactive"}</td>
                        <td>
                            <button onclick="editPatient(${patient.id}, '${patient.name}', '${patient.phone}', '${patient.email}')">Edit</button>
                            <button onclick="deactivatePatient(${patient.id})">Deactivate</button>
                        </td>
                    </tr>
                `;
      });
    });
}

document.getElementById("patient-form").addEventListener("submit", function(e) {
  e.preventDefault();
  let formData = new FormData();
  formData.append("id", document.getElementById("patient_id").value);
  formData.append("name", document.getElementById("name").value);
  formData.append("phone", document.getElementById("phone").value);
  formData.append("email", document.getElementById("email").value);
  
  fetch("save_patient.php", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        closePatientModal();
        loadPatients();
      } else {
        alert("Error: " + data.message);
      }
    });
});

function editPatient(id, name, phone, email) {
  document.getElementById("patient_id").value = id;
  document.getElementById("name").value = name;
  document.getElementById("phone").value = phone;
  document.getElementById("email").value = email;
  document.getElementById("modal-title").innerText = "Edit Patient";
  openPatientModal();
}

function deactivatePatient(id) {
  if (confirm("Are you sure you want to deactivate this patient?")) {
    fetch(`deactivate_patient.php?id=${id}`, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadPatients();
        } else {
          alert("Error: " + data.message);
        }
      });
  }
}

function openPatientModal() {
  document.getElementById("patient-modal").style.display = "block";
}

function closePatientModal() {
  document.getElementById("patient-modal").style.display = "none";
  document.getElementById("patient-form").reset();
  document.getElementById("modal-title").innerText = "New Patient";
}