<?php
header('Content-Type: application/json');
$REQUEST_METHOD = $_SERVER['REQUEST_METHOD'];
$jsonData = json_decode(file_get_contents('php://input') ?? '', true);

require_once '../lib/database.php';
require_once '../class/task.php';

$db = new Database();
$el = new Task($db->getPDO());

function callback($response) {
    return json_encode([
        'status' => $response['status'] ?? 'error',
        'message' => $response['message'] ?? '',
        'data' => $response['data'] ?? null
    ]);
}

switch ($REQUEST_METHOD) {
    case 'POST':
        $taskTitle = trim($jsonData['title'] ?? '');
        $taskDescription = trim($jsonData['description'] ?? '');
        $parent_id = isset($jsonData['parentID']) && $jsonData['parentID'] !== '' ? (int)$jsonData['parentID'] : null;

        if (isset($jsonData['title']) && empty($taskTitle)) {
            echo callback(['status' => 'error', 'message' => 'Название задачи не может быть пустым']);
            exit;
        }
        if (isset($jsonData['title']) && strlen($taskTitle) > 255) {
            echo callback(['status' => 'error', 'message' => 'Название задачи не может превышать 255 символов']);
            exit;
        }

        echo callback($el->create($taskTitle, $taskDescription, $parent_id));
        break;

    case 'GET':
        echo callback($el->getAllTasks());
        break;

    case 'PATCH':
        $taskID = isset($jsonData['id']) && is_numeric($jsonData['id']) ? (int)$jsonData['id'] : null;
        $taskTitle = trim($jsonData['title'] ?? '');
        $taskDescription = trim($jsonData['description'] ?? '');
        $is_done = isset($jsonData['is_done']) ? (bool)$jsonData['is_done'] : null;

        if (isset($jsonData['title']) && empty($taskTitle)) {
            echo callback(['status' => 'error', 'message' => 'Название задачи не может быть пустым']);
            exit;
        }
        if (isset($jsonData['title']) && strlen($taskTitle) > 255) {
            echo callback(['status' => 'error', 'message' => 'Название задачи не может превышать 255 символов']);
            exit;
        }
        if ($taskID === null) {
            echo callback(['status' => 'error', 'message' => 'ID задачи обязателен']);
            exit;
        }

        if ($is_done !== null) {
            echo callback($el->markAsDone($taskID, $is_done));
        } else {
            echo callback($el->edit($taskID, $taskTitle, $taskDescription));
        }
        break;

    case 'DELETE':
        $taskID = isset($jsonData['id']) && is_numeric($jsonData['id']) ? (int)$jsonData['id'] : null;
        if ($taskID === null) {
            echo callback(['status' => 'error', 'message' => 'ID задачи обязателен']);
            exit;
        }

        echo callback($el->delete($taskID));
        break;

    default:
        echo callback(['status' => 'error', 'message' => 'Неподдерживаемый метод запроса']);
        break;
}
?>