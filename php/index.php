<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("mysql", "user", "password", "keijiban");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// ページネーションの作成
$limit = 3;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// 投稿の取得
$result = $mysqli->query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
if (!$result) {
    die("クエリエラー: " . $mysqli->error);
}

$total_posts_result = $mysqli->query("SELECT COUNT(*) FROM posts");
$total_posts = $total_posts_result->fetch_row()[0];
$total_pages = ceil($total_posts / $limit);

// 取得したデータを配列に格納
$posts = [];
while ($row = $result->fetch_assoc()) {
    // post_idを整数に変換
    $row['post_id'] = (int)$row['post_id'];
    $posts[] = $row;
}

// JSON形式でレスポンスを返す
echo json_encode([
    'posts' => $posts,
    'message' => isset($_GET['message']) ? htmlspecialchars($_GET['message']) : '',
    'total_pages' => max(1, $total_pages),// 総ページを追加
])
?>

