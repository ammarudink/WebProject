<?php 
    require_once 'BaseService.php';
    require_once __DIR__ . '/../dao/ProductsDao.php';
    class ProductService extends BaseService{
        private $productsDao;

        public function __construct() {
            $this->productsDao = new ProductsDao();
            parent::__construct($this->productsDao);
        }

        public function getByProductName($productName) {
            return $this->productsDao->getByProductName($productName);
        }

        public function getByOnSale($onSale) {
            return $this->productsDao->getByOnSale($onSale);
        }

        public function getDashboardProducts() {
            return $this->productsDao->getDashboardProducts();
        }

        public function getPaginatedProducts($offset, $limit) {
            return $this->productsDao->getPaginatedProducts($offset, $limit);
        }

        public function getTotalProducts() {
            return $this->productsDao->getTotalProducts();
        }

        public function getOnSaleProducts() {
            return $this->productsDao->getOnSaleProducts();
        }

        public function getPaginatedProductsByCategories($offset, $limit, $categories) {
            return $this->productsDao->getPaginatedProductsByCategories($offset, $limit, $categories);
        }

        public function getTotalProductsByCategories($categories) {
            return $this->productsDao->getTotalProductsByCategories($categories);
        }

        public function fetchCategories() {
            return $this->productsDao->fetchCategories();
        }

        public function getProductById($productId) {
            return $this->productsDao->getProductById($productId);
        }

        public function getProductDetails($productId) {
            return $this->productsDao->getProductDetails($productId);
        }

        public function getRelatedProducts($productId) {
            return $this->productsDao->getRelatedProducts($productId);
        }
    }
?>