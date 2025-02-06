<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

include 'DatabaseConnecton.php';
$objDb = new DatabaseConnecton;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', $_SERVER['REQUEST_URI']);
if ($path[3] == 'login') {
    $user = json_decode(file_get_contents('php://input'));
    $sql = 'SELECT UserID,FirstName FROM Users WHERE email = :email AND password = :password';
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $user->email, PDO::PARAM_STR);
    $stmt->bindParam(':password', $user->password, PDO::PARAM_STR);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($users)) {
        echo json_encode($users[0]);
    } else {
        echo json_encode(['UserID' => null]);
    }
    return;
} else if ($path[3] == 'register') {
    $formData = json_decode(file_get_contents('php://input'));
    $sql = 'INSERT INTO Users (UserID, FirstName, LastName, Email, Mobile, City, Country, Password) 
            VALUES (null, :name, :last_name, :email, :mobile, :city, :country, :password)';
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $formData->firstName);
    $stmt->bindParam(':email', $formData->email);
    $stmt->bindParam(':mobile', $formData->mobile);
    $stmt->bindParam(':password', $formData->password);
    $stmt->bindParam(':last_name', $formData->lastName);
    $stmt->bindParam(':city', $formData->city);
    $stmt->bindParam(':country', $formData->country);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Record created successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to create record.'];
    }

    echo json_encode($response);
    return;
}  else if ($path[3] == 'dashboard') {
    $formData = json_decode(file_get_contents('php://input'));
    $sql = 'INSERT INTO Users (UserID, FirstName, LastName, Email, Mobile, City, Country, Password) 
            VALUES (null, :name, :last_name, :email, :mobile, :city, :country, :password)';
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $formData->firstName);
    $stmt->bindParam(':email', $formData->email);
    $stmt->bindParam(':mobile', $formData->mobile);
    $stmt->bindParam(':password', $formData->password);
    $stmt->bindParam(':last_name', $formData->lastName);
    $stmt->bindParam(':city', $formData->city);
    $stmt->bindParam(':country', $formData->country);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Record created successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to create record.'];
    }

    echo json_encode($response);
    return;
}


switch ($method) {
    case 'GET':
        $user = json_decode(file_get_contents('php://input'));
        $sql = 'SELECT id FROM users  WHERE email = :email and password =:password';
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $user->email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $user->password, PDO::PARAM_STR);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($users);
        break;
    case 'POST':
        $user = json_decode(file_get_contents('php://input'));
        $sql = 'INSERT INTO users (id, name, last_name, email, mobile, created_at, password) VALUES (null, :name, :last_name, :email, :mobile, :created_at, :password)';
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':name', $user->firstName);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':mobile', $user->mobile);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':password', $user->password);
        $stmt->bindParam(':last_name', $user->lastName);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);

        break;

    case 'PUT':
        $user = json_decode(file_get_contents('php://input'));
        $sql = 'UPDATE users SET name= :name, email =:email, mobile =:mobile, updated_at =:updated_at WHERE id = :id';
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':mobile', $user->mobile);
        $stmt->bindParam(':updated_at', $updated_at);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case 'DELETE':
        $sql = 'DELETE FROM users WHERE id = :id';
        $path = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $path[3]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}