var city=document.getElementById('city_name');
var searchBtn=document.getElementById('search');
var searchLoc=document.getElementById('locSearch');
var fourDaysCardsDiv=document.querySelector(".fourdays");
var CurrWeatherDiv=document.getElementById('curr_weather');

var for_onload_info_flag=0;
 
const apiKey=""; //  ATTENTION: please use your own "openweathermap" API key

const cityCoordinates=()=>{
  if(for_onload_info_flag==0){
    var cityName='Bangkok';
    for_onload_info_flag=1;
  }
  else{
    cityName=city.value.trim();
    if(!cityName)
    {alert("City Name can't be empty !");
      return;
    }
  }
    
    
 const geoCoding_url=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
 fetch(geoCoding_url).then(res=>res.json()).then(data=>{
    if(!data.length){
      alert(`Error in fetching co-ordinates from ${cityName}`);
      return;
    }
    // console.log(data);
    const {name,lon,lat}=data[0];
    getWeather(name,lon,lat);
 }).catch(()=>{
    alert("Oops...Error in fetching data!");
});
}

createweathercard=(nameCity,weatherDay,index)=>{
  // console.log(weatherDay);
   var dayName=" ";
  const day_= new Date(weatherDay.dt_txt.split(" ")[0]);
  var day_no=day_.getDay();
  switch (day_no) {
   case 0:
      dayName = "Sunday";
     break;
   case 1:
      dayName = "Monday";
     break;
   case 2:
      dayName = "Tuesday";
     break;
   case 3:
      dayName = "Wednesday";
     break;
   case 4:
      dayName = "Thursday";
     break;
   case 5:
      dayName = "Friday";
     break;
   case 6:
      dayName = "Saturday";
 }
 if(index===0){
   return `<div class="forecast-content">
   <h2 class="city">${nameCity}  (${weatherDay.dt_txt.split(" ")[0]})</h2>
   <p class="temp">Temperature: <span>${(weatherDay.main.temp-273.15).toFixed(2)}&deg;</span></p>
   <p class="wind">Wind: <span>${weatherDay.wind.speed} M/s</span></p>
   <p class="humidity">Humidity: <span>${weatherDay.main.humidity}% </span></p>
</div>
<div class="forecast-img">
<img src="http://openweathermap.org/img/wn/${weatherDay.weather[0].icon}@2x.png" alt="img">
<small>${weatherDay.weather[0].description}</small>
</div>`;
 }
   return `<div class="card">
   <p>${weatherDay.dt_txt.split(" ")[0]}</p>
   <small>${dayName}</small>
   <img src="http://openweathermap.org/img/wn/${weatherDay.weather[0].icon}@2x.png" alt="img">
   <p class="c-temp">Temperature: <span>${(weatherDay.main.temp-273.15).toFixed(2)}&deg;</span></p>
   <p class="c-wind">Wind: <span>${weatherDay.wind.speed} M/s</span></p>
   <p class="c-humidity">Humidity: <span>${weatherDay.main.humidity}%</span></p>
</div>`;
}



const getWeather=(name,lon,lat)=>{
   const weather_api=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
   fetch(weather_api).then(res=>res.json()).then(data=>{ 
      const forecast_Days=[];
      const fourDaysForecast=data.list.filter(forecast=>{
       const forecastDate=new Date(forecast.dt_txt).getDate();
       if(!forecast_Days.includes(forecastDate)){
         return forecast_Days.push(forecastDate);
       }
      });
      CurrWeatherDiv.innerHTML="";//clearing curr weather
      fourDaysCardsDiv.innerHTML=""; //clearing previous(without this,results would differ)
     fourDaysForecast.forEach((weatherDay,index)=>{
       if(index===5)
       { 
        return;
       }
       
      if(index===0){
        
        CurrWeatherDiv.insertAdjacentHTML("beforeend",createweathercard(name,weatherDay,index));
        return;
      }

      fourDaysCardsDiv.insertAdjacentHTML("beforeend",createweathercard(name,weatherDay,index));
     });
   }).catch(()=>{
      alert("Oops...Error in fetching weather forecast!");
  });
}

const getUserCoordinates=()=>{
  navigator.geolocation.getCurrentPosition(
    position=>{
        const {latitude,longitude}=position.coords;
        const REVERSE_geocoding_api=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

        fetch(REVERSE_geocoding_api).then(res=>res.json()).then(data=>{
          // console.log(data);
          var {name}=data[0];
          getWeather(name,longitude,latitude);
       }).catch(()=>{
          alert("Oops...Error in fetching city name!");
      });
    },
    error=>{
      if(error.code==error.PERMISSION_DENIED)
      alert("Permission Denied! Please allow access to location to get weather report.")
    }
  );
}


window.addEventListener('load',cityCoordinates);
searchLoc.addEventListener('click',getUserCoordinates);
searchBtn.addEventListener('click',cityCoordinates);
