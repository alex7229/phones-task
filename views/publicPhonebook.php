<?php
/* @var $users app\controllers\SiteController */

echo "<h1 class='header'>Public Phonebook</h1>";
foreach ($users as $user) {
    $id = $user['user_id'];
    echo "<div class='userPhonebook' data-user-id=$id>
                <h3 class='phonebookUserName'>$id. {$user['first_name']} {$user['last_name']} </h3>
                <span class='link show'  onclick='Controller.showDetailedUserData($id)'>view details</span>
                <span class='link hide'  onclick='Controller.hideDetailedUserData($id)'>hide details</span>
                <div class='detailedData' >
                    
                </div>
          </div>";
}