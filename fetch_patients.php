<?php
include "db_connect.php";

$query = "SELECT id, name, phone, email, status FROM patients";
$result = mysqli_query($conn, $query);
$patients = [];

while ($row = mysqli_fetch_assoc($result)) {
    $patients[] = $row;
}

echo json_encode($patients);
?>