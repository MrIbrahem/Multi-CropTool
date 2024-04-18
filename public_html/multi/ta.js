let ope = Math.random();
let table_json = new Map();

function post_new_request() {
    var url = window.location.href;
    var params = {
        x: $('#x').html(),
        y: $('#y').html(),
        width: $('#width').html(),
        height: $('#height').html(),
        text: $('.new_textarea').val()
    };

    // إرسال طلب POST
    url = url + '?' + jQuery.param(params);
    window.open(url, '_blank');
}

function loge(imgname, value, type) {
    // table_json[imgname][type] = value;
    table_json[imgname].set(type, value);
};

function log_all() {
    table_json['user'] = $("#username").html();
    jQuery.ajax({
        url: 'log.php',
        data: { a: JSON.stringify(table_json), file_name: ope },
        type: 'POST'
    });
};

function user_login() {
    // ---
    /*
    {"error":"Unauthorized","messages":[]}
    {"user":"Mr. Ibrahem"}
    */
    // ---
    var url = 'https://nccroptool.toolforge.org/api/auth/user';
    // ---
    jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.user) {
                var text = 'Authorized as <span id="username" style="color:blue;">' + data.user + '</span>';
                $('#user_login').html(text);
                // $('#username').html(data.user);
            }
        }
    });
    // ---
};

function error_file(id, filename, Type, add) {
    // <div id="panel' . $id_td . '" class="panel panel-default">
    // ---
    var error = "<strong><i class='fa fa-exclamation-triangle'></i> Error! </strong>";
    // ---
    var imageurl = 'https://nccommons.org/wiki/File:' + filename;
    // ---
    if (Type == 'exist')
        error += "<a href='" + imageurl + "' target='_blank'><b>The file</b></a> is not available on nccommons.org, Please check the file name and try again.";
    // ---
    if (Type != 'exist')
        error += Type;
    // ---
    // error += "<br>" + add;
    // ---
    // $('#' + id).html(error);
    // $('#home' + id).html('');
    // ---
    $('#panelbody' + id).html(error);
    // ---
    $('#panel' + id).addClass("panel-danger");
    $('#input' + id).attr("disabled", "1");
    $(".new_textarea").append('\n' + filename);
}

function check_image_exist(name, id = '', success = '', notsuccess = '') {
    var api_url = 'https://nccroptool.toolforge.org/';
    // ---
    var params = {
        site: "nccommons.org",
        title: name
    };
    // ---
    api_url = api_url + "api/file/exists?" + jQuery.param(params);
    // ---
    // {"site":"nccommons.org","title":"Car.jpg","exists": true}
    // {"site":"nccommons.org","title":"Car.jpg","exists":false}
    // ---
    var exist = false;
    // ---
    jQuery.ajax({
        url: api_url,
        dataType: 'json',
        success: function (data) {
            var exists = data.exists;
            if (exists == true || exists == 'true') {
                // ---
                if (id != '' && success != '')
                    $('#' + id).html(success);
                // ---
                exist = true;
            } else {
                // ---
                if (id != '' && notsuccess != '')
                    $('#' + id).html(notsuccess);
                // ---
                exist = false;
            };
        },
        error: function (data) {
            if (id != '' && notsuccess != '')
                $('#' + id).html(notsuccess);
        }
    });
    // ---
    return exist;
    // ---
}

