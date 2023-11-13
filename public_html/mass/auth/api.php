<?php
//---
if (isset($_REQUEST['test'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
};
//---
require_once __DIR__ . '/../vendor/autoload.php';

use MediaWiki\OAuthClient\Client;
use MediaWiki\OAuthClient\ClientConfig;
use MediaWiki\OAuthClient\Consumer;
use MediaWiki\OAuthClient\Token;

// Output the demo as plain text, for easier formatting.
header('Content-type: text/plain');

// Get the wiki URL and OAuth consumer details from the config file.
require_once __DIR__ . '/config.php';

// Configure the OAuth client with the URL and consumer details.
$conf = new ClientConfig($oauthUrl);
$conf->setConsumer(new Consumer($consumerKey, $consumerSecret));
$conf->setUserAgent($gUserAgent);
$client = new Client($conf);

// Load the Access Token from the session.
session_start();
$accessToken = new Token($_SESSION['access_key'], $_SESSION['access_secret']);

// Example 1: get the authenticated user's identity.
$ident = $client->identify($accessToken);

function get_edit_token()
{
    global $client, $accessToken, $apiUrl;
    // Example 3: make an edit (getting the edit token first).
    $editToken = json_decode($client->makeOAuthCall(
        $accessToken,
        "$apiUrl?action=query&meta=tokens&format=json"
    ))->query->tokens->csrftoken;
    //---
    return $editToken;
}

function doApiQuery($Params, $addtoken = null)
{
    global $client, $accessToken, $apiUrl;
    //---
    if ($addtoken != null) $Params['token'] = get_edit_token();
    //---
    $Result = $client->makeOAuthCall(
        $accessToken,
        $apiUrl,
        true,
        $Params
    );
    //---
    return json_decode($Result, true);
}

function doEdit($data) {
    return doApiQuery($data, $addtoken = true);
}


function upload($post) {
    $url = $post['url'] ?? '';
    $file = $_FILES['file'];

    // Validate and sanitize other inputs if needed
    $filename = filter_var($post['filename'] ?? '', FILTER_SANITIZE_STRING);
    $comment = filter_var($post['comment'] ?? '', FILTER_SANITIZE_STRING);

    //---

    $data = [
        'action' => 'upload',
        'format' => 'json',
        'filename' => $filename,
        'comment' => $comment,
    ];

    //---

    if ($url == '' && $file == '') {
        $err = ["error" => "Invalid", "filename" => $filename, "url" => $url];
        echo json_encode($err);
        return;
    }

    //---

    if ($url != '') {
        $data['url'] = $url;
    } else {
        // CURLFile
        $data['file'] = new \CURLFile($file['name'], $file['type'], $file['tmp_name'], $file['size']);
    }

    //---

    $uu = doEdit($data);

    //---

    echo json_encode($uu);
}


function find_exists() {
    // Sanitize the filename to prevent malicious code injection
    $sanitizedFilename = filter_var($_GET['filename'], FILTER_SANITIZE_STRING);
    $filename = $sanitizedFilename ?? '';

    $params = [
        'action' => 'query',
        'format' => 'json',
        'formatversion' => '2',
        'titles' => "File:" . $filename
    ];

    //---
    $res = doEdit($params);
    //---
    // Check if $res contains the specific phrase "authorized this application yet"
    if (is_string($res) && $res == 'login') {
        // echo "login";
        return;
    }
    //---
    // { "batchcomplete": true, "query": { "normalized": [ { "fromencoded": false, "from": "File:IMG_20220107_153333.jpg", "to": "File:IMG 20220107 153333.jpg" } ], "pages": [ { "pageid": 1190645, "ns": 6, "title": "File:IMG 20220107 153333.jpg" } ] } }
    // echo json_encode($res);
    $pages = $res['query']['pages'][0] ?? null;
    //---
    $result = ["exists" => "false"];
    //---
    if ($pages && !isset($pages['missing'])) {
        $result['exists'] = "true";
    };
    //---
    echo json_encode($result);
}


//---
switch ($_REQUEST['do'] ?? '') {
    case 'upload':
        upload($_REQUEST);
        break;
    case 'exists':
        find_exists();
        break;
}
//---
