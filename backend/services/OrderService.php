<?php
    require_once 'BaseService.php';
    require_once 'dao/OrdersDao.php';
    class OrderService extends BaseService {
        private $ordersDao;

        public function __construct() {
            $this->ordersDao = new OrdersDao();
            parent::__construct($this->ordersDao);
        }

        public function getByUserId($userId) {
            return $this->ordersDao->getByUserId($userId);
        }

        public function getByStatus($status) {
            return $this->ordersDao->getByStatus($status);
        }

        public function createOrder($userId, $totalAmount) {
            return $this->ordersDao->createOrder($userId, $totalAmount);
        }
    }
?>
