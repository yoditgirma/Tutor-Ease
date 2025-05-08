<?php
session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tutorease";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Connection failed: " . $conn->connect_error]));
}


// Get the request data
$data = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'signup') {
    // Handle signup
    $fname = $data['fname'];
    $lname = $data['lname'];
    $email = $data['email'];
    $phone_number = $data['phone'];
    $password = $data['password'];

    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters long']);
        exit;
    }

    $password = password_hash($password, PASSWORD_BCRYPT);

    // Check if phone number is allowed
    $check_phone = "SELECT phone_number FROM allowed_phones WHERE phone_number = '$phone_number'";
    $result_phone = $conn->query($check_phone);

    if ($result_phone->num_rows == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Get Registered by Telegram first.']);
        exit;
    }

    // Check if email already exists
    $check_email = "SELECT email FROM users WHERE email = '$email'";
    $result_email = $conn->query($check_email);

    if ($result_email->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        exit;
    }

    // Insert new user
    $sql = "INSERT INTO users (fname, lname, email, password, phone_number) VALUES ('$fname', '$lname', '$email', '$password', '$phone_number')";
    if ($conn->query($sql) === TRUE) {
        // Get the new user's ID
        $user_id = $conn->insert_id;
        
        // Set session for the new user
        $_SESSION['user_id'] = $user_id;
        
        // Return success with redirect
        echo json_encode([
            'status' => 'success', 
            'message' => 'Account created successfully!',
            'redirect' => '../../frontend/html/dashboard.html'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => "Error: " . $conn->error]);
    }
} elseif ($action === 'login') {
    // Handle login
    $email = $data['email'];
    $password = $data['password'];

    $sql = "SELECT id, password FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            echo json_encode(['status' => 'success', 'message' => 'Login successful', 'redirect' => '../../frontend/html/dashboard.html']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid password...']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No user found with this email...']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}

$conn->close();
?>