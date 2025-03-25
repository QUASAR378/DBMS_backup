document.addEventListener("DOMContentLoaded", function () {
    fetchDoctors();

    function fetchDoctors() {
        fetch("backend/get_doctors.php")
            .then(response => response.json())
            .then(data => {
                const doctorList = document.getElementById("doctor-list");
                doctorList.innerHTML = "";
                data.forEach(doc => {
                    const div = document.createElement("div");
                    div.innerHTML = `<strong>${doc.name}</strong> - ${doc.specialty}
                    <button onclick="deactivateDoctor(${doc.id})">Deactivate</button>`;
                    doctorList.appendChild(div);
                });
            });
    }

    window.addDoctor = function () {
        const name = document.getElementById("doctor-name").value;
        const specialty = document.getElementById("doctor-specialty").value;

        fetch("backend/add_doctor.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, specialty })
        }).then(() => fetchDoctors());
    };

    window.deactivateDoctor = function (id) {
        fetch(`backend/deactivate_doctor.php?id=${id}`, { method: "POST" })
            .then(() => fetchDoctors());
    };
});