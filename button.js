var currentDate = moment().format("MMMM Do YYYY");
var currentDay = moment().format("dddd");
var clickCity = "";
var apiKey = "3a4dd83a114abb86edd8a975843229f2";

$(document).ready(function(){

$('.list-group-item list-group-item-action active').on("click", function () {
  clickCity = ($('.list-group-item list-group-item-action active').val());
  pastCityCall(clickCity);
});

function pastCityCall(city) {     
        
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
    
        $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {
              $("#currentCityName").text(city);
              $('#currentIcon').attr('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '.png');
              $("#currentDate").text(currentDay+ ", " + currentDate);
              $("#temp").text("Tempreture : " + Math.round(response.main.temp- 273.15) + " " + String.fromCharCode(176) + "C");
              $("#humidity").text("Humidity : " + response.main.humidity + " %");
              $("#windspeed").text("Wind Speed : " + response.wind.speed + " m/s");

              var latValue= response.coord.lat;
              var lonValue = response.coord.lon;
              
              var queryURLUV="https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latValue + "&lon=" + lonValue;
                
              $.ajax({
                  url: queryURLUV,
                  method: "GET"
                  }).then(function(response) {  
                    
                  $("#uvIndex").html(response.value);
      
                  var checkIndex = Math.round(response.value);
                  
                  if(checkIndex>=11){
                    $("#uvIndex").css("background-color","violet");
                  }
                  else if(checkIndex>=8 && checkIndex>=10){
                    $("#uvIndex").css("background-color","red");
                  }
                  else if(checkIndex>=7 && checkIndex>=6){
                    $("#uvIndex").css("background-color","orange");
                  }
                  else if(checkIndex>=5 && checkIndex>=3){
                    $("#uvIndex").css("background-color","yellow");
                  }
                  else {
                    $("#uvIndex").css("background-color","green");
                  }
                });

               var cityid = response.id;

               var queryURLForcast = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey + "&id=" + cityid;
               
               $.ajax({
                   url: queryURLForcast,
                   method: "GET"
               }).then(function(response) {
                   $("#forcast").prepend('<div class="card" style="width: 18rem" id = "forcastCard"></div>');
                   var breakPoint = [4, 12, 20, 28, 36];
                   for (i in breakPoint) {
                   var forcastID = "forecast_"+(parseInt(i)+1);
                   var date = moment.unix(response.list[breakPoint[i]].dt).format("MM/DD/YYYY");
                   var temp = Math.round(response.list[breakPoint[i]].main.temp - 273.15 ) + " " + String.fromCharCode(176) + "C";
                   var humidity = response.list[breakPoint[i]].main.humidity + "%";
                   var icon = response.list[breakPoint[i]].weather[0].icon; 
                   $(`#${forcastID}`).children(".f_city_name").text(date);
                   $(`#${forcastID}`).children(".f_temp").text(`Temp: ${temp}`);
                   $(`#${forcastID}`).children(".f_hum").text(`Humidity: ${humidity}`);
                   $(`#${forcastID}`).children(".f_image").children("img").remove(); //clear up existing image
                   $(`#${forcastID}`).children(".f_image").append($("<img>").attr("src", 'http://openweathermap.org/img/wn/'+ `${icon}` + '.png'));
                   }
               });
        });
    }
});