<?php
class Task {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($title, $description, $parent_id = null) {
        $sql = "INSERT INTO tasks (title, description, is_done, parent_id) VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);

        try {
            $stmt->execute([$title, $description, 0, $parent_id]);
            return [
                'status' => 'success',
                'message' => 'Задача создана',
                'data' => ['id' => $this->pdo->lastInsertId()]
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Ошибка при создании задачи: ' . $e->getMessage()
            ];
        }
    }

    public function getAllTasks() {
        $sql = "SELECT id, title, description, is_done, parent_id FROM tasks ORDER BY parent_id ASC, id ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        return [
            'status' => 'success',
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ];
    }

    public function edit($id, $title, $description) {
        $sql = "UPDATE tasks SET title = ?, description = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        try {
            $stmt->execute([$title, $description, $id]);
            return [
                'status' => 'success',
                'message' => 'Задача отредактирована'
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Ошибка при редактировании: ' . $e->getMessage()
            ];
        }
    }

    public function markAsDone($id, $is_done) {
        $sql = "UPDATE tasks SET is_done = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);

        try {
            $stmt->execute([$is_done ? 1 : 0, $id]);
            return [
                'status' => 'success',
                'message' => 'Статус задачи обновлён'
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Ошибка при обновлении статуса: ' . $e->getMessage()
            ];
        }
    }

    public function delete($id) {
        $sql = "DELETE FROM tasks WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        try {
            $stmt->execute([$id]);
            return [
                'status' => 'success',
                'message' => 'Задача удалена'
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
}
?>