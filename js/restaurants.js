// The model defines the data for this application it is a simple hardcoded
// list of restaurants
const restaurants = [{
        name: "Jack’s Grillhouse",
        address: "Parkhout 1, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Sushi & Grill Restaurant Goya",
        address: "Stadsplein 2E, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Pizza Grandi",
        address: "Walnootgaarde 44, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Subway",
        address: "Stadsplein 2a, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Minos Pallas",
        address: "Handelskade 83, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Boerderij de Middenhof",
        address: "Handelskade 83, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "La Place",
        address: "Markt 56, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Restaurant without Foursquare information",
        address: "Halsterweide 1, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    },
    {
        name: "Googles nightmare",
        address: "Does not exist street 1, Nieuwegein, NL",
        marker: "",
        infowindow: ""
    }
];

let Location = (data) => {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.marker = ko.observable(data.marker);
    this.infowindow = ko.observable(data.infowindow);
};

// This function defines the viewModel. This is were most of the code lives
// The ViewModel connects the view (html) with the model above
let ViewModel = function() {
    let self = this;

    this.fsUrl = 'https://api.foursquare.com/v2/venues/search?',
        this.clientId = 'XLWYD0NUX2UPCCUGAFRTA0FRUR5ITQ550MDC35HBXP5RGJF5',
        this.clientSecret = 'CK4XGZHWFJ1CA4USGFPKD5D3ZYGVJDADX0IO3SJTXAKXKIPR';

    this.numberOfRestaurants = restaurants.length;

    this.restaurantList = ko.observableArray([]);

    this.markers = new ko.observableArray();

    this.query = ko.observable("");

    this.geocoder;

    this.map;

    this.locationNieuwegein = {
        lat: 52.02917,
        lng: 5.08056
    };

    // Initializes the ViewModel()
    let init = function() {
        // Initializes the geocoder
        self.geocoder = new google.maps.Geocoder();

        // Fills the observable array with restaurants
        restaurants.forEach((restaurant) => {
            self.restaurantList.push(restaurant);
        });

        //Create the map and fill it with the markers
        self.createMap();
        self.addMarkers();

    };

    // This function retrieves the foursquare data for a restaurant and puts the data in an infowindow 
    this.getVenueDetails = function(name, infoWindowCallback) {
        foursquareUrl = self.fsUrl + '&client_id=' + self.clientId + '&client_secret=' + self.clientSecret + '&v=20161207&query=' + name + '&ll=52.02917,5.08056';
        $.ajax(foursquareUrl).done(function(data) {
            let venue = data.response.venues[0];
            // if data is found i.e. venue != undefined then put the data in an infowindow else create an infowindow
            // with an errormessage
            if (venue) {
                let placeName = venue.name;
                let placeAddress = venue.location.formattedAddress;
                let placePhonenNumber = (venue.contact.formattedPhone === undefined) ? 'None' : venue.contact.formattedPhone;
                let foursquareLink = "https://foursquare.com/v/" + venue.id;
                windowContent = '<div id="iw_container"><p><strong>Name: </strong>' + placeName + '</p>' +
                    '<p><strong>Address: </strong>  ' + placeAddress + '</p>' +
                    '<p><strong>Phone: </strong>' + placePhonenNumber + '</p>' +
                    '<p>More info: ' + '<a href="' + foursquareLink + '" target="_blank">Click here</a></p></div>';
            } else {
                windowContent = '<div id="iw_container"><p>Foursquare information not found</p></div>';
            }
            infoWindowCallback(windowContent);
        }).fail(function(error) {
            windowContent = 'Fail to connect to Foursquare';
            infoWindowCallback(windowContent);
        });
    };

    // This function adds an infowindow to a marker
    this.addInfowindow = function(marker) {
        let contentString = '<div id="info-window">' +
            '</div>';
        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        return infowindow;
    };



    // This function loops over all the restaurants and uses the name and address of the 
    // restaurant to create a marker
    this.addMarkers = function() {
        for (let i = 0; i < self.numberOfRestaurants; i++) {
            let address = self.restaurantList()[i].address;
            let name = self.restaurantList()[i].name;

            self.geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == 'OK') {
                    let location = results[0].geometry.location;
                    self.map.setCenter(location);
                    let marker = new google.maps.Marker({
                        map: self.map,
                        title: name,
                        icon: self.pinSymbol('red', 0.7),
                        position: location
                    });

                    // Create a clicklistener for this marker
                    self.addClickListener(marker);

                    // add the marker to a markers observable array so we can easely access the marker
                    // from other functions
                    self.markers.push(marker);

                    // Add an infowindow to the marker
                    let anInfowindow = self.addInfowindow(marker);
                    for (let i = 0; i < self.numberOfRestaurants; i++) {
                        if (marker.title === self.restaurantList()[i].name) {
                            self.restaurantList()[i].marker = marker;
                            self.restaurantList()[i].infowindow = anInfowindow;
                        }
                    }

                    self.getVenueDetails(marker.title, function(windowContent) {
                        // including content to the Info Window.
                        anInfowindow.setContent(windowContent);
                    });


                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    };

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
    };

    // This function creates the google map
    this.createMap = function() {
        let mapProp = {
            center: new google.maps.LatLng(52.02917, 5.08056),
            zoom: 12,
        };
        self.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    };

    // This function is called when a user selects an item from the list
    // it calls the appropiate function which do the actual selecting
    this.selectedFromList = function(item) {
        self.highlightSelectedItem(item.name);
        self.highlightSelectedMarker(item.name);
    };

    // This function loops over all the listItems removes the active 
    // class from the previous selected listItem and adds the active class
    // to the newlyselected listitem
    this.highlightSelectedItem = function(selectedName) {
        let listItems = $(".list-group-item");
        listItems.each(function(index) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            }
            if ($(this).children(".name").text() === selectedName) {
                $(this).addClass("active");
            }
        });
    };

    // This function colors the markers
    // It loops over all the markers
    // The markers who's title matches the selectedname is colored blue
    // the others are colored red
    this.highlightSelectedMarker = function(selectedName) {
        for (var i = 0; i < self.numberOfRestaurants; i++) {
            let marker = self.markers()[i];
            let infoWindow;
            if (marker) {
                if (marker.getTitle() === selectedName) {
                    marker.setIcon(self.pinSymbol('blue', 1.0));
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 2050);
                    infoWindow = self.restaurantList()[i].infowindow;
                    infoWindow.open(self.map, marker);
                } else {
                    marker.setIcon(self.pinSymbol('red', 0.7));
                    infoWindow = self.restaurantList()[i].infowindow;
                    infoWindow.close(self.map, marker);
                }
            }
        }
    };

    // This function implements the functionality of the search box
    this.search = function() {
        //First convert the query to lower case and trim the whitespaces
        let queryLow = self.query().toLowerCase().trim();

        // Loop over all the list items
        // If it is already hidden by a previous query remove the hidden class
        // If the listitems name does not match the query hide it
        let listItems = $(".list-group-item");
        listItems.each(function(index) {
            if ($(this).hasClass("hidden")) {
                $(this).removeClass("hidden");
            }
            if ($(this).children(".name").text().toLowerCase().search(queryLow) < 0) {
                $(this).addClass("hidden");
            }
        });

        // Loop over all the markers. If the title matches the query set it to visible
        // otherwise make it invisible
        for (var i = 0; i < self.numberOfRestaurants; i++) {
            let aMarker = self.markers()[i];
            // First check if this marker exist i.e. this was a valid address
            if(aMarker) {
                if (self.markers()[i].getTitle().toLocaleLowerCase().search(queryLow) < 0) {
                    self.markers()[i].setVisible(false);
                    // Close the infowindow, if it is opened
                    self.restaurantList()[i].infowindow.close(self.map, self.restaurantList()[i].marker);
                } else {
                    self.markers()[i].setVisible(true);
                }
            }
        }
    };

    // This function returns an svg marker icon in the color specified
    // https://stackoverflow.com/questions/40289624/change-google-map-marker-color-to-a-color-of-my-choice
    this.pinSymbol = function(color, scale) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: scale
        };
    };

    init();
};

ko.applyBindings(new ViewModel());