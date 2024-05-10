<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/../text.php';


if (isset($_GET['filename'])) {
    $filename = $_GET['filename'];
    $text = make_file_text($filename);
    echo $text;
}

?>

<form action="text.php" method="get">
    <input type="text" name="filename" />
    <input type="submit" />
</form>
