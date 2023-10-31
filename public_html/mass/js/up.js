function getApiToken() {
    return localStorage.getItem('token');
}

function publishnew(file, callback) {
    //---
    var api_url = 'https://nccroptool.toolforge.org/';
    //---
    var params = {
        site: "nccommons.org",
        filename: file.name,
        // file: file,
        comment: '',
    };
    //---
    // save file to path 'files'
    // move_uploaded_file($file.tmp_name, $filepath);
    //---
    var api_url1 = api_url + "api/file/publishnew";
    //---
    jQuery.ajax({
        url: api_url1,
        data: params,
        type: 'POST',
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
    jQuery.ajax({
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
function upload_f(file, id) {
    var idElement = $("#" + id);
    idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...');
    //---
    var not_exists = false;
    //---
    check_image_exist(file.name, function (exists, notexists, title) {
        if (exists) {
            $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + title + '" target="_blank">' + title + '</a>');
            idElement.text('File exists in NCC');
            idElement.css({ "color": "#f53333", "font-weight": "bold" });
        } else {
            if (notexists) {
                not_exists = true;
                //---
            } else {
                idElement_err(idElement, 'Error..');
            }
        }
    });
    //---
    if (not_exists) {
        idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading..');
        // console.log(file)
        //---
        publishnew(file, function (err, data) {
            console.log(data);
            // if err or not data
            if (err || !data) {
                //{    "error": "[api] Received error :- invalidtitle : Bad title \"File:\"."}
                idElement_err(idElement, 'false' + err);
            } else {
                var error = data.error;
                if (error) {
                    idElement_err(idElement, 'false' +  data.error);
                } else {
                    var result = data.result;
                    if (result == "Success") {
                        $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + file.name + '" target="_blank">' + file.name + '</a>');
                        idElement.text('true');
                        idElement.css({ "color": "#45f533", "font-weight": "bold" });
                    } else {
                        idElement_err(idElement, 'false' + result);
                    }
                }
            }
        });
    }

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