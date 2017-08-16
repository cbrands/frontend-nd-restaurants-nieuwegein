// The model defines the data for this application it is a simple hardcoded
// list of restaurants
const restaurants = [
    {
        id: 0,
        name: "Jack’s Grillhouse",
        address: "Parkhout 1, Nieuwegein, NL",
        yelp: "https://www.yelp.com/biz/jacks-grillhouse-nieuwegein-2"
    },
    {
        id: 1,
        name: "Sushi & Grill Restaurant Goya",
        address: "Stadsplein 2E, Nieuwegein, NL",
        yelp: "https://www.yelp.com/biz/sushi-en-grill-restaurant-goya-nieuwegein"
    },
    {
        id: 2,
        name: "Pizza Grandi",
        address: "Walnootgaarde 44, Nieuwegein, NL",
        yelp: "https://www.yelp.com/biz/pizza-grandi-nieuwegein"
    }
];

let Location = (data) => {
    this.id = ko.obervable(data.id);
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
}

// This function defines the viewModel. This is were most of the code lives
// The ViewModel connects the view (html) with the model above
let ViewModel = function () {
    let self = this;

    this.numberOfRestaurants = restaurants.length;

    this.restaurantList = ko.observableArray([]);

    this.markerList = [];

    this.query = ko.observable("");

    this.geocoder;

    this.map;

    this.locationNieuwegein = {lat: 52.02917, lng: 5.08056};

    // Initializes the ViewModel()
    let init = function() {
        // Initializes the geocoder
        self.geocoder = new google.maps.Geocoder();

        // Fills the observable array with restaurants
        restaurants.forEach((restaurant) => {
            self.restaurantList.push(restaurant);
        })
        
        //Create the map and fill it with the markers
        self.createMap();
        self.addMarkers();
    }

    // This function loops over all thhe restaurants and uses the name and address of the 
    // restaurant to create a marker
    this.addMarkers = function() {
        for (let i = 0; i < self.numberOfRestaurants; i++) {
            let address = self.restaurantList()[i].address;
            let name = self.restaurantList()[i].name;

            self.geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == 'OK') {
                    let location = results[0].geometry.location;
                    self.map.setCenter(location);
                    let marker = new google.maps.Marker({
                        map: self.map,
                        title: name,
                        icon: self.pinSymbol('red'),
                        position: location
                    });

                    // Create a clicklistener for this marker
                    self.addClickListener(marker);

                    // add the marker to a markerList so we can easely access the marker
                    // from other functions
                    self.markerList.push(marker);
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }

    // This function creates a clicklistener for the given marker.
    // When the user clicks on the marker the title of the marker which is
    // the name of the restaurant is extracted and used as a parameter for the 
    // functions that do te actual selecting
    this.addClickListener = function(marker) {
        marker.addListener('click', function() {
            let selectedName = marker.getTitle();
            self.highlightSelectedItem(selectedName);
            self.highlightSelectedMarker(selectedName);
		});
    }
    
    // This function creates the google map
    this.createMap = function() {
        let mapProp= {
            center:new google.maps.LatLng(52.02917,5.08056),
            zoom:12,
        };
        self.map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    }
    
    // This function is called when a user selects an item from the list
    // it calls the appropiate function which do the actual selecting
    this.selectedFromList = function(item) {
        self.highlightSelectedItem(item.name);
        self.highlightSelectedMarker(item.name);
    }
    
    // This function loops over all the listItems removes the active 
    // class from the previous selected listItem and adds the active class
    // to the newlyselected listitem
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
    
    // This function colors the markers
    // It loops over all the markers
    // The markers who's title matches the selectedname is colored blue
    // the others are colored red
    this.highlightSelectedMarker = function(selectedName) {
        for(var i = 0; i < self.numberOfRestaurants; i++) {
            if(self.markerList[i].getTitle() === selectedName) {
                self.markerList[i].setIcon(self.pinSymbol('blue'));
            } else {
                self.markerList[i].setIcon(self.pinSymbol('red'));
            }
        }
    }
    
    // This function implements the functionality of the search box
    this.search = function() {
        //First convert the query to lower case and trim the whitespaces
        let queryLow = self.query().toLowerCase().trim();
        
        // Loop over all the list items
        // If it is already hidden by a previous query remove the hidden class
        // If the listitems name does not match the query hide it
        let listItems = $(".list-group-item");
        listItems.each(function( index ) {
            if($(this).hasClass("hidden")){
                $(this).removeClass("hidden");
            }
            if($(this).children(".name").text().toLowerCase().search(queryLow) < 0) {
                $(this).addClass("hidden");
            }
        });
        
        // Loop over all the markers. If the title matches the query set it to visible
        // otherwise make it invisible
        for(var i = 0; i < self.numberOfRestaurants; i++) {
            if(self.markerList[i].getTitle().toLocaleLowerCase().search(queryLow) < 0) {
                self.markerList[i].setVisible(false);
            } else {
                self.markerList[i].setVisible(true);
            }
        }
    }
    
    // This function returns an svg marker icon in the color specified
    // https://stackoverflow.com/questions/40289624/change-google-map-marker-color-to-a-color-of-my-choice
    this.pinSymbol = function(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 0.7
        };
    }
    
    init();
}

ko.applyBindings(new ViewModel());