<?php
//---
function upload($post) {
    global $post;
    $url = $post['url'] ?? '';
    $file = $_FILES['file'];
    //---
    $filename = $post['filename'] ?? '';
    //---
    $data = [
        'action' => 'upload',
        'format' => 'json',
        'filename' => $filename,
        // 'file' => $post['file'],
        'comment' => $post['comment'] ?? '',
        // 'title' => $post['title'],
        // 'text' => $post['text'],
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
    echo json_encode($uu);
}

function find_exists() {
    $filename = $_GET['filename'] ?? '';
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
