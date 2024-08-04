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
$name = $_POST['name'];
$designation = $_POST['designation'];
$description = $_POST['description'];

$sql = "UPDATE profiles SET name='$name', designation='$designation', description='$description' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo "Profile updated successfully";
} else {
    echo "Error updating profile: " . $conn->error;
}

$conn->close();
?>
