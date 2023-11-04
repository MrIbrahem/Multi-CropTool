<!doctype html>
<html>
<head>
    <title>Multi CropTool</title>
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="ta.js"></script>
    
<?php
    $old = '
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    ';
    //---------------- 
    $new = '
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    ';
    //---------------- 
    if ( $_SERVER['SERVER_NAME'] == 'localhost' ) { 
        echo $new;
    } else {
        echo ' 
    <script src="https://tools-static.wmflabs.org/cdnjs/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://tools-static.wmflabs.org/cdnjs/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://tools-static.wmflabs.org/cdnjs/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css">
    ';
    };
?>
    <link rel="stylesheet" type="text/css" href="https://tools-static.wmflabs.org/cdnjs/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">

    <!-- <link rel="stylesheet" href="css/vendor-071b981dc9.css"> -->
    <!-- <link rel="stylesheet" href="css/app-6b96dd5a43.css"> -->
    <!-- <link rel="stylesheet" href="ta.css"> -->

<style>
    body {
        padding-bottom:10px;
        padding-top:10px;
        padding-left:30px;
        padding-right:30px;  	
    }
</style>

</head>
<body>
<header class="app-header">
	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="index.php" style="color:blue;"><i class="fa fa-crop"></i> Multi CropTool</a>
			</div>
			<ul class="nav navbar-nav">
                <li class="nav-item col-4 col-lg-auto">
                    <a class="nav-link py-2 px-0 px-lg-2" href="../">
                        <span class="navtitles">CropTool</span>
                    </a>
                </li>
				<li class="nav-item col-4 col-lg-auto">
                    <a href="../mass">Mass Upload</a>
                </li>
				<li class="nav-item col-4 col-lg-auto">
                    <a href="https://github.com/MrIbrahem/Multi-CropTool" target="_blank"><span style="font-size:16px">Github</span></a>
                </li>
			</ul>
			
			<ul class="nav navbar-nav navbar-right">
				<!-- <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li> -->
				<li>
					<div id="user_login" class="navbar-text">
						<a href="https://nccroptool.toolforge.org/api/auth/login"><span class="glyphicon glyphicon-log-in"></span> Login</a><span id="username"></span>
					</div>
				</li>
			</ul>
		</div>
	</nav>
</header>
<script>user_login();</script>
