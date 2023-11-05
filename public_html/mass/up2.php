<?php
//---
$test = $_GET['test'] ?? '';
//---
echo <<<HTML
<div class='card'>
    <div class='card-header'>
    </div>
    <div class='card-body'>
        <form id="uploadForm" enctype="multipart/form-data" action="index.php?action=upload&test=$test" method="post">
            <div class="mb-3">
                <label for="imageUpload">Select Images</label>
                <input type="file" class="form-control" id="imageUpload" name="imageUpload[]" multiple>
            </div>
            <button type="submit" class="btn btn-primary">Upload</button>
        </form>
<script>
</script>

HTML;
//---
function getFiles()
{
    $result = array();
    foreach ($_FILES as $name => $fileArray) {
        if (is_array($fileArray['name'])) {
            foreach ($fileArray as $attrib => $list) {
                foreach ($list as $index => $value) {
                    $result[$name][$index][$attrib] = $value;
                }
            }
        } else {
            $result[$name][] = $fileArray;
        }
    }
    return $result;
}

function check_exists($filename)
{
    // check if file exists
    $params = [
        'action' => 'query',
        'format' => 'json',
        'formatversion' => '2',
        'titles' => "File:" . $filename
    ];

    $res = doApiQuery($params);
    // { "batchcomplete": true, "query": { "normalized": [ { "fromencoded": false, "from": "File:IMG_20220107_153333.jpg", "to": "File:IMG 20220107 153333.jpg" } ], "pages": [ { "pageid": 1190645, "ns": 6, "title": "File:IMG 20220107 153333.jpg" } ] } }
    $pages = $res->query->pages;
    //---
    // echo json_encode($pages);
    //---
    $pages = $pages[0];
    //---
    if ($pages && isset($pages->missing)) {
        return false;
    };
    //---
    // echo json_encode($res);
    //---
    return true;
}

function upload_nccommons_api($file)
{
    $url  = ''; //$post['url'] ?? '';
    // $file = $_FILES['file'];
    //---
    // var_dump($file);
    //---
    $filename = $file['name'] ?? '';
    //---
    $formData = array(
        'action' => 'upload',
        'format' => 'json',
        'comment' => '',
        'filename' => $filename
    );
    //---
    // save file to files
    $target_file = 'files/' . $filename;
    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        $url = 'https://nccroptool.toolforge.org/mass/files/' . $filename;
    }
    //---
    if ($url == '' && $file == '') {
        $err = ["error" => "Invalid", "filename" => $filename, "url" => $url];
        return $err;
    }
    //---
    if ($url != '') {
        $formData['url'] = $url;
    } else {
        // CURLFile
        $formData['file'] = new \CURLFile($file['tmp_name']);
    }
    //---
    $uu = doEdit($formData);
    // $uu = upload_file($file);
    //---
    return $uu;
}

//---
$files = getFiles()['imageUpload'] ?? [];
// {"name":"dwd.jpg","full_path":"dwd.jpg","type":"image\/jpeg","tmp_name":"C:\\phptemp\\php1188.tmp","error":0,"size":5470}
//---
if ($files != []) {
    //---
    echo <<<HTML
    <script>
            $("#uploadForm").hide();
    </script>
        <div id='bar'>
            <div class="progress" role="progressbar" aria-label="Warning example" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar text-bg-warning" id='progress-bar' style="width: 0%">0%</div>
            </div>
        </div>
        <hr/>
        <table class='sortable table table-striped' id='result'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>Exists?</th>
                    <th>Result</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
    HTML;
    //---
    // echo json_encode($files);
    //---
    $n = 0;
    foreach ($files as $key => $file) {
        //---
        $name = $file['name'] ?? '';
        $type = $file['type'] ?? '';
        $tmp_name = $file['tmp_name'] ?? '';
        $size = $file['size'] ?? '';
        //---
        $n++;
        //---
        $td_link = "<a href='https://nccommons.org/wiki/File:$name' target='_blank'>$name</a>";
        //---
        $error = '';
        $td_name   = "<span id='name_$n'>$name</span>";
        //---
        $ex_style = "";
        $exists = check_exists($name);
        //---
        $td_exists = "false";
        //---
        $td_result = "";
        $td_note   = "";
        //---
        if ($exists) {
            $td_exists = 'true';
            $td_name = $td_link;
            $td_result = 'false';
            $td_note = 'File exists in NCC';
            // color": "#f53333", "font-weight": "bold
            $ex_style = "color: #f53333; font-weight: bold";
        } else {
            //---
            $upload = upload_nccommons_api($file);
            //---
            if ($test != '') {
                echo 'json:' . htmlspecialchars(json_encode($upload), ENT_QUOTES, 'UTF-8');
            }
            //---
            // {"upload":{"result":"Warning","warnings":{"duplicate-archive":"Ts33.jpg"},"filekey":"1ah3u6r5yqho.ghdmel.13.","sessionkey":"1ah3u6r5yqho.ghdmel.13."}}
            //---
            $error = $upload['error'] ?? '';
            if ($error != '') {
                $td_result = 'false';
                $td_note   = $upload['error']['code'] . ';;info: ' . $upload['error']['info'];
                // idElement.css({ "font-weight": "bold", "color": "#f53333" });
                $ex_style = "color: #f53333; font-weight: bold";
            } else {
                // $upload = $upload['upload'];
                $upload = $upload['upload'] ?? $upload;
                //---
                $result = $upload['result'] ?? '';
                //---
                if ($result == 'Success') {
                    $td_result = 'true';
                    $td_note   = $result;
                    $td_name   = $td_link;
                    // idElement.css({ "color": "#45f533", "font-weight": "bold" });
                    $ex_style = "color: #45f533; font-weight: bold";
                } else if ($result == 'Warning') {
                        $td_result = 'Warning';
                        $td_note   = json_encode($upload);
                        // $td_name   = $td_link;
                        // idElement.css({ "color": "#45f533", "font-weight": "bold" });
                        // $ex_style = "color: #45f533; font-weight: bold";
                } else {
                    $td_result = 'false';
                    $td_note   = 'result: ' . $result;
                }
            }
        }
        //---
        echo <<<HTML
                <tr>
                    <td>$n</td>
                    <td>$td_name</td>
                    <td>$td_exists</td>
                    <td style="$ex_style">$td_result</td>
                    <td>$td_note</td>
                </tr>
        HTML;
        //---
        $id = 'file' . $n;
        //---
    }
    //---
    echo <<<HTML
            </tbody>
        </table>
    HTML;
    //---
}
//---
echo <<<HTML
    </div>
    </div>
HTML;
//---