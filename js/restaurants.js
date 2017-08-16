const restaurants = [
    {
        id: 0,
        name: "Jack’s Grillhouse",
        address: "Parkhout 1, Nieuwegein, NL",
        selected: false,
        yelp: "https://www.yelp.com/biz/jacks-grillhouse-nieuwegein-2"
    },
    {
        id: 1,
        name: "Sushi & Grill Restaurant Goya",
        address: "Stadsplein 2E, Nieuwegein, NL",
        selected: false,
        yelp: "https://www.yelp.com/biz/sushi-en-grill-restaurant-goya-nieuwegein"
    },
    {
        id: 2,
        name: "Pizza Grandi",
        address: "Walnootgaarde 44, Nieuwegein, NL",
        selected: false,
        yelp: "https://www.yelp.com/biz/pizza-grandi-nieuwegein"
    }
];

let Location = (data) => {
    this.id = ko.obervable(data.id);
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.selected = ko.observable(data.selected);
}

let ViewModel = function () {
    let self = this;
    
    this.numberOfRestaurants = restaurants.length;
    
    this.restaurantList = ko.observableArray([]);
    
    this.query = ko.observable("");
    
    this.geocoder;
    
    this.map;
    
    this.locationNieuwegein = {lat: 52.02917, lng: 5.08056};
    
    let init = function() {
        self.geocoder = new google.maps.Geocoder();
        restaurants.forEach((restaurant) => {
            self.restaurantList.push(restaurant);
        })
        self.createMap();
        self.addMarkers();
    }

    this.addMarkers = function() {
        for (let i = 0; i < self.numberOfRestaurants; i++) {
            let address = self.restaurantList()[i].address;
            console.log(address);
            self.geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == 'OK') {
                    self.map.setCenter(results[0].geometry.location);
                    let marker = new google.maps.Marker({
                        map: self.map,
                        position: results[0].geometry.location
                    });
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }

    this.createMap = function() {
        let mapProp= {
            center:new google.maps.LatLng(52.02917,5.08056),
            zoom:12,
        };
        self.map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    }
    
    this.selectItem = function(selectedName) {
        for(let i = 0; i < self.numberOfRestaurants; i++){
            if (self.restaurantList()[i].name === selectedName){
                self.restaurantList()[i].selected = true;
            } else {
                self.restaurantList()[i].selected = false;
            }
        }
    }
    
    this.selectedFromList = function(item) {
        self.selectItem(item.name);
        self.highlightSelectedItem(item.name);

    }
    
    this.highlightSelectedItem = function(selectedName) {
        let listItems = $(".list-group-item");
        listItems.each(function( index ) {
            if($(this).hasClass("active")){
                $(this).removeClass("active");
            }
            if($(this).children(".name").text() === selectedName){
                $(this).addClass("active");
            }
        });
    }
    
    this.search = function() {
        let queryLow = self.query().toLowerCase();
        console.log(queryLow);
        let listItems = $(".list-group-item");
        listItems.each(function( index ) {
            if($(this).hasClass("hidden")){
                $(this).removeClass("hidden");
            }
            if($(this).children(".name").text().toLowerCase().search(queryLow) < 0) {
                $(this).addClass("hidden");
            }
        });
    }
    
    init();
}

ko.applyBindings(new ViewModel());