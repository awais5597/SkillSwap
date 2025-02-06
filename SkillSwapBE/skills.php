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
if ($path[3] == 'addSkill') {
    $data = json_decode(file_get_contents('php://input'));
    $skillsArray = $data->skillData; // Get the array of skills
    $UserID = $data->UserID; // Get the user ID
    $success = 0;
    $alreadyExists = 0;
    $failure = 0;
    $responses = [];
    foreach ($skillsArray as $skillData) {
        $Name = $skillData;
        // Check if the skill is present in the skills table
        $checkSkillSql = 'SELECT SkillID FROM skills WHERE Name = :Name';
        $stmt = $conn->prepare($checkSkillSql);
        $stmt->bindParam(':Name', $Name);
        $stmt->execute();
        $result = $stmt->fetch();
        if ($result) {
            $skillID = $result['SkillID'];
        } else {
            // Skill doesn't exist, insert it into the skills table
            $insertSkillSql = 'INSERT INTO skills (Name) VALUES (:Name)';
            $stmt = $conn->prepare($insertSkillSql);
            $stmt->bindParam(':Name', $Name);
            $stmt->execute();
            $skillID = $conn->lastInsertId();
        }
        // Check if the skill-user combination already exists in userSkills
        $checkSkillUserSql = 'SELECT SkillID FROM userSkills WHERE SkillID = :skillID AND UserID = :UserID';
        $stmt = $conn->prepare($checkSkillUserSql);
        $stmt->bindParam(':skillID', $skillID);
        $stmt->bindParam(':UserID', $UserID);
        $stmt->execute();
        $result = $stmt->fetch();
        if ($result) {
            // Skill-user combination already exists, skip insertion
            $alreadyExists++;
        } else {
            // Insert the skill ID and user ID into userSkills
            $insertSkillUserSql = 'INSERT INTO userSkills (SkillID, UserID) VALUES (:skillID, :UserID)';
            $stmt = $conn->prepare($insertSkillUserSql);
            $stmt->bindParam(':skillID', $skillID);
            $stmt->bindParam(':UserID', $UserID);
            if ($stmt->execute()) {
                $success++;
            } else {
                $failure++;
            }
        }
    }
    echo json_encode(['success' => $success, 'failure' => $failure, 'alreadyExists' => $alreadyExists]);
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

    $insertRequestSql = 'INSERT INTO requests (user1UserID, user1skillid, user2UserID, user2skillid, accepted, startDate, EndDate, selectedDuration) VALUES (:user1UserID, :user1SkillID, :user2UserID, :user2SkillID, 0, NULL, NULL, :selectedDuration)';

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
} else
    echo $path[3];