<?php
    require_once 'BaseDao.php';
    class CartDao extends BaseDao {
        public function __construct() {
            parent::__construct("cart");
        }

        public function getByUserId($userId) {
            $stmt = $this->connection->prepare("select * from cart where UserID = :UserID");
            $stmt->bindParam(':UserID', $userId);
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getByAddedAt($addedAt){
            $stmt = $this->connection->prepare("select * from cart where AddedAt = :AddedAt");
            $stmt->bindParam(':AddedAt', $addedAt);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }
?>