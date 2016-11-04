<?php

namespace app\controllers;

use app\models\MyContact;
use app\models\PublicPhonebook;
use app\models\Cities;
use app\models\MyContactUpdate;
use app\models\Login;
use app\components\Cookie;

class SiteController {

    public function displayWholePage ($templateName, array $params = array()) {
        extract($params);
        $templatePath = __DIR__ . '/../views/' . $templateName . '.php';
        include $templatePath;
    }

    public function renderPart ($templateName, array $params = array()) {
        ob_start();
        $this->displayWholePage($templateName, $params);
        $output = ob_get_contents();
        ob_end_clean();
        return $output;
    }
    
    public function actionLogin ($username, $password) {
        $model = new Login($username, $password);
        $errors = false;
        try {
            $token = $model->getToken();
        } catch (\Exception $err) {
            header("HTTP/1.1 401 Unauthorized");
            $form = $this->renderPart('loginForm', array('err' => $err->getMessage()));
            $this->displayWholePage('main', array('form' => $form));
            $errors = true;
        }
        if ($errors === false) {
            Cookie::createCookie('token', $token, 3600);
            $this->displayWholePage('mainLogged');
        }
    }
    
    public function actionLogout() {
        Cookie::deleteCookie('token');
        $this->displayWholePage('main');
    }
    
    public function actionLoginForm () {
        $this->displayWholePage('loginForm', array('err'=> ''));
    }
    
    public function actionPublicPhonebook () {
        $model = new PublicPhonebook();
        $users = $model->getUsers();
        $this->displayWholePage('publicPhonebook', array('users'=>$users));
    }
    
    public function actionPublicPhonebookDetailed ($userId) {
        $model = new PublicPhonebook();
        $userData = $model->getUserData($userId);
        echo json_encode($userData);
    }

    public function actionMyContact($token) {
        $id = Cookie::findIdByToken($token);
        if ($id !== false) {
            $userModel = new MyContact($id);
            $userData = $userModel->getUserData($userModel->userId, true);
            $countries = Cities::getAllCities();
            echo json_encode(array('userData'=>$userData, 'countries' => $countries));
        }
    }
    
    public function actionMyContactUpdate($token, $userDataRaw) {
        $userData = json_decode($userDataRaw, true);
        $model = new MyContactUpdate($token, $userData);
        $errors = false;
        try {
            $model->updateData();
        } catch (\Exception $err) {
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            echo $err->getMessage();
            $errors = true;
        }
        if ($errors === false) {
            echo 'Data is saved';
        }
    }

    public function actionMainPage($token) {
        if (Cookie::findIdByToken($token) !== false) {
            $this->displayWholePage('mainLogged');
        } else {
            $this->displayWholePage('main');
        }
    }
    

    
}