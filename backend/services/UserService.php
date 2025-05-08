<?php
    require_once __DIR__ . '/../dao/UserDao.php'; 
    require_once 'BaseService.php';
    class UserService extends BaseService{
        private $userDao;
        public function __construct() {
            $this->userDao = new UserDao();
            parent::__construct($this->userDao);
        }
        public function getByEmail($email) {
            return $this->userDao->getByEmail($email);
        }
        public function getById($id) {
            return $this->userDao->getById($id);
        }
        public function getByLastInsertId() {
            return $this->userDao->getByLastInsertId();
        }

        public function getUserNameById($id) {
            $user = $this->userDao->getById($id);
            return $user['Name'] ?? null;
        }

        //Business Logic
        public function canRegisterWithEmail($email) {
            $existingUser = $this->userDao->getByEmail($email); 
            return $existingUser === false; 
        }

        public function canUpdatePrices($userId) {
            $user = $this->userDao->getById($userId); 
            if ($user && $user['Role'] === 'Admin') {
                return true; 
            }
            return false; 
        }

        public function hashPasswordAndRegisterUser($userData) {
            // Validate required fields
            $requiredFields = ['Name', 'Email', 'Address', 'Password', 'ConfirmPassword', 'Role'];
            foreach ($requiredFields as $field) {
                if (empty($userData[$field])) {
                    throw new Exception("The field '$field' is required.");
                }
            }

            // Validate Password and Confirm Password match
            if ($userData['Password'] !== $userData['ConfirmPassword']) {
                throw new Exception("Password and Confirm Password do not match.");
            }

            // Validate the Role field
            $allowedRoles = ['Admin', 'Customer'];
            if (!in_array($userData['Role'], $allowedRoles)) {
                throw new Exception("Invalid role provided. Allowed roles are: " . implode(', ', $allowedRoles));
            }

            // If the role is Admin, validate the admin password
            if ($userData['Role'] === 'Admin') {
                $predefinedAdminPassword = 'adminadmin'; 
                if (!isset($userData['AdminPassword']) || $userData['AdminPassword'] !== $predefinedAdminPassword) {
                    throw new Exception("Invalid admin password provided.");
                }
                unset($userData['AdminPassword']); // Remove admin password from user data before saving
            }

            if ($this->canRegisterWithEmail($userData['Email'])) {
                $dataToInsert = [
                    'Name' => $userData['Name'],
                    'Email' => $userData['Email'],
                    'Password' => password_hash($userData['Password'], PASSWORD_BCRYPT),
                    'Address' => $userData['Address'],
                    'Role' => $userData['Role']
                ];
                
                // Use parent's insert method
                $success = parent::create($dataToInsert);
                if ($success) {
                    // Get the new user's data after successful insert
                    $userId = $this->userDao->getLastInsertId();
                    return $this->userDao->getById($userId);
                }
                throw new Exception("Failed to register user");
            }
            throw new Exception("Email is already in use.");
        }
    }
?>