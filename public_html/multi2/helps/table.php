<?php

namespace HelpTable;

function make_td($imgtitle, $numb)
{

    $id_td = "td$numb";
    $id_n  = "nametd$numb";

    $row1 = <<<HTML
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="crop_btn_$id_td" data-bs-toggle="tab" data-bs-target="#co_$id_td" type="button"
                    role="tab" aria-controls="co_$id_td" aria-selected="true">Cropped</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="img_btn_$id_td" data-bs-toggle="tab" data-bs-target="#img_$id_td" type="button"
                    role="tab" aria-controls="img_$id_td" aria-selected="false">Image</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div id="co_$id_td" class="tab-pane fade show active" role="tabpanel" aria-labelledby="crop_btn_$id_td">
                <i class="fa fa-regular fa-image" style="font-size:200px"></i>
            </div>
            <div id="img_$id_td" class="tab-pane fade" role="tabpanel" aria-labelledby="img_btn_$id_td">
                <i class="fa fa-image" style="font-size:200px"></i>
            </div>
        </div>
    HTML;

    $fileurl = "https://nccommons.org/wiki/File:$imgtitle";

    // $td = '<td>';
    $td = <<<HTML
        <span id="crp_$id_td" idt="$id_td" hidden="hidden">$id_td</span>
        <span id="s$id_td" hidden="hidden"></span>
        <div class="col-md-3" id="main$id_td" style="display:inline;">
            <div id="card$id_td" class="card">
                <div id="cardheader$id_td" class="card-header">
                    <span id="c_input$id_td">
                        <input type="checkbox" name="chk" id="input$id_td"/>
                    </span>
                    <a href="$fileurl" target="_blank">$imgtitle</a>
                    <span name="images" id="$id_n" main_id="$id_td" hidden="hidden">$imgtitle</span>
                </div>
                <div id="cardbody$id_td" class="card-body">
                    $row1
                </div>
                <div class="card-footer">
                    <span id="test$id_td" style=""></span>
                </div>
            </div>
        </div>
    HTML;
    return $td;
};

function make_table($text)
{

    $numb = 0;
    $tabnumb = 0;

    $tab = <<<HTML
        <div id="loadinfo_card" class="card">
            <div class="card-header"></div>
            <div id="loadinfo" class="card-body">
                <div class="row">
    HTML;

    foreach ($text as $line) {
        $line = trim($line);
        if ($line == '') {
            continue;
        }

        $tabnumb = $tabnumb + 1;
        $numb = $numb + 1;

        $tab .= make_td($line, $numb);

        if ($tabnumb == 4) {
            $tab .= '
		</div>
		<div class="row">';
            $tabnumb = 0;
        }
    };

    $tab .= '
            </div>
        </div>
    </div>
    ';

    return $tab;
};
