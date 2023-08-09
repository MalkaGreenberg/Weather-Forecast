localStorage.clear();

var displayForecast = function(input){
    
    var longitude = 0.0;
    var latitude = 0.0;

    // input = $("#userInput").val();
    console.log(input);
    var inputRequestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&APPID=a5c85031cb1fa3b5035542855d3e01a7";
    fetch(inputRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      console.log(latitude);
      console.log(longitude);
      getData(longitude,latitude);
      $(".results").css("display","block");
    });

    
}

var fiveDays = [
    $("#day1"),
    $("#day2"),
    $("#day3"),
    $("#day4"),
    $("#day5"),
]



var getData = function(lon,lat){
    console.log("lat: " + lat);
    console.log("lon: " + lon);
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" +lat + "&lon=" + lon + "&units=imperial&appid=a5c85031cb1fa3b5035542855d3e01a7";
    fetch(requestUrl)
    .then(function (response) {
        if(!(response.status === 200)){
            alert("That city name was invalid.");
            return response.json();
        } else {
            return response.json();
        }
        
    })
    .then(function (data) {
        
        var today = $(".today");
        var location = data.city.name;
        var todayDate = dayjs().format('M/D/YYYY');
        var link = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
        $(".todayDate").text(`${location} (${todayDate})`);
        today.children('img').attr("src", link);
        today.children('ul').children('.temp').text(`Temp: ${data.list[0].main.temp} °F`);
        today.children('ul').children('.wind').text(`Wind: ${data.list[0].wind.speed} MPH`);
        today.children('ul').children('.humidity').text(`Humidity: ${data.list[0].main.humidity}%`);

      var b = 1;
      for (var i = 0; i < fiveDays.length; i++) {
        link = `https://openweathermap.org/img/wn/${data.list[b].weather[0].icon}.png`;
        fiveDays[i].children('img').attr("src", link);
        fiveDays[i].children('h5').text(`(${dayjs(data.list[b].dt_txt).format('M/D/YYYY')})`);
        fiveDays[i].children('ul').children('.temp').text(`Temp: ${data.list[b].main.temp} °F`);
        fiveDays[i].children('ul').children('.wind').text(`Wind: ${data.list[b].wind.speed} MPH`);
        fiveDays[i].children('ul').children('.humidity').text(`Humidity: ${data.list[b].main.humidity}%`);
        b+=8;
      }
    });
}

var listItems = [];
var size = 0;
$('#searchBtn').on('click', function(event){
    event.preventDefault();
    var city = $("#userInput").val().trim();
    if(city){
        displayForecast(city);
    }
    
    var history = JSON.parse(localStorage.getItem("searchHistory"))||[];

    if(!history.includes(city) && !(city.equals(''))){
        history.push(city);
        var searched = $(".searchHistory").append(`<li class="listItem" id="${size}">${city}</li>`);
        listItems.push(city);
        size++;
        $(".searchHistory").append(searched);
    }
    

    localStorage.setItem("searchHistory", JSON.stringify(history));
    console.log(history);
    $("#userInput").val('');

});

$(document).on('click', ".listItem", function(event) {
    event.preventDefault();
    
    console.log(listItems[event.target.id]);
    displayForecast(listItems[event.target.id]);
    });

$(document).ready(function(){
    if($("#userInput").val().trim()){
        displayForecast($("#userInput").val().trim());
    }
})
