<?php
    class Database {
        private static $host = 'localhost';
        private static $dbName = 'webproject';
        private static $username = 'root';
        private static $password = 'Ammarudin';
        private static $connection = null;

        // JWT Secret Key Definition
        public static function JWT_SECRET() {
            return 'de1587caa8b9fff6ab7d3d264f96fdd8ecbfc12dbdb2a2368985974f5ad32c92';
        }

        public static function connect() {
            if (self::$connection === null) {
                try {
                    self::$connection = new PDO(
                        "mysql:host=" . self::$host . ";dbname=" . self::$dbName,
                        self::$username,
                        self::$password,
                        [
                            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                        ]
                    );
                } catch (PDOException $e) {
                    die("Connection failed: " . $e->getMessage());
                }
            }
            return self::$connection;
        }
    }
?>
