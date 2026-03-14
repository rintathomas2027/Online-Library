<?php
$servername = "sql306.infinityfree.com"; // Copy this from your 'MySQL Hostname'
$username = "if0_41390232";            // Your MySQL Username
$password = "Gy7K1Cz5CJ";   // Your InfinityFree account password
$dbname = "if0_41390232_library";      // The full database name you created

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
