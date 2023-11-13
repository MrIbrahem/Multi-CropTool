<?php
//---
$test = $_REQUEST['test'] ?? '';
if ($test != '' || $_SERVER['SERVER_NAME'] == 'localhost') {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
    define('TEST', true);
} else {
    define('TEST', false);
}
//---
require 'header.php';
//---
echo <<<HTML
	<script src="js/up.js"></script>
</head>
HTML;
//---
require 'up.php';
require 'foter.php';
?>