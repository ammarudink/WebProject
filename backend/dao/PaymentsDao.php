<?php
    require_once 'BaseDao.php';
    class PaymentsDao extends BaseDao{
        public function __construct(){
            parent::__construct("payments");
        }

        public function getByOrderId($orderId){
            $stmt = $this->connection->prepare("select * from payments where OrderID = :OrderID");
            $stmt->bindParam(':OrderID', $orderId);
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getByPaymentId($paymentId){
            $stmt = $this->connection->prepare("select * from payments where PaymentID = :PaymentID");
            $stmt->bindParam(':PaymentID', $paymentId);
            $stmt->execute();
            return $stmt->fetch();
        }
    }
?>