<!DOCTYPE html>
<HTML lang=en dir=ltr data-bs-theme="light" xmlns="http://www.w3.org/1999/xhtml">
<?php
//---
if (isset($_REQUEST['test']) || $_SERVER['SERVER_NAME'] == 'localhost') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}
//---
echo <<<HTML
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="robots" content="noindex">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#111111" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#eeeeee" media="(prefers-color-scheme: dark)" />
        <title>Multi CropTool</title>
		<link href='css/styles.css' rel='stylesheet' type='text/css'>
        <!-- <script src="js/newta.js"></script> -->
        <script src="js/auth.js"></script>
        <script src="js/imginfo.js"></script>
        <script src="js/crops.js"></script>
        <script src="js/upload.js"></script>
        <!-- <script src="js/new.js"></script> -->
        <style>
            a {
                text-decoration: none !important;
            }
        </style>
HTML;
//---
$hoste = 'https://tools-static.wmflabs.org/cdnjs';
if ($_SERVER['SERVER_NAME'] == 'localhost') {
    $hoste = 'https://cdnjs.cloudflare.com';
}
//---
echo <<<HTML
    <link href='$hoste/ajax/libs/font-awesome/6.5.2/css/all.min.css' rel='stylesheet' type='text/css'>
    <link href='$hoste/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css' rel='stylesheet' type='text/css'>
    <link href='$hoste/ajax/libs/datatables.net-bs5/1.13.1/dataTables.bootstrap5.css' rel='stylesheet' type='text/css'>
    <link href='$hoste/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css' rel='stylesheet' type='text/css'>

    <script src='$hoste/ajax/libs/jquery/3.7.1/jquery.min.js'></script>
    <script src='$hoste/ajax/libs/popper.js/2.11.8/umd/popper.min.js'></script>
    <script src='$hoste/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js'></script>
    <script src='$hoste/ajax/libs/datatables.net/2.1.1/jquery.dataTables.min.js'></script>
    <script src='$hoste/ajax/libs/datatables.net-bs5/1.13.1/dataTables.bootstrap5.min.js'></script>
    <script src='$hoste/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js'></script>
    <script type="module" src="js/color-modes.js"></script>

</head>
HTML;
require("helps/darkmode.php");
$them_li = darkmodeicon();
//---
echo <<<HTML

<body>

<header class="mb-3 border-bottom">
    <nav id="mainnav" class="navbar navbar-expand-lg shadow">
        <div class="container-fluid" id="navbardiv">
            <a class="navbar-brand mb-0 h1" href="index.php" style="color:#0d6efd;">
                <i class="fa fa-crop"></i> Multi CropTool
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar"
                aria-controls="collapsibleNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav flex-row flex-wrap bd-navbar-nav">
                    <li class="nav-item col-4 col-lg-auto">
                        <a class="nav-link py-2 px-0 px-lg-2" href="../" target="_blank">
                            <span class="navtitles">CropTool</span>
                        </a>
                    </li>
                    <li class="nav-item col-4 col-lg-auto">
                        <a class="nav-link py-2 px-0 px-lg-2" href="../mass" target="_blank">
                            <span class="navtitles">Mass Upload</span>
                        </a>
                    </li>
                    <li class="nav-item col-4 col-lg-auto">
                        <a class="nav-link py-2 px-0 px-lg-2" href="https://github.com/MrIbrahem/Multi-CropTool" target="_blank">
                            <span class="navtitles">Github</span>
                        </a>
                    </li>
                </ul>
                <hr class="d-lg-none text-black-50">
                <ul class="navbar-nav flex-row flex-wrap bd-navbar-nav ms-lg-auto">
                    <li class="nav-item col-4 col-lg-auto dropdown">
                        $them_li
                    </li>
                    <li class="nav-item col-4 col-lg-auto dropdown">
                        <div id="user_login" class="navbar-text">
                            <a href="https://nccroptool.toolforge.org/api/auth/login"><i class="fas fa-sign-in-alt fa-sm fa-fw mr-2"></i> Login</a><span id="username"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
HTML;
?>
<main id="body">
    <div id="maindiv" class="container-fluid">
