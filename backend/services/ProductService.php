<?php 
    require_once 'BaseService.php';
    require_once 'dao/ProductDao.php';
    class ProductService extends BaseService{
        private $productDao;

        public function __construct() {
            $this->productDao = new ProductDao();
            parent::__construct($this->productDao);
        }

        public function getByProductName($productName) {
            return $this->productDao->getByProductName($productName);
        }

        public function getByOnSale($onSale) {
            return $this->productDao->getByOnSale($onSale);
        }

        public function getDashboardProducts() {
            return $this->productDao->getDashboardProducts();
        }

        public function getPaginatedProducts($offset, $limit) {
            return $this->productDao->getPaginatedProducts($offset, $limit);
        }

        public function getTotalProducts() {
            return $this->productDao->getTotalProducts();
        }

        public function getOnSaleProducts() {
            return $this->productDao->getOnSaleProducts();
        }

        public function getPaginatedProductsByCategories($offset, $limit, $categories) {
            return $this->productDao->getPaginatedProductsByCategories($offset, $limit, $categories);
        }

        public function getTotalProductsByCategories($categories) {
            return $this->productDao->getTotalProductsByCategories($categories);
        }

        public function fetchCategories() {
            return $this->productDao->fetchCategories();
        }

        public function getProductById($productId) {
            return $this->productDao->getProductById($productId);
        }

        public function getProductDetails($productId) {
            return $this->productDao->getProductDetails($productId);
        }

        public function getRelatedProducts($productId) {
            return $this->productDao->getRelatedProducts($productId);
        }
    }
?>