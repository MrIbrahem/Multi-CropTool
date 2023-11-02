<?php
//---
$errorCode = 200;
//---
if (!defined('ROOT_PATH')) {
    // get the root path from __file__ , split before public_html
    // split the file path on the public_html directory
    $pathParts = explode('public_html', __file__);

    // the root path is the first part of the split file path
    $ROOT_PATH = $pathParts[0];
    define('ROOT_PATH', $ROOT_PATH);
}
//---
require 'login.php';

$post = $_REQUEST;
// remove do from $post
unset($post['do']);

function upload()
{
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

function find_exists()
{
    global $post;
    $filename = $post['filename'] ?? '';
    $params = [
        'action' => 'query',
        'format' => 'json',
        'formatversion' => '2',
        'titles' => "File:" . $filename
    ];

    $res = doApiQuery($params);
    // { "batchcomplete": true, "query": { "normalized": [ { "fromencoded": false, "from": "File:IMG_20220107_153333.jpg", "to": "File:IMG 20220107 153333.jpg" } ], "pages": [ { "pageid": 1190645, "ns": 6, "title": "File:IMG 20220107 153333.jpg" } ] } }
    $pages = $res['query']['pages'][0];
    //---
    $result = ["exists" => false];
    //---
    if ($pages && !isset($pages['missing'])) {
        $result['exists'] = true;
    };
    //---
    echo json_encode($result);
}

switch ($_REQUEST['do'] ?? '') {
    case 'upload':
        upload();
        break;
    case 'api':
        $post['format'] = 'json';
        $res = doApiQuery($post, $ch = null, $addtoken = true);
        // echo result as json
        echo json_encode($res);
        break;
    case 'exists':
        find_exists();
        break;
    case 'get_csrftoken':
        echo get_csrftoken();
        break;
}
//---
