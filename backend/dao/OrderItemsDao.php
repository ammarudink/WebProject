<?php
    require_once 'BaseDao.php';
    class OrderItemsDao extends BaseDao {
        public function __construct() {
            parent::__construct("orderitems");
        }

        public function getByOrderId($orderId) {
            $stmt = $this->connection->prepare("select * from orderitems where OrderID = :OrderID");
            $stmt->bindParam(':OrderID', $orderId);
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getByProductId($productId){
            $stmt = $this->connection->prepare("select * from orderitems where ProductID = :ProductID");
            $stmt->bindParam(':ProductID', $productId);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }
?>