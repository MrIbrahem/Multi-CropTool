
function user_login() {
    var url = 'https://nccroptool.toolforge.org/api/auth/user';
    if (window.location.hostname == 'localhost') {
        var text = 'Authorized as <span id="username" style="color:blue;">Mr. Ibrahem</span>';
        $('#user_login').html(text);
        sessionStorage.setItem('username', 'Mr. Ibrahem');
        return;
    }
    jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.user) {
                var text = 'Authorized as <span id="username" style="color:blue;">' + data.user + '</span>';
                $('#user_login').html(text);
                sessionStorage.setItem('username', data.user);
            }
        }
    });

};
