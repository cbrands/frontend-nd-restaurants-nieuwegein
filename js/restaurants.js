const locations = [
    {
        name: "Jack’s Grillhouse",
        street: "Parkhout 1, Nieuwegein, NL",
        yelp: "https://www.yelp.com/biz/jacks-grillhouse-nieuwegein-2"
    },
    {
        name: "Sushi & Grill Restaurant Goya",
        street: "Stadsplein 2E, Nieuwegein, NL",
        yelp: "https://www.yelp.com/biz/sushi-en-grill-restaurant-goya-nieuwegein"
    },
    {
        name: "Pizza Grandi",
        street: "Walnootgaarde 44, Nieuwegein, NL",
        yelp: "https://www.yelp.com/biz/pizza-grandi-nieuwegein"
    }
];

let Location = (data) => {
    this.name = ko.observable(data.name);
    this.address=(data.address);
}

let ViewModel = function () {
//let ViewModel = () => {
    let self = this;
    this.locationList = ko.observableArray([]);
    let init = function() {
        locations.forEach((location) => {
            self.locationList.push(location);
        })
        
    }

    init();
}

ko.applyBindings(new ViewModel());