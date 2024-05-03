<?php

namespace Up;
if (isset($_REQUEST['test']) || $_SERVER['SERVER_NAME'] == 'localhost') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
};
require('header.php');
require('log.php');

use function Log\log_files_to_json;

$title = $_REQUEST['title'] ?? '';
$files = $_REQUEST['files'] ?? '';

$files_rows = '';
$i = 0;
foreach (explode("\n", $files) as $file) {
    $file = trim($file);
    if ($file == '') {
        continue;
    }

    $i++;
    $file_to_html = htmlspecialchars($file);
    $files_rows .= <<<HTML
        <tr>
            <td>
                <span class="files" id="file_$i">$i</span>
            </td>
            <td>
                <span id="url_$i" style="display: none;"></span>
                <a id="name_$i" href="https://nccommons.org/wiki/$file_to_html" target="_blank">$file</a>
            </td>
            <td>
                <div id="$i">
                    <i class="fa fa-spinner fa-spin"></i> Checking
                </div>
            </td>
            <td>
                <div id="error_$i" style="display: none;">
                    <strong><i class='fa fa-exclamation-triangle'></i> Error! </strong>
                </div>
                <div id="success_$i" style="display: none;">
                    <i class="fa fa-check"></i> Success
                </div>
            </td>
        </tr>
HTML;
}

echo <<<HTML
    <div class="card">
        <div class="card-header aligncenter" style="font-weight:bold;">
            <h3>NCC2Commons</h3>
        </div>
        <div class="card-body">
            <div class="card-title">
                Title:
                <a href="https://nccommons.org/wiki/$title" target="_blank">$title</a>
            </div>
            <table class='sortable table table-striped' id='result'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>File</th>
                        <th></th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    $files_rows
                </tbody>
            </table>

        </div>
        <div class="card-footer">

        </div>
    </div>
HTML;

log_files_to_json($title, $files);

echo <<<HTML
        </div>
    </div>
    <script src="js/up.js"></script>
    <script src="js/info.js"></script>
    <script>
        $(document).ready(function() {
            async function start() {
                // upload files
                await do_files();
                await up_files();
            }

            start();
        });
    </script>
HTML;
?>
</body>

</html>
