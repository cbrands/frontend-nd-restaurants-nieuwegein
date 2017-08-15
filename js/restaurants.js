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
//let ViewModel = () => {
    let self = this;
    this.numberOfLocations = locations.length;
    
    this.locationList = ko.observableArray([]);

    let init = function() {
        locations.forEach((location) => {
            self.locationList.push(location);
        })

    }

    this.selectItem = function(selectedId) {
        for(let i = 0; i < self.numberOfLocations; i++){
            console.log(self.locationList()[i]);
            if (i === selectedId){
                self.locationList()[i].selected = true;
            } else {
                self.locationList()[i].selected = false;
            }
        }
    }
    
    this.selectedFromList = function(item) {
        console.log(item.id);
        console.log(item.name);
        self.selectItem(item.id);


        for(let i = 0; i < self.numberOfLocations; i++){
            console.log("blagh");
            console.log(self.locationList()[i].name, self.locationList()[i].selected);
        }
    }
    
    //this.highlightSelectedItem = function(selectedName)
    
    init();
}

ko.applyBindings(new ViewModel());