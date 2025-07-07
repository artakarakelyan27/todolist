<?php
    require_once '../config/database.php';
    class Database
    {
        private $DB_HOST;
        private $DB_USER;
        private $DB_PASS;
        private $DB_NAME;

        public function __construct()
        {
            $this->DB_HOST = DB_HOST;
            $this->DB_USER = DB_USER;
            $this->DB_PASS = DB_PASS;
            $this->DB_NAME = DB_NAME;
        }
        public function getPDO(){
            try {
                $pdo = new PDO (
                    "mysql:host={$this->DB_HOST};dbname={$this->DB_NAME}",
                    $this->DB_USER,
                    $this->DB_PASS
                );
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $pdo;
            }
            catch (PDOException $e){
                die('ошбка: '.$e->getMessage());
            }
        }

    }
?>