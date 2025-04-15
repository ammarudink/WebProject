<?php
    require_once 'BaseDao.php';

    class UserDao extends BaseDao {
        public function __construct() {
            parent::__construct("users");
        }

        public function getByEmail($email) {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE Email = :Email");
            $stmt->bindParam(':Email', $email);
            $stmt->execute();
            return $stmt->fetch();
        }

        public function getById($id) {
            $stmt = $this->connection->prepare("SELECT UserID, Name, Email, Address, Role FROM users WHERE UserID = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch();
        }

        public function getLastInsertId() {
            return $this->connection->lastInsertId();
        }
    }
?>
