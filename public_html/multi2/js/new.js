
function post_new_request() {
    var url = window.location.href;
    var params = {
        x: $('#x').html(),
        y: $('#y').html(),
        width: $('#width').html(),
        height: $('#height').html(),
        text: $('.new_textarea').val()
    };

    // إرسال طلب POST
    url = url + '?' + jQuery.param(params);
    window.open(url, '_blank');
}
