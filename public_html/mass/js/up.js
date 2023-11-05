function save_it(file, id) {
    // save file to server
    //---
    $("#save_" + id).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...');
    //---
    // Create a FormData object to send files
    const formData = new FormData();
    formData.append('file', file);

    // Send the files to the PHP page using Fetch API

    fetch('save.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log(data);
        // Assuming the response contains the value 'true' or 'false'
        if (data.trim() === 'true') {
            $("#save_" + id).html('<span class="bi bi-check2"></span> <a href="/mass/files/' + file.name + '" target="_blank">Saved!</a>');
        } else {
            $("#save_" + id).html('<span class="bi bi-x"></span> Error!');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function upload_nccommons_api(file, callback) {
    //---
    var api_url = 'nccommons_api.php';
    //---
    var formData = new FormData();
    formData.append('action', 'upload');
    formData.append('format', 'json');
    //---
    // formData.append('file', file);
    formData.append('comment', 'comment');
    formData.append('filename', file.name);
    formData.append('url', 'https://nccroptool.toolforge.org/mass/files/' + file.name);
    //---
    // console.log(params);
    $.ajax({
        url: api_url,
        data: formData,
        type: "POST",
        processData: false,
        contentType: false,
        success: function (data) {
            callback(null, data);
        },
        error: function (data) {
            callback('Error occurred', data);
        }
    });
}
function upload_api(file, callback) {
    //---
    var api_url = 'api.php?do=upload';
    //---
    var formData = new FormData();
    // formData.append('file', file);
    formData.append('comment', 'comment');
    formData.append('filename', file.name);
    formData.append('url', 'https://nccroptool.toolforge.org/mass/files/' + file.name);
    //---
    // console.log(params);
    $.ajax({
        url: api_url,
        data: formData,
        type: "POST",
        processData: false,
        contentType: false,
        success: function (data) {
            callback(null, data);
        },
        error: function (data) {
            callback('Error occurred', data);
        }
    });
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
        //---
        // { "error": { "code": "mwoauth-invalid-authorization", "info": "The authorization headers in your request are not valid: Invalid signature", "*": "" } }
        console.log(data);
        var error = err;
        //---
        if (data.error) {
            error = data.error.code + ': ' + data.error.info;
        }
        //---
        if (error) {
            idElement_err(idElement, 'false: ' +  error);
        } else if (!data) {
            idElement_err(idElement, 'false: no data');
        } else {
            var result = data.result;
            if (result == "Success") {
                $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + file.name + '" target="_blank">' + file.name + '</a>');
                idElement.text('true');
                idElement.css({ "color": "#45f533", "font-weight": "bold" });
            } else {
                idElement_err(idElement, 'false, result: ' + result);
            }
        }
    });
    
}

function check_image_exist(name, callback) {
    //---
    var api_url = 'api.php?do=exists';
    //---
    var params = {
        "filename": name
    };
    //---
    $.post({
        url: api_url,
        data: params,
        dataType: 'json',
        success: function (data) {
            var exists = data.exists;
            if (exists == true || exists == 'true') {
                callback(true, false, name);
            } else {
                callback(false, true, null);
            };
        },
        error: function (data) {
            console.log(api_url + "&" + jQuery.param(params));
            callback(false, false, null);
        }
    });
    //---
}

function upload_f(file, id) {
    var idElement = $("#" + id);
    idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...');
    //---
    save_it(file, id);
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

                idElement.text('Exists Error..');
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
            row.append("<td><span id='save_" + id + "'>" + "</span></td>");
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