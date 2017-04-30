var app = app || {};

/** Initialize the application */
app.init = function() {
    ko.applyBindings(new app.ListViewModel());
};

/** Handle Google Maps API error */
app.handleError = function() {
    $('#error').text("We're sorry but there was an error loading Google Maps API.");
    $('.wrapper').hide();
};