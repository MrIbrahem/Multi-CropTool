<?php
// ---
function make_col11($head,$body,$foot,$number = '1') {
    $html = '
            <div class="col-sm-3">
                <div id="paneltd' . $number . '" class="panel panel-default">
                  
                    <div id ="td' . $number . '" class="panel-heading">
                    <input type="checkbox" id="inputtd' . $number . '"/>
                    <strong>' . $head . ': </strong>
                    </div>
                    <div id ="hometd' . $number . '" class="panel-body">
                        ' . $body . '
                    </div>
                    <div id ="testtd' . $number . '" class="panel-footer">
                        ' . $foot . '
                    </div>
                </div>
            </div>';
    return $html;
};
// ---
// function make_col($head,$body,$foot,$number = '1') {
function make_col($head,$number) {
    $id_image = 'image' . $number;
    $id_crop = 'crop' . $number;
    $id_td = 'td' . $number;
    $id_n = 'nametd' . $number;
    $html = '
            <div class="col-sm-3" div id="main' . $id_td . '" style="display:inline;">
                <div id="panel' . $id_td . '" class="panel panel-default">
                    <div class="panel-heading">
                        <input type="checkbox" name="chk" onclick="change_uploaderror_display(\'none\')" id="input' . $id_td . '"/> <span id="' . $id_n . '"><strong>' . $head . ': </strong></span>
                        <span id="s' . $id_td . '" hidden="hidden"></span>
                        <span id="hinput' . $id_td . '" hidden="hidden">' . $id_td . '</span>
                    </div>

                    <div id="panelbody' . $id_td . '" class="panel-body">
                        <div class="tab-content">
                            <div id="' . $id_image . '" class="panel panel-default">
                                <div class="panel-heading">image</div>
                                <div id="home' . $id_td . '" class="panel-body">
                                    <div class="tab-pane fade in active"></div>
                                </div>
                            </div>

                            <div id="' . $id_crop . '" class="panel panel-default">
                                <div class="panel-heading">Crop</div>
                                <div class="panel-body">
                                <div id="' . $id_td . '" name="divtd" class="tab-pane fade in active"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="panel-footer">
                        <span id="test' . $id_td . '" style=""></span>
                    </div>
                </div>
            </div>
            ';
    return $html;
};
// ---
function make_test_col($type,$file_name,$number = '1') {
    $head = $type;
    $body = '<strong>file name:</strong> '.$file_name;
    $foot = '<strong>results:</strong> <span id="results"></span>';
    $html = make_col($head,$body,$foot,$number = '1');
    return $html;
};
// ---j
?>