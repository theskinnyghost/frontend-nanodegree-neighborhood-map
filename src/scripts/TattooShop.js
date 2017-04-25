var app = app || {};

app.TattooShop = function(shop) {
    var self = this;

    self.name = shop.name;
    self.address= shop.address;
    self.location = shop.location;
    self.marker = null;
    self.yelp_data = {
        is_found: false
    };

    /** Send an Ajax request to retrieve shops data with the YELP API. */
    self.setData = function() {
        $.ajax({
            url: 'api.php',
            data: {
                'search_term': self.name,
                'latitude': self.location.lat,
                'longitude': self.location.lng
            },
            dataType: 'json',
            success: function(data) {
                var result = data.results;

                /** If the request goes wrong print an error message */
                if(data.status === 'error') {

                    $('#error').text("We're sorry but there was an error with the API request.");

                    console.log(data.message);

                } else {

                    /** Otherwise if we find results setup shop data */
                    if(data.found_results > 0) {
                        self.yelp_data.is_found = true;
                        self.yelp_data.image = result.image_url;
                        self.yelp_data.phone = result.phone;
                        self.yelp_data.display_phone = result.display_phone;
                        self.yelp_data.url = result.url;
                    }

                }
            },
            error: function(data) {
                /** If the request goes wrong print an error message */
                $('#error').text("We're sorry but there was an error with the API request.");

                console.log(data);
            }
        });
    };
};