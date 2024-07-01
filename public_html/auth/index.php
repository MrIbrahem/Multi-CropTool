<?php
require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/config.php';

use MediaWiki\OAuthClient\Client;
use MediaWiki\OAuthClient\ClientConfig;
use MediaWiki\OAuthClient\Consumer;

// Configure the OAuth client with the URL and consumer details.
$conf = new ClientConfig($oauthUrl);
$conf->setConsumer(new Consumer($consumerKey, $consumerSecret));
$conf->setUserAgent($gUserAgent);
$client = new Client($conf);

// Get the Request Token's details from the session and create a new Token object.
session_start();
//---
$username = $_SESSION['username'] ?? '';
//---
function echo_login()
{
	global $username, $tool_folder;
	$safeUsername = htmlspecialchars($username); // Escape characters to prevent XSS

	if ($username == '') {
		echo <<<HTML
			You are not authenticated.<br />
			Go to this URL to authorize this tool:<br />
			<a href='auth.php?a=login'>Login</a><br />
		HTML;
	} else {
		echo <<<HTML
			You are authenticated as $safeUsername.<br />
			Continue to <a href='auth.php?a=edit'>edit</a><br>
			<a href='logout.php'>logout</a>
		HTML;
	};
	//---
};

// echo_login();
