<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    // CSRF token is invalid
    die('Invalid CSRF token');
  }
}
$data = $_POST;
$api = 'https://nccommons.org/w/api.php';
// post data to api
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
$result = curl_exec($ch);
if (curl_errno($ch)) {
  // handle error, e.g. log error message
  error_log('cURL error: ' . curl_error($ch));
}
curl_close($ch);
echo $result;
