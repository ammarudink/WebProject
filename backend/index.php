<?php
require 'vendor/autoload.php'; 
require 'services/UserService.php';
require 'services/OrderService.php';
require 'services/ProductService.php';
require 'services/AuthService.php';
require "middleware/AuthMiddleware.php";
require 'data/roles.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Flight::register('user_service', "UserService");
Flight::register('order_service', "OrderService");
Flight::register('product_service', "ProductService");
Flight::register('auth_service', "AuthService");
Flight::register('auth_middleware', "AuthMiddleware");

// This wildcard route intercepts all requests and applies authentication checks before proceeding.
Flight::route('/*', function() {
   if(
       strpos(Flight::request()->url, '/auth/login') === 0 ||
       strpos(Flight::request()->url, '/auth/register') === 0
   ) {
       return TRUE;
   } else {
       try {
           $token = Flight::request()->getHeader("Authentication");
           if(!$token)
               Flight::halt(401, "Missing authorization header");


           $token = str_replace('Bearer ', '', $token);
           
           $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));


           Flight::set('user', $decoded_token->user);
           Flight::set('jwt_token', $token);
           return TRUE;
       } catch (\Exception $e) {
           Flight::halt(401, $e->getMessage());
       }
   }
});


require_once 'routes/UserRoute.php';
require_once 'routes/OrderRoute.php';
require_once 'routes/ProductRoute.php';
require_once 'routes/AuthRoute.php';

Flight::start();  
?>