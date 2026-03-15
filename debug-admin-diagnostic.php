<?php
/**
 * 🛠 THE GRAND ARCHIVE - ADMIN DIAGNOSTIC
 * ==========================================================
 * This internal tool checks the health of the Archivist logic
 * and verifies that the 'admin' clearance is active.
 */

require_once 'database-config.php';

echo "<h2>System Diagnostic</h2>";

// 1. Verify Member '911' (Default Admin)
$id_to_check = '911';
$stmt = $conn->prepare("SELECT id_no, full_name, role FROM users WHERE id_no = ?");
$stmt->bind_param("s", $id_to_check);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo "<p style='color:green'>✅ Scholar '911' FOUND in Archives.</p>";
    echo "<ul>";
    echo "<li><b>Name:</b> " . $user['full_name'] . "</li>";
    echo "<li><b>Clearance:</b> '" . $user['role'] . "'</li>";
    echo "</ul>";
    
    if (trim(strtolower($user['role'])) === 'admin') {
        echo "<p style='color:blue'>🌟 AUTHENTICATION READY: Clearance is correctly set to 'admin'.</p>";
    } else {
        echo "<p style='color:red'>⚠️ CLEARANCE WARNING: Role is '" . $user['role'] . "'. Admin powers restricted.</p>";
    }
} else {
    echo "<p style='color:red'>❌ RECORD MISSING: Scholar '911' NOT FOUND.</p>";
    echo "<p>Please register this ID on the login page first.</p>";
}

// 2. Verify Volume Collection
echo "<h3>Archive Catalog Check</h3>";
$table_check = $conn->query("SHOW TABLES LIKE 'books'");
if ($table_check && $table_check->num_rows > 0) {
    echo "<p style='color:green'>✅ Catalog Table 'books' is INTACT.</p>";
    $count = $conn->query("SELECT COUNT(*) FROM books")->fetch_row()[0];
    echo "<p>Total Volumes Preserved: <b>$count</b></p>";
} else {
    echo "<p style='color:red'>❌ CATALOG MISSING: Table 'books' DOES NOT EXIST.</p>";
    echo "<p>Please run the setup scripts in the /sql directory.</p>";
}
?>
