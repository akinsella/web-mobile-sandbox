$(document).ready(function () {
    onReadyState();
});

function onReadyState() {
    (function ($) {
        var viewModel;

        $.ajax({
            url:'http://devoxx-xebia.cloudfoundry.com/rest/v1/events/6/presentations?callback=?',
            success:function (data) {
                viewModel = ko.mapping.fromJS(data);
                ko.applyBindings(viewModel);
                $("#presentations").show();
            }
        });
    })($);
}
