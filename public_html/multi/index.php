<?php
// ---
require('header.php');
// ---
$files = '
(DermNet NZ pachydermodactyly-1).jpg
(DermNet NZ pachydermodactyly-2).jpg
(DermNet NZ pachydermodactyly-3).jpg
(DermNet NZ pachydermodactyly-4).jpg
(DermNet NZ pachydermodactyly-5).jpg
';
// ---
$test = $_REQUEST['test'];
$text = $_REQUEST['text'] ?? '';
$start = $_REQUEST['start'];
$x = $_REQUEST['x'] != '' ? $_REQUEST['x'] : 168;
$y = $_REQUEST['y'] != '' ? $_REQUEST['y'] : 368;
$height = $_REQUEST['height'] != '' ? $_REQUEST['height'] : 105;
$width = $_REQUEST['width'] != '' ? $_REQUEST['width'] : 208;
// ---
function make_td($imgtitle, $numb)
{
    // ---
    global $test;
    // ---
    $id_t = "d" . $numb;
    $id_td = "td" . $numb;
    $id_n = "nametd" . $numb;
    // ---
    $script = '';
    // ---
    $row1 = '
                        <ul class="nav nav-tabs">
                            <li class="active"><a data-toggle="tab" href="#' . $id_td . '">Cropped</a></li>
                            <li><a data-toggle="tab" href="#home' . $id_td . '">Image</a></li>
                        </ul>
                        <div class="tab-content">

                            <div name="divtd" id="' . $id_td . '" class="tab-pane fade in active">
                                <i class="fa fa-image" style="font-size:200px"></i>
                                ' . $script . '
                            </div>

                            <div id="home' . $id_td . '" class="tab-pane fade">
                                <i class="fa fa-file-image-o" style="font-size:200px"></i>
                            </div>
                        </div>
    ';
    // ---
    if ($test != '') {
        $row1 = '
                        <div class="tab-content">

                            <div class="panel panel-default">
                                <div class="panel-heading">Crop</div>
                                <div id="' . $id_td . '" name="divtd" class="panel-body">
                                </div>
                            </div>

                            <div class="panel panel-default">
                                <div class="panel-heading">image</div>
                                <div id="home' . $id_td . '" class="panel-body">
                                    <i class="fa fa-file-image-o" style="font-size:200px"></i>
                                </div>
                            </div>
                        </div>
    ';
    }
    // ---
    $fileurl = 'https://nccommons.org/wiki/File:' . $imgtitle;
    // ---
    $td = <<<HTML
        <div class="col-md-3" div id="main$id_td" style="display:inline;">
            <div id="panel$id_td" class="panel panel-default">
                <div class="panel-heading">
                    <span id="c_input$id_td">
                        <input type="checkbox" name="chk" onclick="change_uploaderror_display('none')" id="input$id_td"/>
                    </span>
                    <a href="$fileurl" target="_blank"> $imgtitle</a>
                    <span id="$id_n" hidden="hidden">$imgtitle</span>
                    <span id="s$id_td" hidden="hidden"></span>
                    <span id="hinput$id_td" hidden="hidden">$id_td</span>
                </div>
                <div id="panelbody$id_td" class="panel-body">
                    $row1
                </div>
                <div class="panel-footer">
                    <span id="test$id_td" style=""></span>
                </div>
            </div>
        </div>
    HTML;
    // ---
    return $td;
};
// ---
function make_table($text)
{
    // ---
    $text = str_replace("File:", "", $text);
    $text = str_replace("|", "", $text);
    // ---
    $text = explode("\n", $text);
    // ---
    $tab = '
    <div id="loadinfo_panel" class="panel panel-default">
        <!-- <div class="panel-heading"></div> -->
        <div id="loadinfo" class="panel-body">
            <div class="row">
        ';
    // ---
    $numb = 0;
    $tabnumb = 0;
    // ---
    foreach ($text as $line) {
        $line = trim($line);
        if ($line == '') {
            continue;
        }
        // ---
        $tabnumb = $tabnumb + 1;
        $numb = $numb + 1;
        // ---
        $tab .= make_td($line, $numb);
        // ---
        if ($tabnumb == 4) {
            $tab .= '
                </div>
                <div class="row">';
            $tabnumb = 0;
        }
        // ---
        // ---
    };
    // ---
    $tab .= '
                </div>
            </div>
        </div>
            ';
    // ---
    return $tab;
};
// ---
if ($start == '') {
    // ---
    $test_input = '';
    if ($test != '') {
        $test_input = '<label> text: </label> <input type="checkbox" name="test" id="test" checked>';
    };
    // ---
    $text2 = ($text == '') ? $files : $text;
    // ---
    echo <<<HTML
        <div class="panel panel-default">

            <div class="panel-heading"></div>
            <div class="panel-body">
                <div class="col-md-12">
                    <form action="index.php" method="POST">
                        <div class="row">
                            <div class="col-sm-2">
                                <label> left (x):  </label> <input type="text"  name="x" id="x" value="$x">
                            </div>
                            <div class="col-sm-2">
                                <label> top (y): </label> <input type="text" name="y" id="y" value="$y">
                            </div>
                            <div class="col-sm-2">
                                <label> height: </label> <input type="text"  name="height" id="height" value="$height">
                            </div>
                            <div class="col-sm-2">
                                <label> width: </label> <input type="text"  name="width" id="width" value="$width">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-1">
                                <label>files:</label><br>
                                <textarea cols="50" rows="15" name="text">$text2</textarea>
                            </div>
                        </div>
                    $test_input
                    <input type="submit" class="btn btn-outline-primary" name="start" value="start">
                    </form>
                </div>
            </div>
        </div>
    HTML;
};
// ---
function make_errors_form($x, $y, $width, $height)
{
    return <<<HTML
        <form action="index.php" method="POST" target="_blank">
            <input id="x" id="x" value="$x" hidden>
            <input id="y" id="y" value="$y" hidden>
            <input id="width" id="width" value="$width" hidden>
            <input id="height" id="height" value="$height" hidden>
            <textarea class="new_textarea" id="text" name="text" cols="100" rows="15" hidden>

            </textarea>
            <input type="submit" class="btn btn-outline-primary" value="Errors">
        </form>
    HTML;
}

