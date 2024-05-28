let city = "";

const APIKey = "37598caafd8d626c1bcade9c751c5b90";
const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
const future =`http://api.openweathermap.org/data/2.5/forecast?l${city}&appid=${APIkey}`;



fetch(queryURL)
.then(function(response){
    return response.json();
})
.then(function(main){
    console.log(main)
})




function currentWeather(city){
    
   
   
}