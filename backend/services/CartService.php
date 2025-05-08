<?php
    require_once 'BaseService.php';
    require_once 'dao/CartDao.php';
    class CartService extends BaseService {
        private $cartDao;

        public function __construct() {
            $this->cartDao = new CartDao();
            parent::__construct($this->cartDao);
        }

        public function getByUserId($userId) {
            return $this->cartDao->getByUserId($userId);
        }

        public function getByAddedAt($addedAt) {
            return $this->cartDao->getByAddedAt($addedAt);
        }
    }
?>