$errors_line = make_errors_form($x, $y, $width, $height);
// ---
if ($text != '' && $start != '') {
    // ---
    // $urlsuffix = "&y=" . $y . "&x=" . $x . "&width=" . $width . "&height=" . $height;
    // ---
    $lal = "<span id='y' hidden='hidden'>$y</span>";
    $lal .= "<span id='x' hidden='hidden'>$x</span>";
    $lal .= "<span id='width' hidden='hidden'>$width</span>";
    $lal .= "<span id='height' hidden='hidden'>$height</span>";
    // ---
    echo $lal;
    // ---
    echo <<<HTML
        <div class="panel panel-default">
            <h2>
                <span id="working">working <span id="done">0</span>/<span id="workcount">0</span>
                </span>
                <span id="workingdone" style="color:red;"></span>
                <small>
                <div id="uploaderror" class="alert" style="color:red;display:none;">Please select at least one image to upload.</div>
                </small>
            </h2>
            <div class="row">
                <div class="col-md-3">
                    <label>  x:  </label><input type="text"  name="xx" id="xx" readonly="true" value="$x">
                </div>
                <div class="col-md-3">
                    <label> y: </label><input type="text" name="yy" id="yy" readonly="true" value="$y">
                </div>
                <div class="col-md-3">
                    <label> height: </label><input type="text" readonly="true" name="aheight" id="aheight" value="$height">
                </div>
                <div class="col-md-3">
                    <label> width: </label><input type="text" readonly="true" name="awidth" id="awidth" value="$width">
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <button type="button" class="btn btn-default" onclick="selects()">Select all</button>
                    <button type="button" class="btn btn-default" onclick="deSelect()">Deselect all</button>
                </div>
                <div class="col-md-3">
                    <div>
                        $errors_line
                    </div>
                </div>
                <div class="col-md-3">
                    <button type="button" class="btn btn-info" onclick="upload_all()">Upload</button> <!-- disabled -->
                </div>
                <div class="col-md-3">
                </div>
            </div>
        </div>
    HTML;
    // ---
    // $table = '<form>';
    $table = make_table($text);
    // ---
    echo $table;
    // ---
    echo '<!-- end of loadinfo -->';
    // ---
    echo '
        <div id="to_upload_panel" class="panel panel-default" hidden="hidden">
            <div class="panel-heading">Files ready to upload:</div>
            <div id="to_upload" class="panel-body">
            </div>
        </div>
        ';
    // ---
    echo '
        <div id="img_error_panel" class="panel panel-default" hidden="hidden">
            <div class="panel-heading">Files error:</div>
            <div id="img_error" class="panel-body">

            </div>
        </div>
	';
    // ---
    echo '

    <script>
    start();
    </script>';
};

?>

</div>
</body>

</html>
