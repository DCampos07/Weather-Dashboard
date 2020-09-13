// Variables 
var searchButton = $(".searchButton");
var cityListEl = $("#city-list");

var apiKey = "b8ecb570e32c2e5042581abd004b71bb";

var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Forloop for persisting the data on the DOM
function loadHistory(){
    var list = document.getElementById("saved-searches");
    for (var i = 0; i < searchHistory.length; i++) {
        var cityName = document.createElement("li");
        var cityName2 = document.createElement("<a>");
        cityName2.setAttribute(href, "#");
        cityName.classList.add("saved-items");
        cityName.innerHTML = searchHistory [i];
        cityName.setAttribute("data-index", searchHistory[i]);
        cityName.append(cityName2);
        list.append(cityName);
    }
}

// Key count for local storage 
var keyCount = 0;

// Search button click event
searchButton.click(function () {

    var searchInput  = $(".searchInput").val();
    var list = document.getElementById("saved-searches");
    var cityName = document.createElement("li");
 

    cityName.innerHTML = searchInput;
           cityName.setAttribute("data-index", searchInput);
           cityName.classList.add("saved-items");
           list.append(cityName);
            
            // // Local storage
            // localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Variable for current weather working 
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 day forecast working
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";


    if (searchInput == "") {
       //
    
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            
            keyCount = keyCount + 1;

            // Start Current Weather append 
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            var currentName = currentCard.append("<p>");
            // .addClass("card-text");
            currentCard.append(currentName);

            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add Temp 
            var currentTemp = currentName.append("<p>");
            // .addClass("card-text");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // Add Humidity
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // Add Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // UV Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // UV Index
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (response) {

                var currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
                currentTemp.append(currentUV);
                // currentUV.append("UV Index: " + response.value);
            });

        });

        // Start call for 5-day forecast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
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

                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            })

        });
    }
});

// $(document).ready(function() {
//     $(“#searchInput”).keyup(function(event) {
//       if (event.which === 13) {
//         $(“.button-addon2").click();
//       }
//     });
//     $(“#submit”).click(function() {
//       alert(‘clicked!’);
//     })
//   });

$(".saved-items").on("click", function(){
    var city = $(this).attr(".data-city");
    console.log(city)
    alert ("hello");
    getCurrentWeather(city);
});

