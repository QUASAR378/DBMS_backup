<?php
$host = "localhost";
$user = "root";
$password = "paSSW08-D";
$database = "HospitalClinicSystem"; // Use your actual database name

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>