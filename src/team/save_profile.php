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

$name = $_POST['name'];
$designation = $_POST['designation'];
$description = $_POST['description'];

// Upload profile picture
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["profilePicture"]["name"]);
move_uploaded_file($_FILES["profilePicture"]["tmp_name"], $target_file);

$sql = "INSERT INTO profiles (name, designation, description, profile_picture) VALUES ('$name', '$designation', '$description', '$target_file')";

if ($conn->query($sql) === TRUE) {
    echo "New profile created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
