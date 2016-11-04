<?php
/* @var $form  */
echo '<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Phones main page</title>
    <link href="/site.css" rel="stylesheet">
    <script src="frontend/jquery-3.1.1.js"></script>
    <script src="frontend/main.js"></script>
</head>
<body>
    <h1 class="header">Phonebook</h1>
    <div class="btn-container">
        <button class="main-btn" onclick="Controller.showLoginForm()">Login</button>
        <button class="main-btn" onclick="Controller.showPublicPhonebook()">Public Phonebook</button>
    </div>
    <div class="container">'.$form.'</div>
</body>';