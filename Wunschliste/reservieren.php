<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("wunschliste.json"), true);
$post = json_decode(file_get_contents("php://input"), true);

if (!isset($post['id'])) {
    echo json_encode(["error" => "Keine Geschenk-ID erhalten."]);
    exit;
}

$id = $post['id'];
$updated = false;

foreach ($data as &$item) {
    if ($item['id'] === $id) {
        $item['reserved'] = true;
        $updated = true;
        break;
    }
}

if ($updated) {
    file_put_contents("wunschliste.json", json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Geschenk nicht gefunden."]);
}
?>