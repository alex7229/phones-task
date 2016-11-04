<?php
namespace app\models;
use app\components\Database;

class Cities {

    static function getAllCities () {
        $query = "SELECT * FROM countries";
        $db = new Database();
        return $db->runSimpleQuery($query);
    }

}