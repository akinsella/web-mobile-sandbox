amplify.request.define("twitter-search", "ajax", {
    url: "http://search.twitter.com/search.json",
    dataType: "jsonp",
    dataMap: {
        term: "q"
    }
});

$(document).ready(function() {

    (function($) {

        var viewModel;

        amplify.request("twitter-search", "q=html5&rpp=5", function(data) {
            viewModel = ko.mapping.fromJS(data);
            ko.applyBindings(viewModel);

        });

        $("#refresh").click(function() {
            amplify.request("twitter-search", "q=html5&rpp=5", function(data) {
                ko.mapping.fromJS(data, viewModel);

            });
        });

    })(jQuery);

});