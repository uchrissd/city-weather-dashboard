//Function for checking local storage

var userSearchArray = localStorage.getItem("userInputStorage");
userSearchArray = JSON.parse(userSearchArray) || [];
var APIKey = "8e6cd4b0a92515f9df6154e3e1a6497a";

console.log("this is storage" + userSearchArray);
renderSearchHistory();

//Click handers

//Run search on click
$("#run-search").on("click", function(event) {
  event.preventDefault();
  var userInput = $("#city-search").val();
  checkValidity(userInput);
  console.log("This is the user input:" + userInput);
});

$(".search").on("click", function(event) {
  event.preventDefault();
  var searchHistory = $(this).text();

  console.log(searchHistory);
  buildAPICall(searchHistory);
});
//Check weather the search term passed by the user is valid for the API call
function checkValidity(userInput) {
  if ((userInput === null) | (userInput === "")) {
    console.log("it's empty!");
    // add code to show user it's empty!!
  } else {
    //Call the APIs
    buildAPICall(userInput);
    userSearchArray.push(userInput);
    localStorage.setItem("userInputStorage", JSON.stringify(userSearchArray));
    console.log(userSearchArray);
    var newButton = $("<button>");
    newButton.addClass("search list-group-item list-group-item-action");
    newButton.text(userInput);
    $("#search-list").append(newButton);
  }
}

//Second click event for buttons
function renderSearchHistory() {
  console.log(userSearchArray);

  for (var i = 0; i < userSearchArray.length; i++) {
    // $("#search-list").empty();
    var button = $("<button>");
    button.addClass("search list-group-item list-group-item-action");
    button.text(userSearchArray[i]);

    $("#search-list").append(button);
  }
  console.log("this is the user array: " + userSearchArray);
}

//Function to build the query URL's for the current weather API, UV index API and the 5-day forecast API
function buildAPICall(userInput) {
  try {
    var search = "q=" + userInput + "&units=imperial";
    var forecastSearch = "q=" + userInput + "&units=imperial";

    //Variable for query URL to access the city weather API

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?" +
      search +
      "&APPID=" +
      APIKey;

    //Variable for the query URL to access the 5-day forecast by city API
    var fiveDayQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?" +
      forecastSearch +
      "&APPID=" +
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
        "&APPID=" +
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
      // Create object for API data
      .then(function(response) {
        renderFiveDayForecast(response);
      });
    //Return is user passes an error
  } catch (err) {
    return err;
  }
}

//Function renders 5-day forecast
function renderFiveDayForecast(response) {
  //Render the 5-Day Forecast title
  $("#five-day").html("<h2>" + "5-Day Forecast" + "</h2>");
  //Day 1 variables to set the HTML elements
  var dayOneDate = $("<h6>").html(response.list[3].dt_txt);
  var dayOneIconId = response.list[3].weather[0].icon;
  var dayOneIconImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + dayOneIconId + "@2x.png"
  );
  var dayOneTemp = $("<p>").text(
    "Temperature (F) " + response.list[3].main.temp
  );
  var dayOneHum = $("<p>").text("Humidity:" + response.list[3].main.humidity);
  //Append day 1 elements to the day one div
  $("#day-one").empty();
  $("#day-one").append(dayOneDate, dayOneIconImage, dayOneTemp, dayOneHum);

  //Render current day date and icon
  var currentCityDate = $("<h5>").html(response.list[3].dt_txt);
  var currentCityIcon = response.list[3].weather[0].icon;
  var currentCityIconImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + currentCityIcon + "@2x.png"
  );

  $("#current-city-date").empty();
  $("#current-city-date").append(currentCityDate);
  $("#current-city-icon").empty();
  $("#current-city-icon").append(currentCityIconImage);

  //Day 2 variables to set the HTML elements
  var dayTwoDate = $("<h6>").html(response.list[11].dt_txt);
  var dayTwoIconId = response.list[3].weather[0].icon;
  var dayTwoIconImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + dayTwoIconId + "@2x.png"
  );

  var dayTwoTemp = $("<p>").text(
    "Temperature (F) " + response.list[11].main.temp
  );
  var dayTwoHum = $("<p>").text("Humidity: " + response.list[11].main.humidity);
  $("#day-two").empty();
  $("#day-two").append(dayTwoDate, dayTwoIconImage, dayTwoTemp, dayTwoHum);

  //Create HTML elements for day 3
  var dayThreeDate = $("<h6>").html(response.list[19].dt_txt);

  var dayThreeIconId = response.list[19].weather[0].icon;
  var dayThreeIconImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + dayThreeIconId + "@2x.png"
  );
  var dayThreeTemp = $("<p>").text(
    "Temperature (F) " + response.list[19].main.temp
  );
  var dayThreeHum = $("<p>").text(
    "Humidity: " + response.list[19].main.humidity
  );
  $("#day-three").empty();
  $("#day-three").append(
    dayThreeDate,
    dayThreeIconImage,
    dayThreeTemp,
    dayThreeHum
  );

  //Create HTML elements for day 4
  var dayFourDate = $("<h6>").html(response.list[27].dt_txt);
  var dayFourIconId = response.list[3].weather[0].icon;
  var dayFourIconImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + dayFourIconId + "@2x.png"
  );
  var dayFourTemp = $("<p>").text(
    "Temperature (F) " + response.list[27].main.temp
  );
  var dayFourHum = $("<p>").text(
    "Humidity: " + response.list[27].main.humidity
  );
  $("#day-four").empty();
  $("#day-four").append(dayFourDate, dayFourIconImage, dayFourTemp, dayFourHum);

  //Create HTML elements for day 5
  var dayFiveDate = $("<h6>").html(response.list[35].dt_txt);
  var dayFiveIconId = response.list[3].weather[0].icon;
  var dayFiveIconImage = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + dayFiveIconId + "@2x.png"
  );
  var dayFiveTemp = $("<p>").text(
    "Temperature (F) " + response.list[35].main.temp
  );
  var dayFiveHum = $("<p>").text(
    "Humidity: " + response.list[35].main.humidity
  );

  $("#day-five").empty();
  $("#day-five").append(dayFiveDate, dayFiveIconImage, dayFiveTemp, dayFiveHum);
}