function count_done_plus_one() {
    var done = $('#done').html();
    done = parseFloat(done) + 1;
    $('#done').html(done);
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

function get_crop(id, imagename, params = null) {
    // ---
    if (params == null)
        params = {
            y: $('#y').html(),
            x: $('#x').html(),
            width: $('#width').html(),
            height: $('#height').html(),
        }
    // ---
    if (table_json[imagename] == null || table_json[imagename] == undefined) {
        table_json[imagename] = new Map();
    };
    // ---
    var y = params.y;
    var x = params.x;
    var width = params.width;
    var height = params.height;
    // ---
    var api_url = 'https://nccroptool.toolforge.org/';
    // ---
    var params2 = {
        site: "nccommons.org",
        title: imagename,
        y: y,
        x: x,
        // y: y, x: x,
        width: width,
        height: height,
        method: 'precise',
        rotate: '0'
    };
    var api_url2 = api_url + "api/file/crop?" + jQuery.param(params2);
    // ---
    // {"site":"nccommons.org","title":"(DermNet NZ pachydermodactyly-3).jpg","pageno":0,"method":"precise","dim":"30 % horizontally, 39 % vertically using [[Commons:CropTool|CropTool]] with precise mode.","page":{"elems":[],"hasAssessmentTemplates":false,"hasDoNotCropTemplate":false},"crop":{"name":"files\/c83c48c5edb1d920e59d6feb1e4b196c191be2be_cropped.jpg","width":445,"height":295},"thumb":null,"time":1649538183,"wikidata":null,"msecs":481}
    // ---
    // {"site":"nccommons.org","title":"(DermNet NZ pachydermodactyly-3).jpg","pageno":0,"method":"precise","dim":"40 % horizontally, 68 % vertically using [[Commons:CropTool|CropTool]] with precise mode.","page":{"elems":[],"hasAssessmentTemplates":false,"hasDoNotCropTemplate":false},"crop":{"name":"files\/c83c48c5edb1d920e59d6feb1e4b196c191be2be_cropped.jpg","width":387,"height":153},"thumb":null,"time":1649720872,"wikidata":null,"msecs":456}
    // ---
    jQuery.ajax({
        url: api_url2,
        dataType: 'json',
        success: function (data) {
            // table_json[imagename].crop = 'success';
            loge(imagename, 'success', 'crop');
            var cropimgname = data.crop.name;
            var cropwidth = data.crop.width;
            var cropheight = data.crop.height;
            // ---
            var dimintions = make_width_and_high(cropwidth, cropheight);
            var width = dimintions[0];
            var height = dimintions[1];
            // ---
            var url = api_url + cropimgname;
            // ---
            // var img_tag = '<img src="' + url + '" id="img' + id + '" width="' + width + '" height="' + height + '" alt="' + imagename + '" />';
            // ---
            var img_tag = $("<img/>").attr("src", url).attr("id", 'img' + id).attr("width", width).attr("height", height).attr("alt", imagename);
            // ---
            $('#' + id).html(img_tag);
            // ---
            var dim = 'Cropped ' + data.dim + ' Multi-CropTool';
            $('#s' + id).html(dim);
            // ---
            count_done_plus_one();
            // ---
            $('#panel' + id).addClass("panel-info");
        },
        error: function (data) {
            // table_json[imagename].crop = 'error';
            loge(imagename, 'error', 'crop');
            error_file(id, imagename, 'when crop', 'dd');
            count_done_plus_one();
            // return;
        }
    });
};

function load_td(id, imagename) {
    // ---
    // $('#test'+id).html("kk");
    // ---
    var api_url = 'https://nccroptool.toolforge.org/';
    // ---
    var params = {
        site: "nccommons.org",
        title: imagename
    };
    // ---
    var api_url1 = api_url + "api/file/info?" + jQuery.param(params);
    // ---
    /*{
    "site": "nccommons.org",
    "title": "Cardiac amyloidosis (Radiopaedia 39736-42124 F 1).jpg",
    "description": "https:\/\/nccommons.org\/wiki\/File:Cardiac_amyloidosis_(Radiopaedia_39736-42124_F_1).jpg",
    "pagecount": 1,
    "mime": "image\/jpeg",
    "original": {
        "name": "files\/13914d9ed30cd475d205fe088a6c9276783f4ed0.jpg",
        "width": 1564,
        "height": 856
    },
    "thumb": {
        "name": "files\/13914d9ed30cd475d205fe088a6c9276783f4ed0_thumb.jpg",
        "width": 800,
        "height": 438
    },
    "samplingFactor": 0,
    "orientation": 0,
    "categories": ["Radiopaedia case 39736 Cardiac amyloidosis", "Uploads by F\u00e6"]
    }*/
    // ---
    /* {
    "site": "nccommons.org",
    "title": "(DermNet NZ pachydermodactyly-3).jpg",
    "description": "https:\/\/nccommons.org\/wiki\/File:(DermNet_NZ_pachydermodactyly-3).jpg",
    "pagecount": 1,
    "mime": "image\/jpeg",
    "original": {
        "name": "files\/c83c48c5edb1d920e59d6feb1e4b196c191be2be.jpg",
        "width": 640,
        "height": 480
    },
    "thumb": null,
    "samplingFactor": 0,
    "orientation": 0,
    "categories": ["CC-NC", "CC-ND", "DermNet images", "Pachydermodactyly", "Uploads by F\u00e6"]
    }*/
    // ---
    var thumb = '';
    // ---
    jQuery.ajax({
        url: api_url1,
        dataType: 'json',
        /*statusCode: {
          500: function() {
            alert( "page not found " + id );
            $('#test' + id).html("File doesn't exist");
            error_file(id, imagename, "File doesn't exist",'bb');
            count_done_plus_one();
          }
        },*/
        success: function (data) {
            // ---
            // alert( "success "  + id);
            // ---
            // {"error":"File doesn't exist: Cardiac amyloidosis (Radiopaedia 39736-42124 F 1).j1pg"}
            var error = data.error;
            // if (error) {
            if (error != null) {
                // table_json[imagename].exist = error;
                loge(imagename, 'error', 'exist');
                $('#test' + id).html(error);
                error_file(id, imagename, error, 'bbo');
                count_done_plus_one();
                // return;
            } else {
                // ---
                // table_json[imagename].exist = 'exist';
                loge(imagename, 'exist', 'exist');
                // ---
                var aa = data.thumb;
                if (aa == null) {
                    aa = data.original;
                }
                // ---
                var img = aa.name;
                var awidth = aa.width;
                var aheight = aa.height;
                // ---
                var dimintions = make_width_and_high(awidth, aheight);
                var width = dimintions[0];
                var height = dimintions[1];
                // ---
                // var img_tag = '<img src="' + api_url + img + '" width="' + width + '" height="' + height + '" alt="' + imagename + '" />';
                // ---
                var img_tag = $("<img/>").attr("src", api_url + img).attr("width", width).attr("height", height).attr("alt", imagename);
                // ---
                $('#home' + id).html(img_tag);
                // ---
                get_crop(id, imagename);
            };
        },
        error: function (data) {
            // alert( "Error " + id );
            // log(imagename, 'file', 'error when getting image info');
            error_file(id, imagename, 'when getting image info', 'cc');
            count_done_plus_one();
            // return;
        }
    });
    // ---

    // ---
};

async function load_tds() {
    var ele = document.getElementsByName('divtd');
    // ---
    // ---
    $("#workcount").val(ele.length);
    // ---
    var notexists = [];
    var exists = [];
    // ---
    for (var i = 0; i < ele.length; i++) {
        var id = ele[i].id;
        var nameid = "name" + id;
        var imagename = $('#' + nameid).text();
        // ---
        table_json[imagename] = new Map();
        // ---
        await load_td(id, imagename);
    };
};

function start() {
    load_tds();
    log_all();
    // ---
};

function upload(check) {
    for (var i = 0; i < check.length; i++) {
        // var id = 't' + check[i];
        var id = $('#h' + check[i]).text();
        var imagename = $("#name" + id).text();

        // ---
        if (table_json[imagename] == null || table_json[imagename] == undefined) {
            table_json[imagename] = new Map();
        };
        // ---
        var summary = $('#s' + id).text();
        var imagelink = $('#img' + id).attr("src");
        // $('#test' + id).html(imagelink);
        // ---
        var api_url = 'https://nccroptool.toolforge.org/';
        // ---
        var params = {
            site: "nccommons.org",
            title: imagename,
            overwrite: "overwrite",
            comment: summary,
            store: !0
        };
        // ---
        var api_url1 = api_url + "api/file/publish?";// + jQuery.param(params);
        // ---
        // var formData = new FormData();
        // formData.append('file', imagelink);
        // ---
        jQuery.ajax({
            url: api_url1,
            data: params,
            // cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: function (data) {
                // ---
                var result = data.result;
                var error = data.error;
                if (result == "Success") {
                    // ---
                    // table_json[imagename].upload = 'success';
                    loge(imagename, 'success', 'upload');
                    // ---
                    $('#panel' + id).addClass("panel-success");
                    $('#panel' + id).removeClass("panel-default");
                    $('#panel' + id).removeClass("panel-info");
                    // ---
                    $('#test' + id).css({ "color": "green", "font-size": "20px" });
                    $('#test' + id).html('<i class="fa fa-check-circle-o"></i> uploaded');
                    // ---
                    $('#c_input' + id).empty();

                } else {
                    // table_json[imagename].upload = 'failed';
                    loge(imagename, 'failed', 'upload');
                    $('#test' + id).html("Upload failed! " + error);
                    // error_file(id, imagename, error,'dd');
                    // return;
                };
            },
            error: function (data) {
                // table_json[imagename].upload = 'failed';
                loge(imagename, 'failed', 'upload');
                $('#test' + id).html('error when uploading');
                // error_file(id, imagename, 'error when uploading','ee');
                // return;
            }
        });
        // ---
        var uploaddone = $('#uploaddone').html();
        uploaddone = parseFloat(uploaddone) + 1;
        $('#uploaddone').html(uploaddone);
        // ---
    };

    // ---
};

