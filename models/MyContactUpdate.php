<?php
namespace app\models;
use app\components\Cookie;
use app\components\Database;

class MyContactUpdate {

    public $token;
    public $userData;
    public $userId;


    public function __construct($token, $userData)
    {
        $this->token = $token;
        $this->userData = $userData;
    }

    public function checkUser() {
        $this->userId = Cookie::findIdByToken($this->token);
        if ($this->validate() && $this->userId !== false) {
                return true;
        };
        return false;

    }

    public function validate() {
        if (!$this->checkKeys(array('phones', 'emails', 'mainData'), $this->userData)) {
            return false;
        }
        if (!array_key_exists(0, $this->userData['mainData'])) {
            return false;
        }
        if (!$this->checkKeys(array('country_code', 'first_name', 'last_name', 'address', 'zip_city', 'isVisible'), $this->userData['mainData'][0])) {
            return false;
        }
        foreach ($this->userData['phones'] as $phoneData) {
            if (!$this->checkKeys(array('phone', 'phone_id', 'isPublic'), $phoneData)) {
                return false;
            }
        }
        foreach ($this->userData['emails'] as $emailData) {
            if (!$this->checkKeys(array('email', 'email_id', 'isPublic'), $emailData)) {
                return false;
            }
        }
        return true;
    }

    public function checkKeys($keys, $array) {
        if (!is_array($array)) {
            return false;
        }
        foreach ($keys as $key) {
            if (!array_key_exists($key, $array)) {
                return false;
            }
        }
        return true;
    }


    public function updateData() {
        if (!$this->checkUser()) {
            throw new \Exception('Wrong user');
        }
        $this->updateMainData();
        $this->updatePhones();
        $this->updateEmails();
    }

    public function updatePhones () {
        $phones = $this->userData['phones'];
        foreach ($phones as $data) {
            $id = $data['phone_id'];
            $db = new Database();
            $pdo = $db->getConnection();
            $stmt = $pdo->prepare('SELECT * FROM users_phones WHERE phone_id=? AND user_id=?');
            $stmt->execute(array($id, $this->userId));
            $result = $stmt->fetch();
            if ($result !== false) {
                //update
                $stmt = $pdo->prepare('UPDATE users_phones SET phone=?, public=? WHERE phone_id=? AND user_id=?');
                $stmt->execute(array($data['phone'], $data['isPublic'], $id, $this->userId));
            } else {
                //insert
                $stmt = $pdo->prepare('INSERT INTO users_phones (user_id, phone, public) VALUES (?, ?, ?)');
                $stmt->execute(array($this->userId, $data['phone'], $data['isPublic']));
            }
            $pdo = null;
        }
    }

    public function updateEmails () {
        $emails = $this->userData['emails'];
        foreach ($emails as $data) {
            $id = $data['email_id'];
            $db = new Database();
            $pdo = $db->getConnection();
            $stmt = $pdo->prepare('SELECT * FROM users_emails WHERE email_id=? AND user_id=?');
            $stmt->execute(array($id, $this->userId));
            $result = $stmt->fetch();
            if ($result !== false) {
                //update
                $stmt = $pdo->prepare('UPDATE users_emails SET email=?, public=? WHERE email_id=? AND user_id=?');
                $stmt->execute(array($data['email'], $data['isPublic'], $id, $this->userId));
            } else {
                //insert
                $stmt = $pdo->prepare('INSERT INTO users_emails (user_id, email, public) VALUES (?, ?, ?)');
                $stmt->execute(array($this->userId, $data['email'], $data['isPublic']));
            }
            $pdo = null;
        }
    }

    public function updateMainData () {
        $mainData = $this->userData['mainData'][0];
        $db = new Database();
        $pdo = $db->getConnection();
        $stmt = $pdo->prepare('UPDATE users_main_data SET country_code=?, first_name=?, last_name=?, address=?, zip_city=?, isVisible=? WHERE user_id=?');
        $stmt->execute(array($mainData['country_code'], $mainData['first_name'], $mainData['last_name'], $mainData['address'], $mainData['zip_city'], $mainData['isVisible'], $this->userId));
        $pdo = null;
    }
}