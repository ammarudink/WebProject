<?php
require 'vendor/autoload.php'; 
require 'services/UserService.php';
require 'services/OrderService.php';
require 'services/ProductService.php';

Flight::register('user_service', "UserService");
Flight::register('order_service', "OrderService");
Flight::register('product_service', "ProductService");

require_once 'routes/UserRoute.php';
require_once 'routes/OrderRoute.php';
require_once 'routes/ProductRoute.php';

Flight::start();  
?>