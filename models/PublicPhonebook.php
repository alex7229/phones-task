<?php

namespace app\models;

use app\components\Database;

class PublicPhonebook  {

    public function getUserData ($userId, $getPrivate = false) {
        return array(
            'mainData' => $this->getDetailedUserData($userId),
            'phones' => $this->getUserPhones($userId, $getPrivate),
            'emails' => $this->getUserEmails($userId, $getPrivate)
        );
    }

    public function getDetailedUserData ($userId) {
        $query = "SELECT * FROM users_main_data WHERE user_id=$userId";
        $db = new Database();
        return $db->runSimpleQuery($query);
    }

    public function getUserPhones ($userId, $getPrivate) {
        $publicClause = " public='true' AND";
        if ($getPrivate === true) {
            $publicClause = '';
        }
        $query = "SELECT phone_id, phone, public FROM users_phones WHERE" .$publicClause. " user_id=$userId";
        $db = new Database();
        return $db->runSimpleQuery($query);
    }

    public function getUserEmails ($userId, $getPrivate) {
        $publicClause = " public='true' AND";
        if ($getPrivate === true) {
            $publicClause = '';
        }
        $query = "SELECT email_id, email, public FROM users_emails WHERE" .$publicClause. " user_id=$userId";
        $db = new Database();
        return $db->runSimpleQuery($query);
    }
    
    public function getUsers() {
        $query = 'SELECT user_id, first_name, last_name FROM users_main_data WHERE isVisible="true"';
        $db = new Database();
        return $db->runSimpleQuery($query);
    }

    
}
