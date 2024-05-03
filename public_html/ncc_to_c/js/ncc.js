

async function get_files_api(title) {
    var url = "https://nccommons.org/wiki/" + title + "?action=raw";

    var proxy = window.location.origin + '/ncc_to_c/get.php?type=json&url=';
    // if localhost use proxy
    // if (window.location.hostname === 'localhost') {
    url = proxy + encodeURIComponent(url);
    // }

    const response = await fetch(url);

    const data = await response.text();

    const matches = data.match(/File:(.*)\.(jpg|png|gif|jpeg)/g);

    var files = [];

    if (matches) {
        matches.forEach(match => {
            files.push(match);
            // console.log(match);
        });
    }

    // log lenth of files
    console.log("length" + files.length);
    $("#filescount").text("Files: (" + files.length + ")");
    return files;
}

function get_files() {
    $("#load_files").show();

    var title = $("#title").val();
    (async () => {
        const files = await get_files_api(title);

        // Join the files array into a string to set as the textarea value
        var filesText = files.join('\n');

        // Set the textarea value
        $("#files").val(filesText);

        $("#load_files").hide();

    })();

}
