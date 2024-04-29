<?php

namespace Log;

function log_files_to_json($title, $files)
{

    $file_name = uniqid();

    // change $files to array
    $files = explode("\r\n", $files);

    $file_name = 'jobs/' . $file_name . '.json';
    $data = [
        'title' => $title,
        'files' => $files
    ];

    $json = json_encode($data, true);

    $put = file_put_contents($file_name, $json);
}
