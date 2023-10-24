

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
    var res = false;
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
    return res;
}

function upload_f(file, id) {

    $("#" + id).text('Uploading...');

    uploadImage(file, function (err, filename) {
        if (err) {
            $('#' + id).text('false');
            $("#" + id).css({ "color": "black", "font-weight": "normal" });
        } else {
            $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + filename + '">' + filename + '</a>');
            $('#' + id).text('true');
            $("#" + id).css({ "color": "green", "font-weight": "bold" });
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
            row.append("<td>" + (i + 1) + "</td><td id='name_" + id + "'>" + files[i].name + "</td><td id='" + id + "'></td>");
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