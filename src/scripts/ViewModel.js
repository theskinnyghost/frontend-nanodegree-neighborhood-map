var app = app || {};

/**
 *
 */
app.ListViewModel = function() {
    var self = this;

    self.places = [];
    self.visiblePlaces = ko.observableArray([]);
    self.searchQuery = ko.observable("");
    self.shouldShowCurrentPlace = ko.observable(false);
    self.currentPlace = ko.observable();

    self.closeInfoBox = function() {
        self.currentPlace(null);
        self.shouldShowCurrentPlace(false);
    }

    self.showCurrentPlace = function(place) {
        self.currentPlace(place);
        self.shouldShowCurrentPlace(true);
        if (place.marker.getAnimation() !== null) {
            place.marker.setAnimation(null);
        } else {
            place.marker.setAnimation(google.maps.Animation.lo);
        }
    };

    // Build the google map object.
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -31.950527, lng: 115.860457},
        zoom: 12,
        mapTypeControl: false,
        gestureHandling: 'cooperative'
    });

    // Create new TattooShop object for each item in the model
    // and push it into the places array
    app.Model.forEach(function(place) {
        self.places.push(new app.TattooShop(place));
    });

    // Set a new Marker for each place
    // and bind a click event
    self.places.forEach(function(place) {
        place.marker = new google.maps.Marker({
            position: place.location,
            map: self.map,
            title: place.name,
            animation: google.maps.Animation.DROP,
            icon: '/src/images/icon.png'
        });

        place.marker.addListener('click', function() {
            self.showCurrentPlace(place);
        });
    });

    self.places.forEach(function(place) {
        self.visiblePlaces.push(place);
    });

    //
    self.filterMarkers = function() {
        var search = self.searchQuery().toLowerCase();

        self.visiblePlaces.removeAll();

        self.closeInfoBox();

        self.places.forEach(function(place) {
            place.marker.setVisible(false);

            if(place.name.toLowerCase().indexOf(search) >= 0) {
                self.visiblePlaces.push(place);
                place.marker.setVisible(true);
            }
        });
    };

};