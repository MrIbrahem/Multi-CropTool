function count_crop_plus_one(na_id) {
    var uu = $('#' + na_id).html();
    $('#' + na_id).html(parseFloat(uu) + 1);
}

function make_width_and_high(width, height) {
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

function get_crop(id, imagename) {

    return new Promise((resolve, reject) => {

        var y = $('#y').html();
        var x = $('#x').html();
        var width = $('#width').html();
        var height = $('#height').html();

        var api_url = 'https://nccroptool.toolforge.org/';

        var params2 = {
            site: "nccommons.org",
            title: imagename,
            y: y,
            x: x,
            width: width,
            height: height,
            method: 'precise',
            rotate: '0'
        };
        var api_url2 = api_url + "api/file/crop?" + jQuery.param(params2);
        console.log(api_url2);
        // count_crop_plus_one("crop_all");

        jQuery.ajax({
            async: true,
            url: api_url2,
            dataType: 'json',
            success: function (data) {

                console.log(imagename, 'crop', 'success');
                var cropimgname = data.crop.name;
                var cropwidth = data.crop.width;
                var cropheight = data.crop.height;

                var dimintions = make_width_and_high(cropwidth, cropheight);
                var width = dimintions[0];
                var height = dimintions[1];

                var url = api_url + cropimgname;

                var img_tag = $("<img/>").attr("src", url).attr("id", 'img' + id).attr("width", width).attr("height", height).attr("alt", imagename);

                $('#co_' + id).html(img_tag);

                var dim = 'Cropped ' + data.dim + ' Multi-CropTool';
                $('#s' + id).html(dim);
                count_crop_plus_one("crop_done");
                $('#card' + id).addClass("border-info");
                resolve();
            },
            error: function (data) {
                console.log(imagename, 'crop', 'error');
                error_file(id, imagename, 'when crop', 'dd');
                count_crop_plus_one("crop_errors");
                // reject(err);
                resolve();
            }
        });
    });
};


async function make_crops() {

    $("#crop_logo").show();
    $("#crop_name").css("font-weight", "bold");

    var to_crop = document.getElementsByName('to_crop');

    $("#crop_all").val(to_crop.length);
    $("#crop_all").css("font-weight", "bold");

    if (to_crop.length == 0) {
        $("#crop_logo").hide();
        $("#crop_logo_err").show();
        return;
    }
    // do get crop for to_crop elements
    for (var i = 0; i < to_crop.length; i++) {
        var id = to_crop[i].getAttribute("idt");
        console.log(JSON.stringify(to_crop[i]));

        var imagename = $("#name" + id).text();
        // var imagename = sessionStorage.getItem(id);

        console.log("make_crops: id:" + id + " imagename:" + imagename);
        if (imagename != null && imagename != undefined && imagename != '') {
            await get_crop(id, imagename);
        }
    };

    $("#crop_logo").hide();
    $("#crop_logo_done").show();
}
