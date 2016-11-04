<?php

use app\controllers\SiteController;

class Route {

    public $method;
    public $route;
    public $token;
    
    public function escapeChars ($value) {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    public function readRequest () {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->method = 'post';
            if(isset($_POST['submit'])) {
                $this->route = 'login';
            } else {
                $this->route = isset($_POST['route']) ? $_POST['route'] : 'main';
            }
        } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->method = 'get';
            $this->route = isset($_GET['route']) ? $_GET['route'] : 'main';
        }
        $this->token = $this->escapeChars($_COOKIE['token']);
        $this->route = $this->escapeChars($this->route);
    }

    public function startApp () {
        $this->readRequest();
        $controller = new SiteController();
        switch ($this->route) {
            case 'loginForm':
                $controller->actionLoginForm();
                break;
            case 'public-phonebook':
                $controller->actionPublicPhonebook();
                break;
            case 'public-phonebook-detailed':
                $userId = $this->escapeChars($_POST['userId']);
                $controller->actionPublicPhonebookDetailed((int) $userId);
                break;
            case 'login':
                $username = $this->escapeChars($_POST['username']);
                $password = $this->escapeChars($_POST['password']);
                $controller->actionLogin($username, $password);
                break;
            case 'logout':
                $controller->actionLogout();
                break;
            case 'my-contact':
                $controller->actionMyContact($this->token);
                break;
            case 'my-contact-update':
                $userData = $_POST['userData'];
                $controller->actionMyContactUpdate($this->token, $userData);
                break;
            case 'main':
                $controller->actionMainPage($this->token);
                break;

        }
    }

}

$route = new Route();
$route->startApp();