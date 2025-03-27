<?php
    require_once 'BaseDao.php';
    class ProductsDao extends BaseDao {
        public function __construct() {
            parent::__construct("products");
        }

        public function getByProductName($productName) {
            $stmt = $this->connection->prepare("select * from products where ProductName = :ProductName");
            $stmt->bindParam(':ProductName', $productName);
            $stmt->execute();
            return $stmt->fetch();
        }

        public function getByCategoryId($categoryId ) {
            $stmt = $this->connection->prepare("select * from products where CategoryID = :CategoryID");
            $stmt->bindParam(':CategoryID', $categoryId);
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getByOnSale($onSale) {
            $stmt = $this->connection->prepare("select * from products where OnSale = :OnSale");
            $stmt->bindParam(':OnSale', $onSale);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }
?>