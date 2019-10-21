//Function to build the query URL

//Variable for API key
var APIKey = "8e6cd4b0a92515f9df6154e3e1a6497a";

//Grab the user search input
var userInput = $("#city-search").val();
var search = "q=" + userInput + '&units=imperial&appid="';
//Variable for query URL to access API

var queryURL =
  "https://api.openweathermap.org/data/2.5/weather?" + search + APIKey;

// Logging the URL so we have access to it for troubleshooting

console.log("---------------\nURL: " + queryURL + "\n---------------");
console.log(queryURL);

//Click handlers
$("#run-search").on("click", function(event) {
  event.preventDefault();
  alert(userInput);

  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response);
    });
});
