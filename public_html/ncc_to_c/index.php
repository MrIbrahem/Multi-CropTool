<?php

namespace MultiCrop;

require('header.php');
$start = $_REQUEST['start'] ?? '';
$test  = $_REQUEST['test'] ?? '';
$title = $_REQUEST['title'] ?? '';
$files = $_REQUEST['files'] ?? '';

$test_input = ($test != '') ? '<input name="test" id="test" value="1" hidden>' : '';
// decode title ' and "
$title_d = htmlentities($title);

echo <<<HTML
    <div class="card">
        <div class="card-header aligncenter" style="font-weight:bold;">
            <h3>NCC2Commons</h3>
        </div>
        <div class="card-body">
            <form action='up.php' method='POST'>
                $test_input
                <div class='row'>
                    <div class='col-md-10'>
                        <div class='input-group mb-3'>
                            <div class='input-group-prepend'>
                                <span class='input-group-text'>Title</span>
                            </div>
                            <input class='form-control' type='text' id='title' name='title' value='$title_d' required />
                        </div>
                    </div>
                    <div class='col-md-2'>
                        <input class='btn btn-outline-primary' size='10' name='start' value='get files'
                            onclick="javascript:get_files();" />
                        <span id="load_files" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display:none;"></span>
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
                    <input class='btn btn-outline-primary' type='submit' name='start' value='start' />
                </div>
            </form>
        </div>
    </div>

HTML;
$sts = ($title != '') ? 'get_files();' : '';

echo <<<HTML
    <script>
        $sts
        initAutocomplete("#title");
    </script>
HTML;
?>
</body>

</html>
