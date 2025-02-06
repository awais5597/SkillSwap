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
if ($path[3] == 'mysentrequests') {
    $data = json_decode(file_get_contents('php://input'));
    $User1ID = $data->UserID; // Assuming you have the user's ID in the request payload

    // Define the SQL query
    $sql = "SELECT
        r.requestid,
        r.accepted,
        u1.FirstName AS user1name,
        u2.FirstName AS user2name,
        s1.Name AS user1skill,
        s2.Name AS user2skill
    FROM
        requests r
    JOIN
        users u1 ON r.user1UserID = u1.UserID
    JOIN
        users u2 ON r.user2UserID = u2.UserID
    JOIN
        skills s1 ON r.user1skillid = s1.SkillID
    JOIN
        skills s2 ON r.user2skillid = s2.SkillID
    WHERE
        r.user1UserID = :User1ID";

    // Prepare and execute the SQL query
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':User1ID', $User1ID, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the results as an array of user1name, user2name, user1skill, and user2skill combinations
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode($result);
    return;

} else if ($path[3] == 'myreceivedrequests') {
    $data = json_decode(file_get_contents('php://input'));
    $UserID = $data->UserID; // Assuming you have the user's ID in the request payload

    // Define the SQL query
    $sql = "SELECT
        r.requestid,
        r.accepted,
        u1.FirstName AS user1name,
        u2.FirstName AS user2name,
        s1.Name AS user1skill,
        s2.Name AS user2skill
    FROM
        requests r
    JOIN
        users u1 ON r.user1UserID = u1.UserID
    JOIN
        users u2 ON r.user2UserID = u2.UserID
    JOIN
        skills s1 ON r.user1skillid = s1.SkillID
    JOIN
        skills s2 ON r.user2skillid = s2.SkillID
    WHERE
        r.user2UserID = :UserID";

    // Prepare and execute the SQL query
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':UserID', $UserID, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the results as an array of user1name, user2name, user1skill, and user2skill combinations
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode($result);
    return;

} else if ($path[3] == 'dashboard') {
    $data = json_decode(file_get_contents('php://input'));
    $UserID = $data->UserID; // Assuming you have the user's ID in the request payload
    // SQL query to retrieve username-skill combinations for a specific user
    $sql = "SELECT users.FirstName AS UserName,users.UserID as UserID, skills.Name AS SkillName, skills.SkillID AS SkillID
            FROM userskills
            INNER JOIN users ON userskills.UserID = users.UserID
            INNER JOIN skills ON userskills.SkillID = skills.SKILLID";

    // Prepare and execute the SQL query
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch the results as an array of username-skill combinations
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode($result);
    return;
} else if ($path[3] == 'sendRequest') {
    $data = json_decode(file_get_contents('php://input'));
    $user1UserID = $data->user1UserID;
    $user1SkillID = $data->user1SkillID;
    $user2UserID = $data->user2UserID;
    $user2SkillID = $data->user2SkillID;
    $selectedDuration = $data->selectedDuration;
    $insertRequestSql = 'INSERT INTO requests (user1UserID, user1skillid, user2UserID, user2skillid, accepted, startDate, EndDate) VALUES (:user1UserID, :user1SkillID, :user2UserID, :user2SkillID, 0, NOW(), DATE_ADD(NOW(), INTERVAL :selectedDuration WEEK))';
    $stmt = $conn->prepare($insertRequestSql);
    $stmt->bindParam(':user1UserID', $user1UserID);
    $stmt->bindParam(':user1SkillID', $user1SkillID);
    $stmt->bindParam(':user2UserID', $user2UserID);
    $stmt->bindParam(':user2SkillID', $user2SkillID);
    $stmt->bindParam(':selectedDuration', $selectedDuration);

    if ($stmt->execute()) {
        echo json_encode(['status' => 1, 'message' => 'Request sent successfully.']);
    } else {
        echo json_encode(['status' => 0, 'message' => 'Failed to send request.']);
    }
    return;
} else if ($path[3] == 'inProgress') {
    $data = json_decode(file_get_contents('php://input'));
    $UserID = $data->UserID; // Assuming you have the user's ID in the request payload

    // Define the SQL query
    $sql = "SELECT
    u2.FirstName AS user2name,
    s2.Name AS user2skill,
    r.startDate AS startDate,
    r.EndDate AS endDate,
    r.requestid AS requestId

    FROM
        requests r
    JOIN
        users u1 ON r.user1UserID = u1.UserID
    JOIN
        users u2 ON r.user2UserID = u2.UserID
    JOIN
        skills s1 ON r.user1skillid = s1.SkillID
    JOIN
        skills s2 ON r.user2skillid = s2.SkillID
    WHERE
        (r.user2UserID = :UserID OR r.user1UserID = :UserID) AND r.accepted = 1";


    // Prepare and execute the SQL query
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':UserID', $UserID, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the results as an array of user1name, user2name, user1skill, and user2skill combinations
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode($result);
    return;

} else if ($path[3] == 'acceptRequest' || $path[3] == 'rejectRequest') {
    $data = json_decode(file_get_contents('php://input'));
    $requestid = $data->requestId;
    if ($path[3] == 'acceptRequest') {
        $insertRequestSql = 'UPDATE requests SET accepted = 1, startDate = NOW(), EndDate = DATE_ADD(NOW(), INTERVAL selectedDuration WEEK) WHERE requestid = :requestid';
    } else {
        $insertRequestSql = 'UPDATE requests SET accepted = -1, startDate = NOW(), EndDate = DATE_ADD(NOW(), INTERVAL selectedDuration WEEK) WHERE requestid = :requestid';
    }
    $stmt = $conn->prepare($insertRequestSql);
    $stmt->bindParam(':requestid', $requestid);

    if ($stmt->execute()) {
        echo json_encode(['status' => 1, 'message' => 'Request processed successfully.']);
    } else {
        echo json_encode(['status' => 0, 'message' => 'Failed to process request.']);
    }
    return;
} else if ($path[3] == 'chats') {
    $data = json_decode(file_get_contents('php://input'));
    $requestid = $data->requestid;
    $insertRequestSql = 'SELECT chats FROM requests WHERE requestid = :requestid';
    $stmt = $conn->prepare($insertRequestSql);
    $stmt->bindParam(':requestid', $requestid);

    $stmt->execute();

    // Fetch the results as an array of user1name, user2name, user1skill, and user2skill combinations
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode($result);
    return;
} else if ($path[3] == 'sendMessage') {
    $data = json_decode(file_get_contents('php://input'));
    $requestid = $data->requestid;
    $newChatMessage = $data->chat;

    // First, fetch the existing chats from the database for the specified requestid
    $fetchChatsSql = 'SELECT chats FROM requests WHERE requestid = :requestid';
    $fetchStmt = $conn->prepare($fetchChatsSql);
    $fetchStmt->bindParam(':requestid', $requestid);
    $fetchStmt->execute();
    $existingChats = $fetchStmt->fetchColumn();

    if ($existingChats === false) {
        // Handle error, request not found, or other appropriate error handling
    } else {
        // Decode the JSON string into a PHP array
        $existingChatsArray = json_decode($existingChats, true);

        // Append the new chat message to the existing chats array
        $existingChatsArray[] = $newChatMessage;

        // Encode the updated chats array back to JSON
        $updatedChats = json_encode($existingChatsArray);

        // Update the row in the database with the updated chats
        $updateChatsSql = 'UPDATE requests SET chats = :chats WHERE requestid = :requestid';
        $updateStmt = $conn->prepare($updateChatsSql);
        $updateStmt->bindParam(':requestid', $requestid);
        $updateStmt->bindParam(':chats', $updatedChats);

        if ($updateStmt->execute()) {
            // Successful update
            echo json_encode(['status' => 1, 'message' => 'Chat message added successfully.']);
        } else {
            // Handle the update error
            echo json_encode(['status' => 0, 'message' => 'Failed to add chat message.']);
        }
    }
} else
    echo $path[3];