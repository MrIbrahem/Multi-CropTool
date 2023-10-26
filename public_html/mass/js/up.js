function getApiToken() {
    return localStorage.getItem('token');
}

function uploadImage(file, callback) {
    var formData = {
        file: file,
        action: 'upload',
        comment: 'Uploaded via API',
        token: getApiToken(),
        filename: file.name,
        format: 'json',
        text: '== Summary ==\n{{Information\n|description=Uploaded via API\n|source={{own}}\n|date={{subst:today}}\n}}'
    }
    //---
    var api_url = 'https://nccommons.org/w/api.php';
    //---
    jQuery.ajax({
        url: api_url,
        data: formData,
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            var filename = data.upload.filename;
            if (filename) {
                callback(null, filename);
            } else {
                callback('No filename returned');
            }
        },
        error: function (data) {
            callback('Error occurred');
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
                callback(false, true);
            };
        },
        error: function (data) {
            callback(false, false);
        }
    });
    //---
}

function upload_f(file, id) {

    var na = file.name;
    $("#" + id).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...');
    check_image_exist(file.name, function (exists, notexists, title) {
        if (exists) {
            $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + title + '" target="_blank">' + title + '</a>');
            $("#" + id).text('File exists in NCC');
            $("#" + id).css({ "color": "#f53333", "font-weight": "bold" });
        } else {
            if (notexists) {
                $("#" + id).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading..');
                uploadImage(file, function (err, filename) {
                    if (err) {
                        $('#' + id).text('false');
                        $("#" + id).css({ "font-weight": "bold", "color": "#f53333" });
                    } else {
                        $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + filename + '" target="_blank">' + filename + '</a>');
                        $('#' + id).text('true');
                        $("#" + id).css({ "color": "#45f533", "font-weight": "bold" });
                    }
                });
            } else {
                $("#" + id).text('Error..');
                $("#" + id).css({ "font-weight": "bold", "color": "#f53333" });
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