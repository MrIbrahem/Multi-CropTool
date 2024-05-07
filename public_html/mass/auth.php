<?php
// this file is redirected to files in the auth directory
// example:
// url auth.php?a=login&to=mass  -> auth/login.php
// url auth.php?a=edit   -> auth/edit.php
// url auth.php?a=index  ->
// code:

// After
$allowedActions = ['login', 'callback', 'edit', 'api', 'index'];

$action = $_GET['a'] ?? 'index';
$to = $_GET['to'] ?? '';

if (!in_array($action, $allowedActions)) {
    // Handle error or redirect to a default action
    $action = 'index';
}
$actionFile = $action . '.php';

// Redirect to the corresponding action file
// header("Location: auth/" . $actionFile);
require_once __DIR__ . "/../auth/" . $actionFile;

if ($action == 'index') {
    echo_login();
}
exit;
