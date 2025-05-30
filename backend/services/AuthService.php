<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/AuthDao.php';
require_once __DIR__ . '/../dao/config.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class AuthService extends BaseService {
   private $auth_dao;
   public function __construct() {
       $this->auth_dao = new AuthDao();
       parent::__construct(new AuthDao);
   }


   public function get_user_by_email($email){
       return $this->auth_dao->get_user_by_email($email);
   }


   public function register($entity) {  
       if (empty($entity['Email']) || empty($entity['Password']) || empty($entity['Name']) || empty($entity['Address'])) {
           return ['success' => false, 'error' => 'All fields are required.'];
       }


       $email_exists = $this->auth_dao->get_user_by_email($entity['Email']);
       if($email_exists){
           return ['success' => false, 'error' => 'Email already registered.'];
       }


       $entity['Password'] = password_hash($entity['Password'], PASSWORD_BCRYPT);


       $entity = parent::insert($entity);


       


       return ['success' => true, 'data' => $entity];             
   }




   public function login($entity) {  
       if (empty($entity['Email']) || empty($entity['Password'])) {
           return ['success' => false, 'error' => 'Email and password are required.'];
       }


       $user = $this->auth_dao->get_user_by_email($entity['Email']);
       if(!$user){
           return ['success' => false, 'error' => 'Invalid username or password.'];
       }


       if(!$user || !password_verify($entity['Password'], $user['Password']))
           return ['success' => false, 'error' => 'Invalid username or password.'];


       unset($user['password']);
      
       $jwt_payload = [
           'user' => $user,
           'iat' => time(),
           // If this parameter is not set, JWT will be valid for life. This is not a good approach
           'exp' => time() + (60 * 60 * 24) // valid for day
       ];


       $token = JWT::encode(
           $jwt_payload,
           Database::JWT_SECRET(),
           'HS256'
       );


       return ['success' => true, 'data' => array_merge($user, ['token' => $token])];             
   }
}
?>