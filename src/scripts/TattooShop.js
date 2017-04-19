var app = app || {};

app.TattooShop = function(shop) {
    var self = this;

    self.name = shop.name;
    self.address= shop.address;
    self.location = shop.location;
    self.rating = shop.rating;
    self.marker = null;
    self.info = "";

};