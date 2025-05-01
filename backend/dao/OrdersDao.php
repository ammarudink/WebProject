<?php
    require_once 'BaseDao.php';
    class OrdersDao extends BaseDao {
        public function __construct() {
            parent::__construct("orders");
        }

        public function createOrder($userId, $totalAmount) {
            $stmt = $this->connection->prepare("INSERT INTO orders (UserID, TotalAmount, Status) VALUES (:UserID, :TotalAmount, 'Pending')");
            $stmt->bindParam(':UserID', $userId);
            $stmt->bindParam(':TotalAmount', $totalAmount);
            return $stmt->execute();
        }

        public function getOrdersByUserId($userId) {
            $stmt = $this->connection->prepare("SELECT * FROM orders WHERE UserID = :UserID ORDER BY OrderID DESC");
            $stmt->bindParam(':UserID', $userId);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
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