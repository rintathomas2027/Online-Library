<?php
/**
 * 🛠 THE GRAND ARCHIVE - DATABASE DEBUGGER
 * ==========================================================
 * This is a simple diagnostic tool to verify that the Archive's 
 * vault (Database) is open and accessible. 
 */

// Return as JSON so it's easy to read in the browser
header('Content-Type: application/json');

// Connect to the database using our new configuration file
require_once 'database-config.php';

$res = [
    "status" => "Archival Connection Established",
    "host"   => "localhost",
    "vaults" => [] // This will store our table list
];

// Query the server for a list of all tables
$result = $conn->query("SHOW TABLES");
if ($result) {
    while ($row = $result->fetch_array()) {
        $res["vaults"][] = $row[0];
    }
} else {
    $res["status"] = "Connection Denied: " . $conn->error;
}

// Output the results
echo json_encode($res, JSON_PRETTY_PRINT);
?>
