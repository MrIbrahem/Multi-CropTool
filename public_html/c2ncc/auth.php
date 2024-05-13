<?php
if (isset($_REQUEST['test'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
};
//---
// this file is redirected to files in the auth directory
// example:
// url auth.php?a=login  -> auth/login.php
// url auth.php?a=edit   -> auth/edit.php
// url auth.php?a=index  ->
// code:

// header('Content-type: application/json; charset=utf-8');

// After
$allowedActions = ['login', 'callback', 'edit', 'api', 'index', 'userinfo', 'upload'];

$action = $_GET['a'] ?? 'index';

if (!in_array($action, $allowedActions)) {
    // Handle error or redirect to a default action
    $action = 'index';
}
$actionFile = $action . '.php';

// Redirect to the corresponding action file
// header("Location: auth/" . $actionFile);
require_once __DIR__ . "/auth/" . $actionFile;

if ($action == 'index') {
    echo_login();
}
exit;
