<?php
/* @var $err  */

echo ' <h1 class="header">Login</h1>
 <form class="login" method="post">
    <label for="username">Name</label>
    <input  type="text" name="username" id="username">
    <label for="password">Password</label>
    <input type="password" name="password" id="password">
    <button name="submit">Login</button>
    <p class="error">'.$err.'</p>
</form>';