function upload_all() {
    var ele = document.getElementsByName('chk');
    // ---
    var checked = [];
    var notchecked = [];
    // ---
    for (var i = 0; i < ele.length; i++) {
        var e = ele[i];
        if (e.type == 'checkbox') {
            var id = ele[i].id;
            if (e.checked == true)
                checked.push(id);
            if (e.checked == false)
                notchecked.push(id);
        }
    };
    // ---
    if (ele.length == notchecked.length) {
        // alert('Please select at least one image to upload.');
        change_uploaderror_display('inline');
        return;
    }
    // ---img_error
    $("#working").html('Uploading <span id="uploaddone">0</span>/' + checked.length);
    // ---
    var img_error = '';
    var number = 0;
    // ---to_upload
    img_error += '<div class="col-md-14"><div class="row">';
    for (var i = 0; i < notchecked.length; i++) {
        number = number + 1;
        // ---
        var id = $('#h' + notchecked[i]).html();
        var mainid = 'main' + id;
        // ---
        var td_html = $('#' + mainid).html();
        // ---
        img_error += '<div class="col-sm-3" div id="' + mainid + '" style="display:inline;">';
        img_error += td_html;
        img_error += '</div>';
        // $('#'+mainid).hide();
        // ---
        if (number == 4) {
            img_error += '</div></div>';
            img_error += '<div class="col-md-14"><div class="row">';
            number = 0;
        }
        // ---
    };
    img_error += '</div></div>';
    $('#img_error').html(img_error);
    // ---
    var to_uploa = '';
    var numb = 0;
    // ---to_upload
    to_uploa += '<div class="col-md-14"><div class="row">';
    // ---
    for (var i = 0; i < checked.length; i++) {
        numb = numb + 1;
        // ---
        var id = $('#h' + checked[i]).html();
        var mainid = 'main' + id;
        // ---
        var td_html = $('#' + mainid).html();
        // ---
        to_uploa += '<div class="col-sm-3" div id="' + mainid + '" style="display:inline;">';
        to_uploa += td_html;
        to_uploa += '</div>';
        // $('#'+mainid).hide();
        // ---
        if (numb == 4) {
            to_uploa += '</div></div>';
            to_uploa += '<div class="col-md-14"><div class="row">';
            numb = 0;
        }
        // ---
    };
    to_uploa += '</div></div>';
    // ---
    $('#to_upload').html(to_uploa);
    // ---
    $('#img_error_panel').show();
    $('#to_upload_panel').show();
    // ---
    $('#loadinfo_panel').hide();
    $('#loadinfo_panel').empty();
    // ---
    upload(checked);
    // ---
    log_all();
    // ---
};

function change_uploaderror_display(type) {
    if (type == 'none') {
        $('#uploaderror').css({ "display": "none" });
    }
    if (type == 'inline') {
        $('#uploaderror').css({ "display": "inline" });
    }
};

function selects() {
    var ele = document.getElementsByName('chk');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox' && ele[i].disabled != '1')
            ele[i].checked = true;
    };
    change_uploaderror_display('none');
};

function deSelect() {
    var ele = document.getElementsByName('chk');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox')
            ele[i].checked = false;

    }
};
