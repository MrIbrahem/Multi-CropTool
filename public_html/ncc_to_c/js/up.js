
function idElement_err(idElement, err) {
    idElement.text(err);
    idElement.addClass("text-danger");
    idElement.css({ "font-weight": "bold" });
}

async function save_it(file, id) {
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
                        $("#save_" + id).html('<span class="bi bi-check2"></span> <a href="/mass/files/' + file + '" target="_blank">Saved!</a>');
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

async function upload_api(file, file_url, callback) {
    //---
    var api_url = 'auth.php';
    //---
    // remove "File:" from file name
    file = file.replace("File:", "");
    //---
    var formData = {
        a: 'upload',
        by: 'file',
        filename: file,
        comment: 'comment',
        url: file_url,
    }
    //---
    api_url = api_url + '?' + jQuery.param(formData);
    //---
    $.ajax({
        async: true,
        url: api_url,
        // data: formData,
        type: "GET",
        dataType: "json",
        success: function (data) {
            callback(null, data, api_url);
        },
        error: function (data) {
            callback('Error occurred', data, api_url);
        }
    });
}

async function start_up(file, img_url, id) {
    var idElement = $("#" + id);
    idElement.html('<i class="fa fa-upload"></i> Uploading..');
    //---
    await upload_api(file, img_url, function (err, data, urlx) {
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
        urlx = window.location.origin + '/ncc_to_c/' + urlx;
        //---
        console.log(urlx);
        console.log(JSON.stringify(data));
        //---
        if (error) {
            $("#error_" + id).show();
            idElement_err(idElement, 'false: ' + error);
        } else if (!data) {
            idElement_err(idElement, 'false: no data');
        } else {
            upload_Success(data, id, file, idElement);
        }
    });

}

function upload_Success(data, id, file, idElement) {
    var results = data.result;
    var warnings = data.warnings;

    if (results == "Success") {
        $("#success_" + id).show();
        $("#new_" + id).show();
        $('#name_' + id).addClass("text-success");
        $('#name_' + id).html('<a class="text-success" href="https://nccommons.org/wiki/' + file + '" target="_blank">' + file + '</a>');

        idElement.text('true');
        idElement.addClass("text-success");
        idElement.css({ "font-weight": "bold" });
        return true;

    };
    // ---
    var ero = 'false, results: ' + results;
    // ---
    if (!results) {
        console.log(data);
        ero = 'false, no results';
    } else if (warnings) {
        ero = 'false, warnings: ' + JSON.stringify(data)
    }
    //---
    idElement_err(idElement, ero);

}

async function up_files() {
    $.ajax({
        async: true,
        url: 'auth.php',
        data: { a: 'userinfo' },
        type: "GET",
        dataType: "json",
        success: function (data) {
            // { "batchcomplete": "", "query": { "userinfo": { "id": 1644737, "name": "Mr. Ibrahem", "rights": [ "read", "writeapi", "abusefilter-view", "abusefilter-log", "upload", "upload_by_url", "reupload-own", "reupload", "autoconfirmed", "editsemiprotected", "skipcaptcha", "abusefilter-log-detail", "transcode-reset" ] } } }
            var name = data.query.userinfo.name;
            if (!name) {
                name = JSON.stringify(data);
            }
            $('#login_sp').text(name);
        },
        error: function (data) {
            $('#login_sp').text(JSON.stringify(data));
        }
    });
    var to_up = document.getElementsByName('toup');

    if (to_up.length == 0) {
        return;
    }
    // do get crop for to_up elements
    for (var i = 0; i < to_up.length; i++) {
        var id = to_up[i].getAttribute("idt");
        var img_url = to_up[i].getAttribute("url");

        var imagename = $("#name_" + id).text();
        // var imagename = sessionStorage.getItem(id);

        console.log("up: id:" + id + " imagename:" + imagename);
        if (imagename != null && imagename != undefined && imagename != '') {
            await start_up(imagename, img_url, id);
        }
    };
}
