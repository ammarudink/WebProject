<?php
    require_once 'BaseDao.php';
    class OrdersDao extends BaseDao {
        public function __construct() {
            parent::__construct("orders");
        }

        public function getByUserId($userId) {
            $stmt = $this->connection->prepare("select * from orders where UserID = :UserID");
            $stmt->bindParam(':UserID', $userId);
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getByStatus($status){
            $stmt = $this->connection->prepare("select * from orders where Status = :Status");
            $stmt->bindParam(':Status', $status);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }
?>