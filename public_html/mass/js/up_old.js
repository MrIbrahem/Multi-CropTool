function getApiToken() {
    var api = $.get({
        url: 'https://nccroptool.toolforge.org/api/auth/getEditToken',
    });
    return api;
}

function upload_api(file, callback) {
    //---
    var api_url = 'https://nccommons.org/wiki/api.php';
    //---
    var params = {
        action: "upload",
        format: "json",
        filename: file.name,
        file: file,
        token: getApiToken(),
    };
    //---
    $.post({
        url: api_urls,
        data: params,
        // dataType: 'json',
        success: function (data) {
            callback(null, data);
        },
        error: function (data) {
            callback('Error occurred', data);
        }
    });

}
function publishnew(file, callback) {
    //---
    var api_url = 'https://nccroptool.toolforge.org/';
    //---
    var params = {
        site: "nccommons.org",
        title: file.name,
        // file: file,
        comment: '',
    };
    //---
    // save file to path 'files'
    // move_uploaded_file($file.tmp_name, $filepath);
    //---
    var api_url1 = api_url + "api/file/publishnew?";
    //---
    console.log(params);
    $.post({
        url: api_url1,
        data: params,
        // dataType: 'json',
        success: function (data) {
            callback(null, data);
        },
        error: function (data) {
            callback('Error occurred', data);
        }
    });

}

function check_image_exist(name, callback) {
    var api_url = 'https://nccroptool.toolforge.org/';
    //---
    var params = {
        site: "nccommons.org",
        title: name
    };
    //---
    api_url = api_url + "api/file/exists?" + jQuery.param(params);
    //---
    // {"site":"nccommons.org","title":"Car.jpg","exists": true}
    //---
    $.get({
        url: api_url,
        dataType: 'json',
        success: function (data) {
            var exists = data.exists;
            var title = data.title;
            if (exists == true || exists == 'true') {
                callback(true, false, title);
            } else {
                callback(false, true, null);
            };
        },
        error: function (data) {
            callback(false, false, null);
        }
    });
    //---
}

function idElement_err(idElement, err) {
    idElement.text(err);
    idElement.css({ "font-weight": "bold", "color": "#f53333" });
}

function start_up(file, id) {
    var idElement = $("#" + id);
    idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading..');
    // console.log(file)
    //---
    upload_api(file, function (err, data) {
        console.log(data);
        // { "readyState": 4, "responseText": "{\"error\":\"File doesn't exist: \"}", "responseJSON": { "error": "File doesn't exist: " }, "status": 500, "statusText": "error" }
        //{    "error": "[api] Received error :- invalidtitle : Bad title \"File:\"."}
        // if err or not data
        var error = err;
        //---
        if (!error && data.error && data.error != undefined) {
            error = data.error;
        }
        if (!error && data.responseJSON.error && data.responseJSON.error != undefined) {
            error = data.responseJSON.errors;
        }
        if (error) {
            idElement_err(idElement, 'false: ' +  error);
        }
        //---
        if (!data) {
            idElement_err(idElement, 'false: no data');
        } else {
            var result = data.result || data.responseJSON.result;
            if (result == "Success") {
                $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + file.name + '" target="_blank">' + file.name + '</a>');
                idElement.text('true');
                idElement.css({ "color": "#45f533", "font-weight": "bold" });
            } else {
                idElement_err(idElement, 'false: ' + result);
            }
        }
    });
    
}
function upload_f(file, id) {
    var idElement = $("#" + id);
    idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...');
    //---
    check_image_exist(file.name, function (exists, notexists, title) {
        if (exists) {
            $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + title + '" target="_blank">' + title + '</a>');
            idElement.text('File exists in NCC');
            idElement.css({ "color": "#f53333", "font-weight": "bold" });
        } else {
            if (notexists) {
                start_up(file, id);
                //---
            } else {
                idElement.text('Error..');
                idElement.css({ "font-weight": "bold", "color": "#f53333" });
            }
        }
    });
}

$(document).ready(function () {
    document.getElementById("uploadForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const files = document.getElementById("imageUpload").files;

        if (files.length === 0) {
            alert("Please select one or more images to upload.");
            return;
        }
        $("#bar").show();
        var persnt = 100 / files.length;

        $("#uploadForm").hide();
        $("#result").show();

        for (let i = 0; i < files.length; i++) {
            var id = 'file' + i;

            // add row to table with id "result"
            var row = $("<tr></tr>");

            row.append("<td>" + (i + 1) + "</td>");
            row.append("<td><span id='name_" + id + "'>" + files[i].name + "</span></td>");
            row.append("<td><span id='" + id + "'></span></td>");

            $("#result tbody").append(row);

            // sleep(1000);

        }
        for (let i = 0; i < files.length; i++) {
            var id = 'file' + i;
            $("#progress-bar").css("width", (i + 1) * persnt + "%");
            $("#progress-bar").text((i + 1) + '/' + files.length);
            upload_f(files[i], id);
        }
    });
})