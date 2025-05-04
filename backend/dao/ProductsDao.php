<?php
    require_once 'BaseDao.php';
    class ProductsDao extends BaseDao {
        public function __construct() {
            parent::__construct("products");
        }

        public function getByProductName($name) {
            $stmt = $this->connection->prepare("SELECT * FROM products WHERE Name LIKE :name");
            $searchName = "%".$name."%";
            $stmt->bindParam(':name', $searchName);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getByOnSale($onSale) {
            $stmt = $this->connection->prepare("select * from products where OnSale = :OnSale");
            $stmt->bindParam(':OnSale', $onSale);
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getDashboardProducts() {
            $stmt = $this->connection->prepare("SELECT * FROM products ORDER BY ProductID DESC LIMIT 8");
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            error_log("Fetched products: " . json_encode($products)); // Log the fetched products
            return $products;
        }

        public function getPaginatedProducts($offset, $limit) {
            $stmt = $this->connection->prepare("SELECT ProductID, Name, Price, SalePrice, Category, Images, Description FROM products ORDER BY ProductID LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getTotalProducts() {
            $stmt = $this->connection->prepare("SELECT COUNT(*) as total FROM products");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? (int)$result['total'] : 0; // Ensure an integer is returned
        }

        public function getOnSaleProducts() {
            $stmt = $this->connection->prepare("SELECT * FROM products WHERE SalePrice IS NOT NULL");
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function getPaginatedProductsByCategories($offset, $limit, $categories) {
            $placeholders = rtrim(str_repeat('?,', count($categories)), ',');
            $sql = "SELECT * FROM products WHERE Category IN ($placeholders) ORDER BY ProductID LIMIT ? OFFSET ?";
            
            try {
                $stmt = $this->connection->prepare($sql);
                
                // Bind all category values first
                foreach($categories as $key => $category) {
                    $stmt->bindValue($key + 1, $category, PDO::PARAM_STR);
                }
                
                // Bind limit and offset last
                $stmt->bindValue(count($categories) + 1, $limit, PDO::PARAM_INT);
                $stmt->bindValue(count($categories) + 2, $offset, PDO::PARAM_INT);
                
                $stmt->execute();
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) {
                error_log("Error in getPaginatedProductsByCategories: " . $e->getMessage());
                return [];
            }
        }

        public function getTotalProductsByCategories($categories) {
            $placeholders = rtrim(str_repeat('?,', count($categories)), ',');
            $sql = "SELECT COUNT(*) as total FROM products WHERE Category IN ($placeholders)";
            
            try {
                $stmt = $this->connection->prepare($sql);
                
                foreach($categories as $key => $category) {
                    $stmt->bindValue($key + 1, $category, PDO::PARAM_STR);
                }
                
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return $result ? (int)$result['total'] : 0; // Ensure an integer is returned
            } catch (Exception $e) {
                error_log("Error in getTotalProductsByCategories: " . $e->getMessage());
                return 0;
            }
        }

        public function fetchCategories() {
            $stmt = $this->connection->prepare("SELECT DISTINCT Category FROM products");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_COLUMN);
        }

        public function getProductById($productId) {
            $stmt = $this->connection->prepare("SELECT * FROM products WHERE ProductID = :ProductID");
            $stmt->bindParam(':ProductID', $productId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function getProductDetails($productId) {
            $stmt = $this->connection->prepare("SELECT ProductID, Name, Price, SalePrice, Category, Images, Description FROM products WHERE ProductID = :ProductID");
            $stmt->bindParam(':ProductID', $productId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function getRelatedProducts($category, $excludeProductId) {
            $stmt = $this->connection->prepare("SELECT ProductID, Name, Price, SalePrice, Category, Images, Description FROM products WHERE Category = :Category AND ProductID != :ExcludeProductID LIMIT 4");
            $stmt->bindParam(':Category', $category, PDO::PARAM_STR);
            $stmt->bindParam(':ExcludeProductID', $excludeProductId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
?>