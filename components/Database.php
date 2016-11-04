<?php
namespace app\components;

class Database {
    
    public function getConnection ($dbName = 'test') {
        $host = 'localhost';
        $user = 'root';
        $pass = 'mypassword';
        $dsn = "mysql:host=$host;dbname=$dbName";
        $opt = array(
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
        );
        return new \PDO($dsn, $user, $pass, $opt);
    }

    public function runSimpleQuery ($query) {
        $stmt = $this->getConnection()->query($query);
        return $stmt->fetchAll();
    }
}