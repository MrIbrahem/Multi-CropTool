
function initAutocomplete(selector) {
    // @ts-ignore
    var site = "nccommons";
    if ($("#SITE").text() == 'ncc_to_c2') {
        site = "commons.wikimedia";
    }
    $(selector).autocomplete({
        source: function (request, response) {
            // make AJAX request to Wikipedia API
            $.ajax({
                url: "https://" + site + ".org/w/api.php",
                dataType: "jsonp",
                data: {
                    action: "query",
                    format: "json",
                    list: "allpages",
                    apfrom: request.term
                    // list: "prefixsearch",
                    // pssearch: request.term,
                    // psnamespace: 0,
                    // cirrusUseCompletionSuggester: "yes"
                },
                success: function (data) {
                    // extract titles from API response and pass to autocomplete
                    response($.map(data.query.allpages, function (item) {
                        return item.title;
                    }));
                }
            });
        }
    });
}
