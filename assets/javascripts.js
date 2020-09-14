// Variables 
var searchButton = $(".searchButton");
var cityListEl = $("#city-list");
var cityHistory = $("#saved-searches");
var apiKey = "b8ecb570e32c2e5042581abd004b71bb";
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var city = "" || searchHistory[0];
// getWeather(city);
// Forloop for persisting the data on the DOM
function loadHistory(){
    for (var i = 0; i < searchHistory.length; i++) {
        var historyDivs = $('<div>');
        historyDivs.addClass("saved-items");
        historyDivs.addClass('list-group-item');
        historyDivs.innerHTML(searchHistory[i]);
        historyDivs.attr("data-index", searchHistory[i]);
        cityHistory.append(historyDivs);
    }
}
// Key count for local storage 
// var keyCount = 0;
function getWeather(city){
  // Variable for current weather working
  var urlCurrent =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&Appid=" +
    apiKey +
    "&units=imperial";
  // Variable for 5 day forecast working
  var urlFiveDay =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&Appid=" +
    apiKey +
    "&units=imperial";
  if (city !== "") {
    $.ajax({
      url: urlCurrent,
      method: "GET",
    }).then(function (response) {
    //   keyCount = keyCount + 1;
      // Start Current Weather append
      var currentCard = $(".currentCard").append("<div>").addClass("card-body");
      currentCard.empty();
      var currentName = currentCard.append("<p>");
      // .addClass("card-text");
      currentCard.append(currentName);
      // Adjust Date
      var timeUTC = new Date(response.dt * 1000);
      currentName.append(
        response.name + " " + timeUTC.toLocaleDateString("en-US")
      );
      currentName.append(
        `<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`
      );
      // Add Temp
      var currentTemp = currentName.append("<p>");
      // .addClass("card-text");
      currentName.append(currentTemp);
      currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
      // Add Humidity
      currentTemp.append(
        "<p>" + "Humidity: " + response.main.humidity + "%" + "</p>"
      );
      // // Add Wind Speed:
      currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");
      // UV Index URL
      var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;
      // UV Index
      $.ajax({
        url: urlUV,
        method: "GET",
      }).then(function (response) {
        var currentUV = currentTemp
          .append("<p>" + "UV Index: " + response.value + "</p>")
          .addClass("card-text");
        currentUV.addClass("UV");
        currentTemp.append(currentUV);
        // currentUV.append("UV Index: " + response.value);
      });
    });
    // Start call for 5-day forecast
    $.ajax({
      url: urlFiveDay,
      method: "GET",
    }).then(function (response) {
      // Array for 5-days
      var day = [0, 8, 16, 24, 32];
      var fiveDayCard = $(".fiveDayCard").addClass("card-body");
      var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
      fiveDayDiv.empty();
      // For each for 5 days
      day.forEach(function (i) {
        var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
        FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");
        fiveDayDiv.append(
          "<div class=fiveDayColor>" +
            "<p>" +
            FiveDayTimeUTC1 +
            "</p>" +
            `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` +
            "<p>" +
            "Temperature: " +
            response.list[i].main.temp +
            "</p>" +
            "<p>" +
            "Humidity: " +
            response.list[i].main.humidity +
            "%" +
            "</p>" +
            "</div>"
        );
      });
    });
  }
};
// Search button click event
searchButton.click(function (event) {
    event.preventDefault();
    var searchInput = $(".searchInput").val();
    if (searchInput !== "") {
        // var list = $("#saved-searches");
        var cityName = $("<li>");
        var cityName2 = $("<a>");
        cityName2.attr("href","#");
        cityName2.text(searchInput);
        cityName.attr("data-index", searchInput);
        cityName.addClass("saved-items");
        // cityName.text(searchInput);
        // // Local storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        cityName.append(cityName2);
        cityHistory.append(cityName);
    }
    getWeather(searchInput);
});
$(document).on("click", ".saved-items", function(){
    var city = $(this).attr("data-index");
    console.log(city)
    getWeather(city);
});
$(document).ready(function() {
    loadHistory();
  });