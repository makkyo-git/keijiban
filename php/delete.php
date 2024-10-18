<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$mysqli = new mysqli("mysql", "user", "password", "keijiban");

if ($mysqli->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $mysqli->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_id = isset($_POST['post_id']) ? (int)$_POST['post_id'] : 0;
    
    if ($post_id > 0) {
        if ($mysqli->query("DELETE FROM posts WHERE post_id = $post_id")) {
            echo json_encode(["message"=> "削除成功"]);
        } else {
            echo json_encode(["error" => "削除失敗"]);
        }
    } else {
        echo json_encode(["error" => "無効なID"]);
    }
} else {
    echo json_encode(["error" => "無効なリクエスト"]);
}

$mysqli->close();
?>