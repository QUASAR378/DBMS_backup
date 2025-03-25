<?php
include 'db_connect.php'; // Your existing database connection

$date = $_GET['date'];
$query = "SELECT a.id, p.name AS patient, d.name AS doctor, a.start_time AS time 
          FROM appointments a 
          JOIN patients p ON a.patient_id = p.id
          JOIN doctors d ON a.doctor_id = d.id
          WHERE DATE(a.start_time) = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);
?>