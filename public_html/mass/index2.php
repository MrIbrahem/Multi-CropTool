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
if (!defined('ROOT_PATH')) {
    // get the root path from __file__ , split before public_html
    // split the file path on the public_html directory
    $pathParts = explode('public_html', __file__);

    // the root path is the first part of the split file path
    $ROOT_PATH = $pathParts[0];
    define('ROOT_PATH', $ROOT_PATH);
}
//---
require 'header.php';
//---
echo <<<HTML
	<script src="js/up2.js"></script>
</head>
HTML;
//---
if (TEST) {
    echo "ROOT_PATH: " . ROOT_PATH;
}
//---
require 'up2.php';
//---
require 'foter.php';
?>