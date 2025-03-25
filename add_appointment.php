<?php
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$patient_id = $data["patient_id"];
$doctor_id = $data["doctor_id"];
$start_time = $data["start_time"];

$query = "INSERT INTO appointments (patient_id, doctor_id, start_time) VALUES (?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("iis", $patient_id, $doctor_id, $start_time);
$stmt->execute();

echo json_encode(["status" => "success"]);
?>