<?php
require_once 'UserService.php';
require_once 'BaseService.php';
require_once 'PaymentService.php';
require_once __DIR__ . '/../dao/UserDao.php';
require_once __DIR__ . '/../dao/OrdersDao.php';

class TestService extends BaseService {
    private $userService;
    private $userDao;
    private $paymentService;
    private $ordersDao;

    public function __construct() {
        $this->userDao = new UserDao();
        $this->userService = new UserService();
        $this->paymentService = new PaymentService();
        $this->ordersDao = new OrdersDao();
        parent::__construct($this->userDao);
    }

    public function registerUser($userData) {
        try {
            error_log("TestService received registration data: " . json_encode($userData));
            
            // Use UserService to handle registration
            $user = $this->userService->hashPasswordAndRegisterUser($userData);
            
            if ($user) {
                return [
                    'success' => true,
                    'user' => [
                        'UserID' => $user['UserID'],
                        'name' => $user['Name'],
                        'email' => $user['Email'],
                        'address' => $user['Address'],
                        'role' => $user['Role']
                    ],
                    'redirect' => '/WebProject/index.html#dashboard'
                ];
            }
            
            throw new Exception("Failed to register user");
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function loginUser($email, $password) {
        try {
            $user = $this->userService->getByEmail($email);
            
            if (!$user || !password_verify($password, $user['Password'])) {
                throw new Exception("Invalid email or password");
            }

            return [
                'success' => true,
                'user' => [
                    'UserID' => $user['UserID'],
                    'name' => $user['Name'],
                    'email' => $user['Email'],
                    'address' => $user['Address'],
                    'role' => $user['Role']
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getUserProfile($userId) {
        try {
            $user = $this->userService->getById($userId);
            if (!$user) {
                throw new Exception("User not found");
            }
            
            return [
                'success' => true,
                'user' => [
                    'name' => $user['Name'],
                    'email' => $user['Email'],
                    'address' => $user['Address'],
                    'role' => $user['Role']
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function handleCheckout($orderData) {
        try {
            $paymentMethod = $orderData['paymentMethod'];
            $amount = $orderData['totalAmount'];
            $userId = $orderData['userId'];

            if ($paymentMethod === 'credit-card') {
                // Validate required fields
                $requiredFields = ['cardNumber', 'expiryDate', 'cvc'];
                foreach ($requiredFields as $field) {
                    if (empty($orderData[$field])) {
                        return [
                            'success' => false,
                            'message' => 'Missing required field: ' . $field
                        ];
                    }
                }

                $cardDetails = [
                    'cardNumber' => preg_replace('/\s+/', '', $orderData['cardNumber']), // Remove spaces
                    'expiryDate' => $orderData['expiryDate'],
                    'cvc' => $orderData['cvc']
                ];

                $paymentResult = $this->paymentService->processPayment(
                    null,
                    $amount,
                    $paymentMethod,
                    $cardDetails
                );

                if (!$paymentResult['success']) {
                    return [
                        'success' => false,
                        'message' => 'Payment validation failed',
                        'errors' => $paymentResult['errors']
                    ];
                }
            }

            // Create the order using OrdersDao
            $orderId = $this->ordersDao->createOrder($userId, $amount);
            
            if (!$orderId) {
                throw new Exception("Failed to create order");
            }

            return [
                'success' => true,
                'message' => 'Order placed successfully',
                'orderId' => $orderId,
                'paymentMethod' => $paymentMethod
            ];

        } catch (Exception $e) {
            error_log("Checkout error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    private function createOrder($orderData) {
        try {
            // Add your database insertion logic here
            // For now, we'll just return true to simulate success
            return true;
        } catch (Exception $e) {
            error_log("Order creation error: " . $e->getMessage());
            return false;
        }
    }
}
?>