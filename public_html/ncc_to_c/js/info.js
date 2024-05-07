
function idElement_err(idElement, err) {
    idElement.text(err);
    idElement.addClass("text-danger");
    idElement.css({ "font-weight": "bold" });
}

async function check_image_exist(name, site, callback) {
    //---
    return new Promise((resolve, reject) => {
        var params = {
            "action": "query",
            "format": "json",
            "titles": name,
            "prop": "imageinfo",
            "iiprop": "url",
            "formatversion": "2"
        }
        // {"action": "query", "format": "json", "prop": "imageinfo", "titles": title, "iiprop": "url", "formatversion": "2"}
        var url = 'https://' + site + '.org/w/api.php?' + jQuery.param(params);
        //---
        var proxy = window.location.origin + '/ncc_to_c/get.php?type=json&url=';
        url = proxy + encodeURIComponent(url);
        //---https://mdwiki.org/w/api.php?action=query&format=json&titles=File%3APD-icon.svg11&formatversion=2
        // console.log(url);
        //---
        $.ajax({
            async: true,
            url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
                // data not empty
                console.log(JSON.stringify(data));
                var item = data.query.pages[0];
                var exists = true;
                if (item.missing) {
                    exists = false;
                    console.log('exists=' + exists);
                }
                var img_url = "";
                if (item.imageinfo) {
                    img_url = item.imageinfo[0].url;
                }
                callback(exists, img_url);
                resolve();
            },
            error: function (data) {
                callback(false, false);
                resolve();
            }
        });
        //---
    });
}

async function find_info(id) {
    var file = $("#name_" + id).text();
    var idElement = $("#" + id);
    //---
    console.log('get File info..' + id);
    //---
    var site = 'nccommons';
    //---
    if ($("#SITE").text() == 'ncc_to_c2') {
        site = "commons.wikimedia";
    }
    //---
    await check_image_exist(file, site, function (exists, img_url) {
        if (exists) {
            $('#name_' + id).addClass("text-success");
            console.log('File exists..');
            $('#url_' + id).attr("name", "toup").attr("url", img_url).attr("idt", id);
            // start_up(file, img_url, id);
        } else {
            $('#name_' + id).addClass("text-danger");
            console.log('File not exists..');
            idElement_err(idElement, 'File not exists in  ' + site);
        }
    });
}

async function do_files() {

    const files = $(".files");

    for (let i = 0; i < files.length; i++) {
        var id = files[i].textContent;
        console.log("#" + id);
        //---
        await find_info(id);
    }

}
