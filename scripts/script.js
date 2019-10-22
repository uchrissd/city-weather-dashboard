//Function to build the query URL's for the current weather API, UV index API and the 5-day forecast API
function buildQueryURL() {
  //Variable for API key
  var APIKey = "&APPID=8e6cd4b0a92515f9df6154e3e1a6497a";

  //Grab the user search input
  var userInput = $("#city-search").val();
  var search = "q=" + userInput + "&units=imperial";
  var forecastSearch = "q=" + userInput + "&units=imperial";

  //Variable for query URL to access the city weather API

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?" + search + APIKey;

  //Variable for the query URL to access the 5-day forecast by city API
  var fiveDayQueryURL =
    "https://api.openweathermap.org/data/2.5/forecast?" +
    forecastSearch +
    APIKey;

  // Call the current city weather API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Log the queryURL
    console.log(queryURL);
    // Log the resulting object
    console.log(response);

    //Longitute and latitude variables for UV idex
    var cityLon = "lon=" + response.coord.lon;
    var cityLat = "lat=" + response.coord.lat;

    console.log("This is lon: " + cityLon);
    console.log("This is lat: " + cityLat);

    //Variable for the UV index API call
    var uvIndexQueryURL =
      "http://api.openweathermap.org/data/2.5/uvi?" +
      APIKey +
      "&" +
      cityLat +
      "&" +
      cityLon;

    //Call the UV index api
    $.ajax({
      url: uvIndexQueryURL,
      method: "GET"
    }).then(function(UVresponse) {
      console.log("this is UV response:", UVresponse);
      //Generate HTML element for UV index
      $("#uv-index").text("UV Index: " + UVresponse.value);
    });

    //Generate HTML elements for current city weather data
    $("#current-city").html("<h1>" + response.name + " </h1>");
    $("#temp").text("Temperature (F) " + response.main.temp);
    $("#humidity").text("Humidity: " + response.main.humidity);
    $("#wind-speed").text("Wind Speed: " + response.wind.speed);
  });

  //Call the 5-day forecast API
  $.ajax({
    url: fiveDayQueryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response);

      //Function renders 5-day forecast
      function renderFiveDayForecast() {
        //Render the 5-Day Forecast title
        $("#five-day").html("<h2>" + "5-Day Forecast" + "</h2>");
        //Day 1 variables to set the HTML elements
        var dayOneDate = $("<h5>").html(response.list[3].dt_txt);
        var dayOneTemp = $("<p>").text(
          "Temperature (F) " + response.list[3].main.temp
        );
        var dayOneHum = $("<p>").text(
          "Humidity:" + response.list[3].main.humidity
        );
        //Append day 1 elements to the day one div
        $("#day-one").empty();
        $("#day-one").append(dayOneDate, dayOneTemp, dayOneHum);

        //Day 2 variables to set the HTML elements
        var dayTwoDate = $("<h5>").html(response.list[11].dt_txt);
        var dayTwoTemp = $("<p>").text(
          "Temperature (F) " + response.list[11].main.temp
        );
        var dayTwoHum = $("<p>").text(
          "Humidity: " + response.list[11].main.humidity
        );
        $("#day-two").empty();
        $("#day-two").append(dayTwoDate, dayTwoTemp, dayTwoHum);

        //Create HTML elements for day 3
        var dayThreeDate = $("<h5>").html(response.list[19].dt_txt);
        var dayThreeTemp = $("<p>").text(
          "Temperature (F) " + response.list[19].main.temp
        );
        var dayThreeHum = $("<p>").text(
          "Humidity: " + response.list[19].main.humidity
        );
        $("#day-three").empty();
        $("#day-three").append(dayThreeDate, dayThreeTemp, dayThreeHum);

        //Create HTML elements for day 4
        var dayFourDate = $("<h5>").html(response.list[27].dt_txt);
        var dayFourTemp = $("<p>").text(
          "Temperature (F) " + response.list[27].main.temp
        );
        var dayFourHum = $("<p>").text(
          "Humidity: " + response.list[27].main.humidity
        );
        $("#day-four").empty();
        $("#day-four").append(dayFourDate, dayFourTemp, dayFourHum);

        //Create HTML elements for day 5
        var dayFiveDate = $("<h5>").html(response.list[35].dt_txt);
        var dayFiveTemp = $("<p>").text(
          "Temperature (F) " + response.list[35].main.temp
        );
        var dayFiveHum = $("<p>").text(
          "Humidity: " + response.list[35].main.humidity
        );

        $("#day-five").empty();
        $("#day-five").append(dayFiveDate, dayFiveTemp, dayFiveHum);
      }
      renderFiveDayForecast();
    });
}

//Click handers

//Run search on click
$("#run-search").on("click", function(event) {
  event.preventDefault();
  buildQueryURL();
});
