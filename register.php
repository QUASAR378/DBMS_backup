<?php
require 'db_connect.php'; // Database connection

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash password
$role = $data['role'];

if (empty($name) || empty($email) || empty($data['password']) || empty($role)) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

// Check if email already exists
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();
if ($checkStmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit();
}

// Insert into database
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $password, $role);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registration successful."]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed."]);
}
?>