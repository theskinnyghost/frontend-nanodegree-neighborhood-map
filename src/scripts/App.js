/*
https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/4fd8d440-9428-4de7-93c0-4dca17a36700/lessons/2711658591239847/concepts/26906985370923
*/

var app = app || {};
var map;

function initMap() {
    map = new google.maps.Map( document.getElementById('map'), {
        zoom: 12,
        center: {lat: -31.950527, lng: 115.860457}
    });

    ko.applyBindings(new app.ListViewModel());
}

app.TattooShop = function(shop) {
    var self = this;

    self.name = shop.name;
    self.address= shop.address;
    self.location = shop.location;
    self.rating = shop.rating;

    self.marker = new google.maps.Marker({
        position: self.location,
        map: map,
        title: self.name,
        animation: google.maps.Animation.DROP,
        icon: '/src/images/icon.png'
    });

    self.infoWindow = new google.maps.InfoWindow({
        content: '<div>' + self.name + '</div>'
    });

    self.marker.addListener('click', function() {
        self.openInfoWindow();
    });

    self.openInfoWindow = function() {
        self.infoWindow.open(map, self.marker);

        if (self.marker.getAnimation() !== null) {
            self.marker.setAnimation(null);
        } else {
            self.marker.setAnimation(google.maps.Animation.lo);
        }
    };

    self.focusOnElement = function() {
        self.openInfoWindow();
    };
};

app.ListViewModel = function() {
    var self = this;
    self.places = ko.observableArray([]);

    for(var i = 0, l = app.Model.length; i < l; i++) {
        self.places().push(new app.TattooShop(app.Model[i]));
    }
};