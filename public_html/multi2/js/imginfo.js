
function error_file_p(id, filename, Type) {
    $('#test' + id).html(Type);

    var error = "<strong><i class='fa fa-exclamation-triangle'></i> Error! </strong>";

    var imageurl = 'https://nccommons.org/wiki/File:' + filename;

    if (Type == 'exist')
        error += "<a href='" + imageurl + "' target='_blank'><b>The file</b></a> is not available on nccommons.org, Please check the file name and try again.";

    if (Type != 'exist')
        error += Type;

    $('#cardbody' + id).html(error);

    // $('#cardheader' + id).addClass("");
    $('#card' + id).addClass("border-danger text-danger");
    $('#input' + id).attr("disabled", "1");
    $(".new_textarea").append('\n' + filename);
}

function count_info_plus_one(na_id) {
    var uu = $('#' + na_id).html();
    var u = parseInt(uu) + 1;
    $('#' + na_id).html(u.toString());
}

function make_width_and_high_x(width, height) {
    var w = parseFloat(width);
    var h = parseFloat(height);
    var ratio = w / h;
    var new_width = 0;
    var new_height = 0;
    if (ratio > 1) {
        new_width = 220;
        new_height = 220 / ratio;
    } else {
        new_width = 220 * ratio;
        new_height = 220;
    }
    return [new_width, new_height];
};

function gp(imagename, data, id) {
    var api_url = 'https://nccroptool.toolforge.org/';

    count_info_plus_one("info_done");

    // console.log('data.title:' + data.title);

    var aa = data.thumb;
    if (aa == null) {
        aa = data.original;
    }

    var img = aa.name;
    var awidth = aa.width;
    var aheight = aa.height;

    var dimintions = make_width_and_high_x(awidth, aheight);
    var width = dimintions[0];
    var height = dimintions[1];

    var img_tag = $("<img/>").attr("src", api_url + img).attr("width", width).attr("height", height).attr("alt", imagename);

    $('#img_' + id).empty();
    $('#img_' + id).append(img_tag);

    console.log('#img_' + id);

    // $('#crp_' + id).attr("idt", id);
    $('#crp_' + id).attr("name", "tocrop");
    // get_crop(id, imagename);
}

function get_one_file_info(id, imagename) {
    return new Promise((resolve, reject) => {
        var api_url = 'https://nccroptool.toolforge.org/';

        var params = {
            site: "nccommons.org",
            title: imagename
        };

        var api_url1 = api_url + "api/file/info?" + jQuery.param(params);

        jQuery.ajax({
            async: true,
            url: api_url1,
            dataType: 'json',
            success: function (data) {
                var err = data.error;
                if (err != null && err != undefined) {
                    console.log(imagename, 'exist', 'error');
                    error_file_p(id, imagename, err);
                    count_info_plus_one("info_errors");
                    // reject(err);
                    resolve();
                } else {
                    console.log(imagename, 'exist', 'error');
                    gp(imagename, data, id);
                    resolve();
                };
            },
            error: function (data) {
                // @ts-ignore
                var err = data.error;
                if (err == null || err == undefined) {
                    err = 'when getting image info';
                }
                console.log(imagename, 'exist', 'error');
                error_file_p(id, imagename, err);
                count_info_plus_one("info_errors");
                // reject(err);
                resolve();
            }
        });
    });
};

function change_color(id) {
    if ($('#' + id + '_done').text() == $('#' + id + '_all').text()) {
        // change font to green
        $('#' + id + '_done').css('color', 'green');
        $('#' + id + '_all').css('color', 'green');
    }
}
async function get_infos() {
    var ele = document.getElementsByName('images');

    $("#info_all").text(ele.length);
    // make it bold
    $("#info_all").css("font-weight", "bold");

    $("#info_logo").show();
    $("#info_name").css("font-weight", "bold");

    for (var i = 0; i < ele.length; i++) {
        var id = ele[i].id;
        var imagename = $('#' + id).text();

        var main_id = ele[i].getAttribute('main_id');
        sessionStorage.setItem(main_id, imagename);
        // var imagename = $("#name" + main_id).text();
        await get_one_file_info(main_id, imagename);
    };

    $("#info_logo").hide();
    $("#info_logo_done").show();

    change_color('info');

    // remove disabled from #restart
    $('#restart').removeAttr('disabled');
    $('#restart').addClass('btn-primary');
};

