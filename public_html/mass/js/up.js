function save_it(file, id) {
    return new Promise((resolve, reject) => {
        // save file to server
        //---
        $("#save_" + id).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...');
        //---
        // Create a FormData object to send files
        const formData = new FormData();
        formData.append('file', file);

        let attempt = 0;

        // Define a function to handle the fetch operation
        const sendRequest = () => {
            attempt++;
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
                    if (data.trim() === 'true') {
                        $("#save_" + id).html('<span class="bi bi-check2"></span> <a href="/mass/files/' + file.name + '" target="_blank">Saved!</a>');
                        resolve(true); // Resolves the Promise with true if saved successfully
                    } else {
                        if (attempt < 3) {
                            $("#save_" + id).html('<span class="bi bi-x"></span> Error! (Attempt ' + attempt + ') Retrying...');
                            // Retry after 1 second in case of an error
                            setTimeout(sendRequest, 1000); // Retry after 1 second
                        } else {
                            $("#save_" + id).html('<span class="bi bi-x"></span> Error! Maximum attempts reached');
                            reject(false); // Rejects the Promise with false after maximum attempts
                        }
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    if (attempt < 3) {
                        $("#save_" + id).html('<span class="bi bi-x"></span> Error! (Attempt ' + attempt + ') Retrying...');
                        // Retry after 1 second in case of an error
                        setTimeout(sendRequest, 1000); // Retry after 1 second
                    } else {
                        $("#save_" + id).html('<span class="bi bi-x"></span> Error! Maximum attempts reached');
                        reject(false); // Rejects the Promise with false after maximum attempts
                    }
                });
        };

        // Initial request
        sendRequest();
    });
}

function upload_api(file, callback) {
    //---
    var file_url = 'https://nccroptool.toolforge.org/mass/files/' + file.name;
    //---
    var api_url = '../auth/api.php';
    //---
    var formData = {
        filename: file.name,
        url: file_url,
        comment: 'comment',
        do: 'upload',
    }
    //---
    var urlx = api_url + '?' + $.param(formData);
    //---
    $.ajax({
        url: api_url,
        data: formData,
        type: "POST",
        dataType: "json",
        success: function (data) {
            callback(null, data, urlx);
        },
        error: function (data) {
            callback('Error occurred', data, urlx);
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
    upload_api(file, function (err, data, urlx) {
        //---
        // { "error": { "code": "mwoauth-invalid-authorization", "info": "The authorization headers in your request are not valid: Invalid signature", "*": "" } }
        var error = err;
        //---
        if (data.error) {
            error = data.error;
            if (data.error.code) {
                error = data.error.code + ': ' + data.error.info;
            }
        }
        //---
        // {"upload":{"result":"Warning","warnings":{"was-deleted":"Z.jpg"},"filekey":"1ah474dii5sk.fjn2sw.13.","sessionkey":"1ah474dii5sk.fjn2sw.13."}}
        if (data.upload != undefined) {
            data = data.upload;
        }
        //---
        console.log(urlx);
        console.log(data);
        //---
        if (error) {
            idElement_err(idElement, 'false: ' + error);
        } else if (!data) {
            idElement_err(idElement, 'false: no data');
        } else {
            var results = data.result;
            var warnings = data.warnings;
            if (results == "Success") {
                $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + file.name + '" target="_blank">' + file.name + '</a>');
                idElement.text('true');
                idElement.css({ "color": "#45f533", "font-weight": "bold" });
            } else if (!results) {
                console.log(data);
                idElement_err(idElement, 'false, no results');
            } else if (warnings) {
                idElement_err(idElement, 'false, warnings: ' + JSON.stringify(data));
            } else {
                idElement_err(idElement, 'false, results: ' + results);
            }
        }
    });

}

function check_image_exist(name, callback) {
    //---
    var api_url = 'auth/api.php?do=exists&filename=' + name;
    //---
    $.ajax({
        url: api_url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            var error = data.error;
            if (error) {
                callback(false, false, data);
                return;
            }
            var exists = data.exists;
            if (exists == 'true') {
                callback(true, false, data);
            } else if (exists == 'false') {
                callback(false, true, data);
            } else {
                callback(false, false, data);
            };
        },
        error: function (data) {
            // console.log(api_url + "&" + jQuery.param(params));
            callback(false, false, data);
        }
    });
    //---
}

function upload_f(file, id) {
    var idElement = $("#" + id);
    //---
    idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...');
    //---
    check_image_exist(file.name, function (exists, notexists, data) {
        console.log('check_image_exist' + JSON.stringify(data));
        if (notexists) {
            // استخدام الوظيفة المعدلة
            save_it(file, id).then(result => {
                // تم الحفظ بنجاح
                if (result === true) {
                    start_up(file, id);
                }
            })
        } else if (exists) {
            $('#name_' + id).html('<a href="https://nccommons.org/wiki/File:' + file.name + '" target="_blank">' + file.name + '</a>');
            idElement.text('File exists in NCC');
            idElement.css({ "color": "#f53333", "font-weight": "bold" });

        } else {
            // console.log(JSON.stringify(data));
            var error = data.error;
            if (error == "You haven't authorized this application yet!") {
                idElement.html($('#loginli').html());
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
