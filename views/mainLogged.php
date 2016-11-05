<?php
echo '<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Phones main page</title>
    <link href="/site.css" rel="stylesheet">
    <script src="frontend/libs/jquery-3.1.1.js"></script>
    <script src="frontend/application/main.js"></script>
</head>
<body>
    <h1 class="header">Phonebook</h1>
    <div class="btn-container">
        <a class="main-btn" href="/index.php?route=logout">Logout</a>
        <button class="main-btn" onclick="Controller.showPublicPhonebook()">Public Phonebook</button>
        <button class="main-btn" onclick="Controller.showMyContact()">My contact</button>
    </div>
    <div class="container"></div>
</body>';