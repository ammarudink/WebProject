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
    }
?>
