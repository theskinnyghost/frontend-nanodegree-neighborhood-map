var app = app || {};

app.TattooShop = function(shop) {
    var self = this;

    self.name = shop.name;
    self.address= shop.address;
    self.location = shop.location;
    self.rating = shop.rating;
    self.marker = null;
    self.yelp_data = {
        is_found: false
    };

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

                if(data.status === 'error') {

                    $('#error').text("We're sorry but there was an error with the API request.");

                    console.log(data.message);

                } else {

                    if(data.found_results > 0) {
                        self.yelp_data.is_found = true;
                        self.yelp_data.image = result.image_url;
                        self.yelp_data.phone = result.phone;
                        self.yelp_data.display_phone = result.display_phone;
                        self.yelp_data.rating = result.rating;
                        self.yelp_data.review_count = result.review_count;
                        self.yelp_data.url = result.url;
                    }

                }
            },
            error: function(data) {

                $('#error').text("We're sorry but there was an error with the API request.");

                console.log(data);
            }
        });
    };
};