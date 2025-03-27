<?php
    require_once 'UserDao.php';
    $userDao = new UserDao();
    $userDao->insert([
        'UserID' => 1,
        'Name' => 'John Doe',
        'Email' => 'john@example.com',
        'Password' => password_hash('password123', PASSWORD_DEFAULT),
        'Address' => '123 Main St, Springfield, IL 62701',
        'Role' => 'Customer'
    ]);
     
    $users = $userDao->getAll();
    print_r($users);
?>