<?php
class SubTask{
    private $pdo;
    public function __construct($pdo){
        $this->pdo = $pdo;
    }
    public function create($title, $description, $parent_id) {
        $sql = "INSERT INTO subtasks (title, description, is_done, parent_id) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        try {
            $stmt->execute([$title, $description, 0]);
            return $this->pdo->lastInsertId();
        }catch (PDOException $e){
            die('ошбка: '.$e->getMessage());
        }
    }
    public function getAllSubTasks(){
        $sql = "SELECT * FROM subtasks";
        $stmt = $this->pdo->prepare($sql);
        try {
            $stmt->execute();
            return
                [
                    'status' => 'success',
                    'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)

                ];
        }catch (PDOException $e){
            return
                [
                    'status' => 'error',
                    'message' => 'ошибка при плучении'
                ];
        }

    }

}
?>