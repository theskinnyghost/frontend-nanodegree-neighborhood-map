var app = app || {};

app.init = function() {
    ko.applyBindings(new app.ListViewModel());
}