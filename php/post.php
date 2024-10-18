<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// MySQL接続
$mysqli = new mysqli("mysql", "user", "password", "keijiban");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// OPTIONSリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    //入力値の取得
    $author_name = $_POST['author_name'] ?? '';
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';

    // ブレースホルダーを使ったクエリの準備
    $stmt = $mysqli->prepare("INSERT INTO posts (author_name, title, content) VALUES (?, ?, ?)");
    if (!$stmt) {
      echo json_encode(['message' => '処理できませんでした。: ' . $mysqli->error]);
      exit;
    }
    $stmt->bind_param("sss", $author_name, $title, $content);

    if($stmt->execute()){
      echo json_encode(['message' => 'メッセージを送信しました。']);  
    } else {
      echo json_encode(['message' => 'メッセージが送れませんでした。', 'error' => $stmt->error]);
    }
    
    $stmt->close();
}

$mysqli->close();
?>