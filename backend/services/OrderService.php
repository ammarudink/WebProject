<?php
    require_once 'BaseService.php';
    require_once 'dao/OrderDao.php';
    class OrderService extends BaseService {
        private $orderDao;

        public function __construct() {
            $this->orderDao = new OrderDao();
            parent::__construct($this->orderDao);
        }

        public function getByUserId($userId) {
            return $this->orderDao->getByUserId($userId);
        }

        public function getByStatus($status) {
            return $this->orderDao->getByStatus($status);
        }
    }
?>
