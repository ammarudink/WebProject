<?php
    require_once 'BaseDao.php';

    class WishlistDao extends BaseDao {
        public function __construct() {
            parent::__construct("wishlist");
        }

        public function getByUserId($userId) {
            $stmt = $this->connection->prepare("select * from wishlist where UserID = :UserID");
            $stmt->bindParam(':UserID', $userId);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }
?>