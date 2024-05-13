<?php

// header("Access-Control-Allow-Origin: http://localhost:9001");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Define content types and their corresponding headers
$contentTypes = [
    'text' => 'text/plain',
    'css' => 'text/css',
    'js' => 'text/javascript',
    'pdf' => 'application/pdf',
    'json' => 'application/json',
];

if (isset($_GET['url'])) {
    $url = $_GET['url'];
    // replace spaces with %20
    $url = str_replace(" ", "%20", $url);

    $type = strtolower($_GET['type'] ?? ''); // Get type with default empty string

    $contentType = null;

    // Check for video/image types first
    if (array_key_exists($type, $contentTypes)) {
        $contentType = $contentTypes[$type];
    }

    // Set content type header if found
    if ($contentType) {
        header("Content-type: $contentType");
    }

    // Fetch and echo content
    try {
        $content = file_get_contents($url);
        echo $content;
    } catch (Exception $e) {
        echo "";
    };
}
