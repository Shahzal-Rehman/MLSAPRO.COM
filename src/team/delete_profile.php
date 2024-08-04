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

$id = $_POST['id'];

$sql = "DELETE FROM profiles WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo "Profile deleted successfully";
} else {
    echo "Error deleting profile: " . $conn->error;
}

$conn->close();
?>
