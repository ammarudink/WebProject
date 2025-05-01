<?php
session_start(); // Add this at the very top
require_once 'UserDao.php';
require_once 'ProductsDao.php';
require_once 'OrdersDao.php';

$userDao = new UserDao();
$productsDao = new ProductsDao();
$ordersDao = new OrdersDao();

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Add this in the POST section
    if (isset($_POST['action']) && $_POST['action'] === 'updateProduct') {
        header('Content-Type: application/json');
        
        $productData = [
            'Price' => floatval($_POST['price']),
            'SalePrice' => !empty($_POST['salePrice']) ? floatval($_POST['salePrice']) : null
        ];

        error_log("Updating product with ID: " . $_POST['productId'] . " and data: " . json_encode($productData));
        
        try {
            if ($productsDao->update($_POST['productId'], $productData)) {
                echo json_encode(['success' => true]);
            } else {
                error_log("Failed to update product in database.");
                echo json_encode(['success' => false, 'message' => 'Failed to update product']);
            }
        } catch (Exception $e) {
            error_log("Error updating product: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit();
    }

    // Modify the createOrder handler in the POST section
    if (isset($_POST['action']) && $_POST['action'] === 'createOrder') {
        header('Content-Type: application/json');
        $user = isset($_SESSION['loggedInUser']) ? $_SESSION['loggedInUser'] : 
               (isset($_COOKIE['loggedInUser']) ? json_decode($_COOKIE['loggedInUser'], true) : null);
        
        // Try to get user from localStorage through a hidden input
        if (!$user && isset($_POST['userData'])) {
            $user = json_decode($_POST['userData'], true);
        }

        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Please login to checkout']);
            exit();
        }

        try {
            $totalAmount = floatval($_POST['totalAmount']);
            if ($ordersDao->createOrder($user['UserID'], $totalAmount)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Order placed successfully!'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create order'
                ]);
            }
        } catch (Exception $e) {
            error_log("Error creating order: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Error processing order'
            ]);
        }
        exit();
    }

    // Check if this is a login request
    if (isset($_POST['email']) && isset($_POST['password'])) {
        header('Content-Type: application/json');
        try {
            $user = $userDao->getByEmail($_POST['email']);
            
            if ($user && password_verify($_POST['password'], $user['Password'])) {
                $userData = [
                    'UserID' => $user['UserID'],
                    'name' => $user['Name'],
                    'email' => $user['Email'],
                    'address' => $user['Address'],
                    'role' => $user['Role']
                ];
                echo json_encode(['success' => true, 'user' => $userData]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            }
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Login failed: ' . $e->getMessage()]);
            exit();
        }
    }
    // Existing registration code
    $userData = [
        'Name' => $_POST['Name'],
        'Email' => $_POST['Email'],
        'Password' => password_hash($_POST['Password'], PASSWORD_DEFAULT),
        'Address' => $_POST['Address'],
        'Role' => $_POST['Role']
    ];

    try {
        if($userDao->insert($userData)) {
            $userId = $userDao->getLastInsertId();
            $userForLocalStorage = [
                'UserID' => $userId,
                'name' => $_POST['Name'],
                'email' => $_POST['Email'],
                'address' => $_POST['Address'],
                'role' => $_POST['Role']
            ];
            session_start();
            $_SESSION['loggedInUser'] = $userForLocalStorage;
            header("Location: /WebProject/index.html#dashboard");
            exit();
        }
    } catch (Exception $e) {
        echo "Registration failed: " . $e->getMessage();
    }
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $UserID = $_GET['UserID'];
    error_log("Attempting to delete user ID: " . $UserID);
    
    try {
        $result = $userDao->delete($UserID);
        if($result) {
            error_log("User deleted successfully");
            header("Content-Type: application/json");
            echo json_encode(['success' => true]);
        } else {
            error_log("Delete failed");
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Delete failed']);
        }
    } catch (Exception $e) {
        error_log("Delete error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// Handle product requests
if (isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    switch ($_GET['action']) {
        case 'dashboard':
            try {
                error_log("Dashboard action triggered."); // Log action trigger
                $products = $productsDao->getDashboardProducts();
                error_log("Fetched products: " . json_encode($products)); // Log fetched products
                if (empty($products)) {
                    error_log("No products found in database.");
                    echo json_encode([]);
                } else {
                    echo json_encode($products);
                }
            } catch (Exception $e) {
                error_log("Error fetching dashboard products: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to fetch products']);
            }
            break;
            
        case 'paginated':
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = 9;
            $offset = ($page - 1) * $limit;

            $categories = isset($_GET['categories']) ? json_decode($_GET['categories'], true) : null;

            if ($categories && is_array($categories) && !empty($categories)) {
                $products = $productsDao->getPaginatedProductsByCategories($offset, $limit, $categories);
                $total = $productsDao->getTotalProductsByCategories($categories);
            } else {
                $products = $productsDao->getPaginatedProducts($offset, $limit);
                $total = $productsDao->getTotalProducts();
            }

            error_log("Paginated products: " . json_encode($products)); // Debugging log
            echo json_encode([
                'products' => $products,
                'total' => $total,
                'totalPages' => ceil($total / $limit),
                'currentPage' => $page
            ]);
            break;
            
        case 'onsale':
            echo json_encode($productsDao->getOnSaleProducts());
            break;

        // Add this in the GET section where other product actions are
        case 'getAllProducts':
            try {
                error_log("getAllProducts action triggered"); // Log action trigger
                $products = $productsDao->getAll(); // Use BaseDao's getAll method
                if ($products) {
                    error_log("Products fetched successfully: " . json_encode($products)); // Log fetched products
                    echo json_encode(['success' => true, 'products' => $products]);
                } else {
                    error_log("No products found");
                    echo json_encode(['success' => false, 'message' => 'No products found']);
                }
            } catch (Exception $e) {
                error_log("Error fetching products: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            }
            break;

        case 'getCategories':
            try {
                $categories = $productsDao->fetchCategories(); // Use the new method
                error_log("Fetched categories: " . json_encode($categories)); // Debugging log
                echo json_encode($categories);
            } catch (Exception $e) {
                error_log("Error fetching categories: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to fetch categories']);
            }
            break;

        case 'getProductDetails':
            if (isset($_GET['productId'])) {
                try {
                    $product = $productsDao->getProductDetails($_GET['productId']);
                    if ($product) {
                        echo json_encode(['success' => true, 'product' => $product]);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Product not found']);
                    }
                } catch (Exception $e) {
                    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Product ID not provided']);
            }
            break;

        case 'getRelatedProducts':
            if (isset($_GET['categoryId']) && isset($_GET['excludeProductId'])) {
                try {
                    $relatedProducts = $productsDao->getRelatedProducts($_GET['categoryId'], $_GET['excludeProductId']);
                    echo json_encode(['success' => true, 'products' => $relatedProducts]);
                } catch (Exception $e) {
                    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Category ID or Product ID not provided']);
            }
            break;
    }
    exit();
}

// Add this near other GET handlers
if (isset($_GET['action']) && $_GET['action'] === 'getProfile') {
    header('Content-Type: application/json');
    if (isset($_GET['userId'])) {
        try {
            $userData = $userDao->getById($_GET['userId']);
            if ($userData) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'name' => $userData['Name'],
                        'email' => $userData['Email'],
                        'address' => $userData['Address'],
                        'role' => $userData['Role']
                    ]
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID not provided']);
    }
    exit();
}

if (isset($_GET['action']) && $_GET['action'] === 'getProductDetails') {
    header('Content-Type: application/json');
    if (isset($_GET['productId'])) {
        try {
            $product = $productsDao->getProductById($_GET['productId']);
            if ($product) {
                error_log("Product details: " . json_encode($product)); // Log product details
                echo json_encode(['success' => true, 'product' => $product]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Product not found']);
            }
        } catch (Exception $e) {
            error_log("Error fetching product: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    } else {
        error_log("Product ID not provided");
        echo json_encode(['success' => false, 'message' => 'Product ID not provided']);
    }
    exit();
}

// Fetch product details and related products for the product page
if (isset($_GET['view']) && $_GET['view'] === 'product') {
    $productId = isset($_GET['productId']) ? intval($_GET['productId']) : null;

    if ($productId) {
        $product = $productsDao->getProductDetails($productId);
        $relatedProducts = [];

        if ($product && isset($product['Category'])) {
            $relatedProducts = $productsDao->getRelatedProducts($product['Category'], $productId);
        }

        // Debugging log
        error_log("Product details: " . json_encode($product));
        error_log("Related products: " . json_encode($relatedProducts));

        // Pass the data to the frontend
        header('Content-Type: application/json');
        echo json_encode([
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
        exit();
    } else {
        echo json_encode(['error' => 'Product ID not provided.']);
        exit();
    }
}
?>