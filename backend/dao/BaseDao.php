<?php
    require_once __DIR__ . "/config.php";

    class BaseDao {
        protected $table;
        protected $connection; 

        public function __construct($table) {
            $this->table = $table;
            $this->connection = Database::connect();
            if (!$this->connection) {
                error_log("Database connection failed.");
            } else {
                error_log("Database connection successful.");
            }
        }

        public function getAll() {
            $stmt = $this->connection->prepare("SELECT * FROM " . $this->table);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC); 
        }

        public function getById($id) {
            $stmt = $this->connection->prepare("SELECT * FROM " . $this->table . " WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch();
        }

        public function insert($data) {
            $columns = implode(", ", array_keys($data));
            $placeholders = ":" . implode(", :", array_keys($data));
            $sql = "INSERT INTO " . $this->table . " ($columns) VALUES ($placeholders)";
            $stmt = $this->connection->prepare($sql);
            return $stmt->execute($data);
        }

        public function update($id, $data) {
            $fields = "";
            foreach ($data as $key => $value) {
                $fields .= "$key = :$key, ";
            }
            $fields = rtrim($fields, ", ");
            $sql = "UPDATE " . $this->table . " SET $fields WHERE ProductID = :id"; 
            $stmt = $this->connection->prepare($sql);
            $data['id'] = $id;
            return $stmt->execute($data);
        }

        public function delete($id) {
            $stmt = $this->connection->prepare("DELETE FROM " . $this->table . " WHERE UserID = :UserID");
            $stmt->bindParam(':UserID', $id);
            return $stmt->execute();
        }
    }
?>