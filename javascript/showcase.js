$(document).ready(function () {
    onReadyState();
});

function onReadyState() {
    (function ($) {
      initRouter();
    })($);
}

function initRouter() {

    // OK
    var currentView = null;

    // OK
    var routes = {
        '/': function() {
            // Do Nothing
        },
        '/css3-transition-opacity': function() {
            var page = 'css3-transition-opacity';
            $.ajax({
                url: 'pages/' + page + '/index.html',
                cache: false,
                dataType: 'html',
                success: function(data) {
                    var html = $('<html />').html(data);
                    var content = $(html).find('#content');
                    $('#detail').html(content);
                }
            });

            $('#styles').attr('href', 'pages/' + page + '/styles.css');

            setTimeout(function() { prettyPrint(); }, 100);
        }
    };

    // OK
    Router(routes).configure({
        on: function(){
            amplify.store('hacker-hash', location.hash);
        },
        notfound: function(){
            location.hash = '/';
        }
    }).init(amplify.store('hacker-hash') || '/');

}
