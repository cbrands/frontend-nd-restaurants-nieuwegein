# frontend-nd-restaurants-nieuwegein

This project is my implementation for the myNeighborhood project in the Udacity Frontend developer Nanodegree.

## How to start

After this project is unzipped the application kan be started by simply opening index.html in the browser.

## How to use

At start the application shows a map of Nieuwegein to the left and a list of restaurants to the right. Hovering your mouse over a marker will show the name of the restaurant. 

You can select a restaurant by either clicking on the marker or by clicking on the restaurant name in the list. Either way the marker bounces a little, changes color (blue) and becomes a little bit bigger. The restaurant in the list becomes blue on selection as well. When a restaurant is selected a infowindow is shown above the marker. the infowindow shows the name, address, phonenumber collected from foursquare and a link to the foursquare site for this restaurant.

Above the list of restaurants you will find a search box. The searchbox works as you would expect. You can start typing and restaurants that do not match the query will disapear from the list and the marker will disapear from the map also.

## Architecture

This application uses the following frameworks.
* Bootstrap for styling and responsiveness. 
* Google map api to show the map and place the markers. 
* Foursquare api to retrieve additional information about the restaurant.
* Knockout framework to organise the code in an MVVM pattern.

## Note to the grader
This is a frontend application the "backend" consists of a hardcoded list of restaurants.

In this list you wil find 6 legitimate restaurants. Meaning valid address and existing on foursquare. 

You will find one nonexisting restaurant with a valid address to show that the application survives that no foursquare information is found. 

Also you will find a nonexisting restaurant with a nonexisting address to show that the application will survive if google can not find an address. 