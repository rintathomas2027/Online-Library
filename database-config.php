<?php
/**
 * 🏛 THE GRAND ARCHIVE - DATABASE CONNECTION CONFIGURATION
 * ==========================================================
 * This file is the "Basement" of our project. It handles the 
 * essential connection between our PHP scripts and the MySQL 
 * database where all our books and user records are stored.
 */

// 1. Connection Credentials
// -------------------------
$host = 'localhost';        // Usually 'localhost' for XAMPP
$db   = 'book_catalog';     // Name of the database in phpMyAdmin
$user = 'root';             // Default XAMPP username
$pass = '';                 // Default XAMPP password (usually empty)

/**
 * 🛠 ERROR HANDLING & REPORTING
 * We turn off default error reporting to prevent PHP from "spitting out" 
 * raw error text into our nice clean JSON data, which would break our 
 * frontend JavaScript.
 */
mysqli_report(MYSQLI_REPORT_OFF);

try {
    // Attempt to establish a new connection to the MySQL server
    $conn = new mysqli($host, $user, $pass, $db);

    // If the connection has a 'connect_error' property, something went wrong.
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set charset to UTF-8 to ensure special characters in book titles display correctly.
    $conn->set_charset("utf8mb4");

} catch (Exception $e) {
    /**
     * 🚨 FAILSAFE REDIRECT / RESPONSE
     * If we can't talk to the database, we inform the frontend immediately 
     * with a JSON message so the user sees a helpful error instead of a white page.
     */
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "error" => "The Archive Vault is currently unreachable.",
        "debug" => "Check if XAMPP MySQL is active. Details: " . $e->getMessage()
    ]);
    exit;
}
?>
