<?php
namespace app\components;

class Cookie {
    
    static function createCookie ($key, $value, $usedTimeSecs) {
        setcookie($key, $value, time() + $usedTimeSecs, "/");
    }
    
    static function findIdByToken ($token) {
        $db = new Database();
        $pdo = $db->getConnection();
        $stmt = $pdo->prepare('SELECT user_id FROM users_auth WHERE token=?');
        $stmt->execute(array($token));
        $data = $stmt->fetch();
        if ($data !== false && $token !== '') {
            return $data['user_id'];
        }
        return false;
    }

    static function deleteCookie ($key) {
        setcookie($key, null, time()-1, "/");
    }

}