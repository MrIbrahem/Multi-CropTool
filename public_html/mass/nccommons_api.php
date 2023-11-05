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
	@@ -8,6 +14,12 @@
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
$result = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
  // handle error, e.g. log error message
  error_log('cURL error: ' . curl_error($ch));
} elseif ($httpcode != 200) {
  error_log('API request failed with status code: ' . $httpcode);
}
curl_close($ch);
echo $result;