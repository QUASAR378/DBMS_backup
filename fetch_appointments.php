<?php
include "db_connect.php";

$query = "SELECT a.id, a.patient_id, p.name AS patient_name, d.name AS doctor_name, a.start_time, a.end_time 
          FROM appointments a 
          JOIN patients p ON a.patient_id = p.id 
          JOIN doctors d ON a.doctor_id = d.id";

$result = mysqli_query($conn, $query);
$appointments = [];

while ($row = mysqli_fetch_assoc($result)) {
    $appointments[] = [
        "id" => $row["id"],
        "title" => "{$row['patient_name']} - {$row['doctor_name']}",
        "start" => $row["start_time"],
        "end" => $row["end_time"]
    ];
}

echo json_encode($appointments);
?>