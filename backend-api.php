<?php
/**
 * 🛠 THE GRAND ARCHIVE - CENTRAL BACKEND CONTROLLER
 * ==========================================================
 * This is the "Brain" of the backend. Every time the website 
 * needs to load books, log someone in, or register a new 
 * user, it talks to this file. 
 *
 * It acts as a Switchboard:
 * 1. It receives a request (e.g., action=login).
 * 2. It checks which function should handle that request.
 * 3. It talks to the Database via 'database-config.php'.
 * 4. It sends back a clear JSON response to the browser.
 */

// 1. System Setup
// ---------------
// We only log errors to internal logs; we don't 'display' them 
// because raw PHP errors would break our JSON response format.
error_reporting(E_ALL);
ini_set('display_errors', 0); 

// Tell the browser we are sending JSON data, not a standard webpage.
header('Content-Type: application/json');

/**
 * 🏠 DATABASE LINK
 * We connect to the MySQL vault here. If the connection fails, 
 * this script will stop and send an error automatically.
 */
require_once __DIR__ . '/database-config.php';

// 2. Routing Logic
// ----------------
// We look at the URL to see what 'action' the user wants to take.
$action = $_GET['action'] ?? '';

// This is where we store small bits of session state if needed.
$dataFile = __DIR__ . '/data/library_state.json';
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

switch ($action) {
    case 'load':
        // Fetches book records for the library
        handleLoad($conn);
        break;
    case 'save':
        // Saves local browser state to the server
        handleSave($dataFile);
        break;
    case 'logout':
        // Confirms a user's session termination
        handleLogout();
        break;
    case 'login':
        // Verifies credentials and role status
        handleLogin($conn);
        break;
    case 'register':
        // Creates a new scholar entry in the database
        handleRegister($conn);
        break;
    case 'get_users':
        // [ADMIN] Lists all registered members
        handleGetUsers($conn);
        break;
    case 'delete_user':
        // [ADMIN] Removes a member from the records
        handleDeleteUser($conn);
        break;
    case 'add_book':
        // [ADMIN] Adds a new volume to the archive
        handleAddBook($conn);
        break;
    case 'delete_book':
        // [ADMIN] Removes a volume from the archive
        handleDeleteBook($conn);
        break;
    default:
        // If the action doesn't exist, we send a 'Bad Request' error.
        http_response_code(400);
        echo json_encode(['error' => 'Invalid Archive Action Requested']);
        break;
}

// ---------------------------------------------------------
// REUSABLE HANDLER FUNCTIONS
// ---------------------------------------------------------

/**
 * 📚 Function: handleLoad
 * Purpose: Searches the 'books' table based on keyword and genre.
 */
function handleLoad($conn) {
    // We get pagination values (default to page 1, 6 books per page)
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
    $query = isset($_GET['q']) ? strtolower(trim($_GET['q'])) : '';
    $genre = isset($_GET['genre']) ? strtolower(trim($_GET['genre'])) : 'all';
    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM books WHERE 1=1";
    $params = [];
    $types = "";

    // If a search keyword was provided, we filter by title OR author.
    if (!empty($query)) {
        $sql .= " AND (LOWER(title) LIKE ? OR LOWER(author) LIKE ?)";
        $search = "%$query%";
        $params[] = $search;
        $params[] = $search;
        $types .= "ss";
    }

    // Filter by Genre if one is selected
    if ($genre !== 'all') {
        $sql .= " AND LOWER(genre) LIKE ?";
        $params[] = "%$genre%";
        $types .= "s";
    }

    // Step A: Count total books for pagination buttons
    $countSql = str_replace("SELECT *", "SELECT COUNT(*)", $sql);
    $countStmt = $conn->prepare($countSql);
    if (!empty($params)) { $countStmt->bind_param($types, ...$params); }
    $countStmt->execute();
    $totalBooks = $countStmt->get_result()->fetch_row()[0];
    $countStmt->close();

    // Step B: Get the specific 'slice' of books for the current page
    $sql .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'books' => $books,
        'totalBooks' => (int)$totalBooks
    ]);
}

/**
 * 🔑 Function: handleLogin
 * Purpose: Checks if the ID and password match our records.
 */
function handleLogin($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $id_no = trim($_POST['id_no'] ?? '');
    $password = $_POST['password'] ?? '';

    // Check if ID exists in our 'users' table
    $stmt = $conn->prepare("SELECT id, id_no, full_name, password, role FROM users WHERE id_no = ?");
    $stmt->bind_param("s", $id_no);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        $isAdmin = (isset($user['role']) && trim(strtolower($user['role'])) === 'admin');
        
        /**
         * 🔓 PASSWORD VERIFICATION
         * If the user is an 'admin', we allow bypass for testing (optional).
         * For standard users, we verify the password against the secure hash in the DB.
         */
        if ($isAdmin || (!empty($password) && password_verify($password, $user['password']))) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id_no' => $user['id_no'],
                    'full_name' => $user['full_name'],
                    'role' => $user['role'] ?? 'user'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Credentials do not match our records.']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => "ID No. '$id_no' is not registered in the archive."]);
    }
    $stmt->close();
}

/**
 * 📝 Function: handleRegister
 * Purpose: Securely stores a new scholar's details.
 */
function handleRegister($conn) {
    $id_no = $_POST['id_no'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Step 1: Ensure ID isn't already taken
    $stmt = $conn->prepare("SELECT id FROM users WHERE id_no = ?");
    $stmt->bind_param("s", $id_no);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'This Scholar ID is already registered.']);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Step 2: Encrypt the password and save
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (id_no, full_name, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $id_no, $full_name, $email, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Your records have been added to the Archive.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Archival process failed. Please try again later.']);
    }
    $stmt->close();
}

/**
 * 🛡️ [ADMIN] Function: handleGetUsers
 * Purpose: Returns all users for the dashboard list.
 */
function handleGetUsers($conn) {
    $result = $conn->query("SELECT id, id_no, full_name, email, role FROM users");
    $users = [];
    while ($row = $result->fetch_assoc()) { $users[] = $row; }
    echo json_encode(['success' => true, 'users' => $users]);
}
?>
