<?php
$servername = "localhost";
$username = "root";
$password = ""; // Default XAMPP MySQL has no password
$database = "hospitalclinicsystem"; // Update with your database name

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
