<?php

namespace Up;

require('header.php');
require('log.php');

use function Log\log_files_to_json;

$title = $_REQUEST['title'] ?? '';
$files = $_REQUEST['files'] ?? '';

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
            <textarea class='form-control' type='text' id='files' name='files' rows='10' required>$files</textarea>
        </div>
        <div class="card-footer">
            The bot will upload the files to Commons in the next minutes.
        </div>
    </div>
HTML;

log_files_to_json($title, $files);

echo <<<HTML
        </div>
    </div>
    <script src="js/up.js"></script>
HTML;
?>
</body>

</html>
