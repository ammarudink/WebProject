<?php
    require_once 'BaseService.php';
    require_once 'dao/WishlistDao.php';
    class WishlistService extends BaseService {
        private $wishlistDao;

        public function __construct() {
            $this->wishlistDao = new WishlistDao();
            parent::__construct($this->wishlistDao);
        }

        public function getByUserId($userId) {
            return $this->wishlistDao->getByUserId($userId);
        }
    }
?>
