
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
    var formData = {
        action: "api",
        do: 'upload',
        filename: file,
        comment: 'comment',
        url: file_url,
    }
    //---
    var urlx = window.location.origin + '/ncc_to_c/' + api_url + '?' + $.param(formData);
    //---
    $.ajax({
        async: true,
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

async function start_up(file, img_url, id) {
    var idElement = $("#" + id);
    idElement.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading..');
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
        console.log(urlx);
        console.log(JSON.stringify(data));
        //---
        if (error) {
            $("#error_" + id).show();
            idElement_err(idElement, 'false: ' + error);
        } else if (!data) {
            idElement_err(idElement, 'false: no data');
        } else {
            var results = data.result;
            var warnings = data.warnings;
            if (results == "Success") {
                $('#name_' + id).html('<a href="https://commons.wikimedia.org/wiki/File:' + file + '" target="_blank">' + file + '</a>');
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

async function up_files() {

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
