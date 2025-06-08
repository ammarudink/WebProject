<?php
    require_once __DIR__ . "/config.php";

    class BaseDao {
        protected $connection;
        protected $table_name;

        public function __construct($table_name) {
        $this->table_name = $table_name;
        try {
            $this->connection = new PDO(
                "mysql:host=" . Config::DB_HOST() . ";dbname=" . Config::DB_NAME(),
                Config::DB_USER(),
                Config::DB_PASSWORD()
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    protected function getConnection() {
        return $this->connection;
    }  

        public function getAll() {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM " . $this->table_name);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAll(): " . $e->getMessage());
            throw $e;
        }
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
            try {
                $fields = [];
                foreach ($data as $key => $value) {
                    $fields[] = "$key = :$key";
                }
                $fields = implode(", ", $fields);
                $sql = "UPDATE " . $this->table_name . " SET $fields WHERE ProductID = :id";
                error_log("Update SQL: " . $sql);
                error_log("Update data: " . json_encode($data));
                $stmt = $this->connection->prepare($sql);
                foreach ($data as $key => $value) {
                    $stmt->bindValue(":$key", $value);
                }
                $stmt->bindValue(':id', $id, PDO::PARAM_INT);
                return $stmt->execute();
            } catch (PDOException $e) {
                error_log("Update error: " . $e->getMessage());
                throw $e;
            }
        }

        public function delete($id) {
            $stmt = $this->connection->prepare("DELETE FROM " . $this->table . " WHERE UserID = :UserID");
            $stmt->bindParam(':UserID', $id);
            return $stmt->execute();
        }

        public function query_unique($query, $params) {
            $stmt = $this->connection->prepare($query);
            $stmt->execute($params);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
?>