<?php

if (isset($_REQUEST['test']) || $_SERVER['SERVER_NAME'] == 'localhost') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
};

require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/config.php';

function get_action($action)
{
    $allowedActions = ['login', 'callback', 'edit', 'api', 'index', 'userinfo', 'upload'];

    if (!in_array($action, $allowedActions)) {
        // Handle error or redirect to a default action
        $action = 'index';
    }

    return $action;
}

$action = $_REQUEST['a'] ?? 'index';

$actionFile = get_action($action);

// Redirect to the corresponding action file
// header("Location: auth/" . $actionFile);
require_once __DIR__ . "/" . $actionFile . '.php';

// exit;
