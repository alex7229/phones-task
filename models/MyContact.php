<?php
namespace app\models;

class MyContact extends PublicPhonebook{

    public $token;
    public $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }
    


}