<?php
include "db_connect.php";

$id = $_POST["id"];
$name = $_POST["name"];
$phone = $_POST["phone"];
$email = $_POST["email"];

if ($id) {
    // Update existing patient
    $query = "UPDATE patients SET name='$name', phone='$phone', email='$email' WHERE id='$id'";
} else {
    // Insert new patient
    $query = "INSERT INTO patients (name, phone, email, status) VALUES ('$name', '$phone', '$email', 1)";
}

echo json_encode(["success" => mysqli_query($conn, $query)]);
?>