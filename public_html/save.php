<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_FILES)) {
        $targetDirectory = 'files/'; // Directory where files will be saved

        if (!file_exists($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        foreach ($_FILES as $file) {
            $file_name = $file['name'];
            $file_tmp = $file['tmp_name'];
            $file_destination = $targetDirectory . $file_name;

            if (move_uploaded_file($file_tmp, $file_destination)) {
                echo 'true';
            } else {
                echo 'false';
            }
            break;
        }
    }
}
?>
