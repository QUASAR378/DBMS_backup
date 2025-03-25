<?php
include "db_connect.php";

$id = $_GET["id"];
$query = "DELETE FROM appointments WHERE id='$id'";

echo json_encode(["success" => mysqli_query($conn, $query)]);
?>