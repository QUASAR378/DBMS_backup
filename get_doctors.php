<?php
include 'db_connect.php';

$query = "SELECT * FROM doctors WHERE status = 'active'";
$result = $conn->query($query);

$doctors = [];
while ($row = $result->fetch_assoc()) {
    $doctors[] = $row;
}

echo json_encode($doctors);
?>