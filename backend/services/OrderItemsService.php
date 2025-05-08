<?php
    require_once 'BaseService.php';
    require_once 'dao/OrderItemsDao.php';
    class OrderItemsService extends BaseService {
        private $orderItemsDao;

        public function __construct() {
            $this->orderItemsDao = new OrderItemsDao();
            parent::__construct($this->orderItemsDao);
        }

        public function getByOrderId($orderId) {
            return $this->orderItemsDao->getByOrderId($orderId);
        }

        public function getByProductId($productId) {
            return $this->orderItemsDao->getByProductId($productId);
        }
    }
?>