<?php
//---
if (isset($_REQUEST['test'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
};
//---
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../text.php';

use MediaWiki\OAuthClient\Client;
use MediaWiki\OAuthClient\ClientConfig;
use MediaWiki\OAuthClient\Consumer;
use MediaWiki\OAuthClient\Token;

// Output the demo as json
header('Content-type: application/json; charset=utf-8');

// Get the wiki URL and OAuth consumer details from the config file.
require_once __DIR__ . '/config.php';

// Configure the OAuth client with the URL and consumer details.
$conf = new ClientConfig($oauthUrl);
$conf->setConsumer(new Consumer($consumerKey, $consumerSecret));
$conf->setUserAgent($gUserAgent);
$client = new Client($conf);

// if (!isset($_SESSION['access_key']) || !isset($_SESSION['access_secret'])) {
//     echo "Access token not found in session.";
//     exit;
// }

// Load the Access Token from the session.
session_start();
$accessToken = new Token($_SESSION['access_key'], $_SESSION['access_secret']);

// Example 1: get the authenticated user's identity.
$ident = $client->identify($accessToken);

$editToken = json_decode($client->makeOAuthCall(
    $accessToken,
    "$apiUrl?action=query&meta=tokens&format=json"
))->query->tokens->csrftoken;

function downloadFile($url)
{
    // Initialize cURL session
    $ch = curl_init($url);

    // Create a temporary file to save the downloaded content
    // down load to folder "files"
    // $tmp_dir = sys_get_temp_dir();
    $tmp_dir = __DIR__ . '/../files';

    $tmp_file = tempnam($tmp_dir, 'downloaded_file_');

    // Set options for cURL
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For HTTPS

    // Execute cURL request and save the downloaded content to the temporary file
    $file_data = curl_exec($ch);
    file_put_contents($tmp_file, $file_data);

    // Close cURL session
    curl_close($ch);

    return $tmp_file;
}

$url = $_REQUEST['url'] ?? '';

// Validate and sanitize other inputs if needed
$filename = filter_var($_REQUEST['filename'] ?? '', FILTER_SANITIZE_STRING);
$comment = filter_var($_REQUEST['comment'] ?? '', FILTER_SANITIZE_STRING);

$file_text = make_file_text($filename);

$data = [
    'action' => 'upload',
    'format' => 'json',
    'text' => $file_text,
    'filename' => $filename,
    'comment' => $comment,
];

if ($url == '') {
    $err = ["error" => "Invalid", "filename" => $filename, "url" => $url];
    echo json_encode($err);
    return;
}

// Download the file using the separate function
$by = $_REQUEST['by'] ?? 'file';

$tmp_file = downloadFile($url);
$tmp_name = basename($tmp_file);
$newurl = $main_site . "/c2ncc/files/$tmp_name";

if ($by == 'url') {
    // $data['url'] = $url;
    $data['url'] = $newurl;
} else {
    $data['file'] = new \CURLFile($tmp_file);
}

$data['token'] = $editToken;
//---
// echo $editToken;
//---
$result = $client->makeOAuthCall(
    $accessToken,
    $apiUrl,
    true,
    $data
);
//---
if (!$result) {
    $err = ["error" => "Failed to upload the file"];
    echo json_encode($err);
    exit;
}
//---
$response = json_decode($result, true);
//---
if (isset($response['error'])) {
    $err = ["error" => $response['error']];
    echo json_encode($err);
    exit;
}
//---
// Delete the temporary file after processing
unlink($tmp_file);

// Output the response
echo json_encode($response);
// if ($response['error']) {
//     echo json_encode($data);
// }
