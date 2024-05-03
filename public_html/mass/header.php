<!DOCTYPE html>
<HTML lang=en dir=ltr data-bs-theme="light" xmlns="http://www.w3.org/1999/xhtml">
<?php
//---
include_once('auth/index.php');
//---
echo "
<span id='myusername' style='display:none'>$username</span>";
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
	<title>Mass NC Commons Upload</title>
HTML;
//---
$hoste = 'https://tools-static.wmflabs.org/cdnjs';
if ($_SERVER['SERVER_NAME'] == 'localhost') {
	$hoste = 'https://cdnjs.cloudflare.com';
}
//---
echo <<<HTML
	<link href='$hoste/ajax/libs/font-awesome/5.15.3/css/all.min.css' rel='stylesheet' type='text/css'>
	<link href='$hoste/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css' rel='stylesheet' type='text/css'>
	<!-- <link href='$hoste/ajax/libs/datatables.net-bs5/1.13.5/dataTables.bootstrap5.css' rel='stylesheet' type='text/css'> -->
	<link rel="stylesheet" href="$hoste/ajax/libs/bootstrap-select/1.14.0-beta3/css/bootstrap-select.css" rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="$hoste/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css">

	<script src='$hoste/ajax/libs/jquery/3.7.0/jquery.min.js'></script>
	<script src='$hoste/ajax/libs/popper.js/2.11.8/umd/popper.min.js'></script>
	<script src='$hoste/ajax/libs/bootstrap/5.3.0/js/bootstrap.min.js'></script>
    <!-- <script src="/helps/auth.js"></script> -->

	<!-- <script src='$hoste/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js'></script> -->
	<!-- <script src='$hoste/ajax/libs/datatables.net/2.1.1/jquery.dataTables.min.js'></script> -->
	<!-- <script src='$hoste/ajax/libs/datatables.net-bs5/1.13.5/dataTables.bootstrap5.min.js'></script> -->
	<script src="$hoste/ajax/libs/bootstrap-select/1.14.0-beta3/js/bootstrap-select.min.js"></script>
	<!-- Bootstrap Icons -->
HTML;
//---
echo <<<HTML
	<script src="js/sorttable.js"></script>
</head>
HTML;

require("../helps/header_nav.php");
echo "<body>";
//---
$log_lis = <<<HTML
	<li class="nav-item col-4 col-lg-auto" id="">
		<a id="username_li" href="" class="nav-link py-2 px-0 px-lg-2" style="display:none">
			<i class="fas fa-user fa-sm fa-fw mr-2"></i> <span class="navtitles" id="user_name"></span>
		</a>
	</li>
	<li class="nav-item col-4 col-lg-auto" id="loginli">
		<a role="button" class="nav-link py-2 px-0 px-lg-2" href="auth.php?a=login">
			<i class="fas fa-sign-in-alt fa-sm fa-fw mr-2"></i> <span class="navtitles">Login</span>
		</a>
	</li>
	<li class="nav-item col-4 col-lg-auto">
		<a id="logout_btn" class="nav-link py-2 px-0 px-lg-2" href="logout.php" style="display:none">
			<i class="fas fa-sign-out-alt fa-sm fa-fw mr-2"></i> <span class="d-lg-none navtitles">Logout</span>
		</a>
	</li>
HTML;
//---
echo header_nav_tag($title="Mass Upload", $page='mass', $log_lis=$log_lis);
//---
?>
<script>
	var lo = $('#myusername').text();
	if (lo != '') {

		$('#loginli').hide();

		$('#username_li').show();
		$('#logout_btn').show();
		$('#user_name').text(lo);

	} else {

		$('#loginli').show();

		$('#username_li').hide();
		$('#logout_btn').hide();
	};
	// });
</script>
<main id="body">
	<div id="maindiv" class="container">
		<br>
