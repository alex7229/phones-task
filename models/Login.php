<?php
namespace app\models;

use app\components\Database;

class Login {

    public $username;
    public $password;

    public function __construct($username, $pass) {
        $this->username = $username;
        $this->password = $pass;
    }

    public function getToken () {
        $db = new Database();
        $pdo = $db->getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users_auth WHERE login=? AND password=?');
        $stmt->execute(array($this->username, $this->password));
        $data = $stmt->fetch();
        if ($data) {
            $token = $this->generateCookieToken();
            $this->saveToken($token);
            return $token;
        } else {
            throw new \Exception('password or login are not correct');
        }
    }

    public function generateCookieToken ($length = 32, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        $str = '';
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $str .= $keyspace[random_int(0, $max)];
        }
        return $str;
    }

    public function saveToken ($token) {
        $db = new Database();
        $pdo = $db->getConnection();
        $stmt = $pdo->prepare("UPDATE users_auth SET token=? WHERE login=? AND password=?");
        $stmt->execute(array($token, $this->username, $this->password));
    }


}