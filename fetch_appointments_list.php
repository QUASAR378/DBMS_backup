<?php
include "db_connect.php";

$query = "SELECT a.id, p.name AS patient_name, d.name AS doctor_name, a.start_time, a.end_time
          FROM appointments a
          JOIN patients p ON a.patient_id = p.id
          JOIN doctors d ON a.doctor_id = d.id";

$result = mysqli_query($conn, $query);
$appointments = [];

while ($row = mysqli_fetch_assoc($result)) {
    $appointments[] = $row;
}

echo json_encode($appointments);
?>