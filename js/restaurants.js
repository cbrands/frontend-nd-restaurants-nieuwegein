const locations = [
    {
        id: 0,
        name: "Jack’s Grillhouse",
        street: "Parkhout 1, Nieuwegein, NL",
        selected: false,
        yelp: "https://www.yelp.com/biz/jacks-grillhouse-nieuwegein-2"
    },
    {
        id: 1,
        name: "Sushi & Grill Restaurant Goya",
        street: "Stadsplein 2E, Nieuwegein, NL",
        selected: false,
        yelp: "https://www.yelp.com/biz/sushi-en-grill-restaurant-goya-nieuwegein"
    },
    {
        id: 2,
        name: "Pizza Grandi",
        street: "Walnootgaarde 44, Nieuwegein, NL",
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
    this.numberOfLocations = locations.length;
    
    this.locationList = ko.observableArray([]);
    this.query = ko.observable("");
    let init = function() {
        locations.forEach((location) => {
            self.locationList.push(location);
        })

    }

    this.selectItem = function(selectedName) {
        for(let i = 0; i < self.numberOfLocations; i++){
            if (self.locationList()[i].name === selectedName){
                self.locationList()[i].selected = true;
            } else {
                self.locationList()[i].selected = false;
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