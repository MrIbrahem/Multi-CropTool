<?php

namespace NccToC;

if (isset($_REQUEST['test']) || $_SERVER['SERVER_NAME'] == 'localhost') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
};
require('header.php');
$start = $_REQUEST['start'] ?? '';
$test  = $_REQUEST['test'] ?? '';
$title = $_REQUEST['title'] ?? '';
$files = $_REQUEST['files'] ?? '';

$test_input = ($test != '') ? '<input name="test" id="test" value="1" hidden>' : '';

$title_d  = htmlentities($title);
//---
$login_sp = '';
$start_disabled = '';
//---
if ($username == '') {
    $start_disabled = ($_SERVER['SERVER_NAME'] == 'localhost') ? '' : 'disabled';
    $login_sp = <<<HTML
        You are not authenticated, Go to this URL to authorize this tool: <a href='auth.php?a=login'>Login</a>
    HTML;
}

echo <<<HTML
    <div class="card">
        <div class="card-header aligncenter" style="font-weight:bold;">
            <h3>Commons2NCC</h3>
            $login_sp
        </div>
        <div class="card-body">
            <form action='up2.php' method='POST'>
                $test_input
                <div class='row'>
                    <div class='col-md-12'>
                        <div class='input-group mb-3'>
                            <div class='input-group-prepend'>
                                <span class='input-group-text'>File</span>
                            </div>
                            <input class='form-control' type='text' id='title' name='title' value='$title_d'/>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-md-12'>
                        <div class='input-group mb-3'>
                            <div class='input-group-prepend'>
                                <span class='input-group-text' id="filescount">Files</span>
                            </div>
                            <textarea class='form-control' type='text' id='files' name='files' rows='10' required>$files</textarea>
                        </div>
                    </div>
                </div>
                <div class='input-group'>
                    <input class='btn btn-outline-primary' type='submit' name='start' value='start' $start_disabled/>
                </div>
            </form>
        </div>
    </div>

HTML;

echo <<<HTML
    <script>
        $(document).ready(function() {
            initAutocomplete("#title");
        });
    </script>
HTML;
?>
</body>

</html>
