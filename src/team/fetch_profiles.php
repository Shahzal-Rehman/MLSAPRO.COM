<?php
// Connect to your database
$server = "sr-server-0302.database.windows.net";
$database = "sr";
$username = "SREHMAN0302";
$password = "P@ssw0rd123!";

$conn = new mysqli($server, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM profiles";
$result = $conn->query($sql);

$profiles = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $profiles[] = $row;
    }
}

$conn->close();

echo json_encode($profiles);
?>
