// API key for OpenWeatherMap
const apiKey = "37598caafd8d626c1bcade9c751c5b90";

// DOM elements
const searchBtn = document.querySelector("#search-button");
const searchHistoryArea = document.querySelector(".input-group-append");

// Variables to store data
let storedLocations;
let coordinates;

// Flag to determine if the weather dashboard has been set
let flag = false;

// Function to fetch coordinates for a given location
// async function fetchCoordinates(location) {

//     if (location) {
//         const baseUrlCoordinates = "https://api.openweathermap.org/geo/1.0/direct";
//         const queryParams = new URLSearchParams({
//             'q': location,
//             'limit': '1',
//             'appid': apiKey
//         });

//         const queryURL = `${baseUrlCoordinates}?${queryParams}`;

//         try {
//             const response = await fetch(queryURL);
//             if (!response.ok) {
//                 return false;
//             }

//             const data = await response.json();
//             for (let i = 0; i < data.length; i++) {

//                 if (location == data[i].name) {
//                     return data[i];
//                 }
//                 //location name with two or more words // change filter criteria // input location is a part of retrieved location name
//                 else if (data[i].name.split(" ").length >= 2 && data[i].name.includes(location)) {
//                     return data[i];
//                 }
//             }
//             return false;
//         } catch (error) {
//             return false;
//         }
//     }
// }
function fetchCoordinates(location) {
    if (!location) return Promise.resolve(false);

    const baseUrlCoordinates = "https://api.openweathermap.org/geo/1.0/direct";
    const queryParams = new URLSearchParams({
        'q': location,
        'limit': '1',
        'appid': apiKey
    });

    const queryURL = `${baseUrlCoordinates}?${queryParams}`;

    return fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                return false;
            }
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (location === data[i].name) {
                    return data[i];
                }
                // Location name with two or more words, change filter criteria, input location is a part of retrieved location name
                else if (data[i].name.split(" ").length >= 2 && data[i].name.includes(location)) {
                    return data[i];
                }
            }
            return false;
        })
        .catch(error => {
            return false;
        });
}

// Function to fetch current weather for a given latitude and longitude
// async function fetchWeather(latitude, longitude) {

//     const baseUrlWeather = "https://api.openweathermap.org/data/2.5/weather";
//     const queryParams = new URLSearchParams({
//         'lat': latitude.toFixed(2),
//         'lon': longitude.toFixed(2),
//         'units': 'metric',
//         'appid': apiKey
//     });

//     const queryURL = `${baseUrlWeather}?${queryParams}`;

//     try {
//         const response = await fetch(queryURL);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const weatherData = await response.json();
//         return weatherData;
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//     }
// }
function fetchWeather(latitude, longitude) {
    const baseUrlWeather = "https://api.openweathermap.org/data/2.5/weather";
    const queryParams = new URLSearchParams({
        'lat': latitude.toFixed(2),
        'lon': longitude.toFixed(2),
        'units': 'metric',
        'appid': apiKey
    });

    const queryURL = `${baseUrlWeather}?${queryParams}`;

    return fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(weatherData => {
            return weatherData;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Function to fetch weather forecast for a given latitude and longitude
// async function fetchForecast(latitude, longitude) {
//     const baseUrlForecast = "https://api.openweathermap.org/data/2.5/forecast";
//     const queryParams = new URLSearchParams({
//         'lat': latitude.toFixed(2),
//         'lon': longitude.toFixed(2),
//         'units': 'metric',
//         'appid': apiKey
//     });

//     const queryURL = `${baseUrlForecast}?${queryParams}`;

//     try {
//         const response = await fetch(queryURL);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();

//         let offsetInSecondsFromUTC = data.city.timezone;
//         let forecastWeatherData = data.list;
//         let filteredWeatherData = [];

//         for (let i = 0; i < forecastWeatherData.length; i++) {

//             //getting UTC timestamp
//             let timeStamp = forecastWeatherData[i].dt_txt;

//             //changing UTC timestamp to local time timestamp
//             let timeStampLocal = timeStampUTCToTimeStampLocal(timeStamp, offsetInSecondsFromUTC);

//             //getting local time/hour
//             let hour = timeStampToHour(timeStampLocal);

//             //saving only early afternoon (local time) weather data
//             if (12 <= hour && hour < 15) {
//                 filteredWeatherData.push(forecastWeatherData[i])
//             }
//         }
//         return filteredWeatherData;
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//     }
// }

function fetchForecast(latitude, longitude) {
    const baseUrlForecast = "https://api.openweathermap.org/data/2.5/forecast";
    const queryParams = new URLSearchParams({
        'lat': latitude.toFixed(2),
        'lon': longitude.toFixed(2),
        'units': 'metric',
        'appid': apiKey
    });

    const queryURL = `${baseUrlForecast}?${queryParams}`;

    return fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let offsetInSecondsFromUTC = data.city.timezone;
            let forecastWeatherData = data.list;
            let filteredWeatherData = [];

            for (let i = 0; i < forecastWeatherData.length; i++) {
                // getting UTC timestamp
                let timeStamp = forecastWeatherData[i].dt_txt;

                // changing UTC timestamp to local time timestamp
                let timeStampLocal = timeStampUTCToTimeStampLocal(timeStamp, offsetInSecondsFromUTC);

                // getting local time/hour
                let hour = timeStampToHour(timeStampLocal);

                // saving only early afternoon (local time) weather data
                if (12 <= hour && hour < 15) {
                    filteredWeatherData.push(forecastWeatherData[i]);
                }
            }
            return filteredWeatherData;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

//helper functions for fetch calls
//changing UTC timestamp to location's local time timestamp 
function timeStampUTCToTimeStampLocal(utcTimeStamp, offsetSeconds) {
    const utcDateTime = new Date(utcTimeStamp + " UTC");
    // Add the offset to the UTC datetime
    const localDateTime = new Date(utcDateTime.getTime() + offsetSeconds * 1000);
    // Format the local time as a timestamp
    const localTimeStamp = localDateTime.toISOString().replace("T", " ").slice(0, 19);
    return localTimeStamp;
}

//retrieving hour from provided timestamp
function timeStampToHour(timeStamp) {
    const date = new Date(timeStamp);
    const hour = date.getHours();
    return hour;
}

// functions for UI
//creating and setting weather cards on the dashboard
function setWeatherDashboard() {
    const todaysWeatherElement = document.querySelector("#today");
    const weatherForecastElement = document.querySelector("#forecast");

    for (let day = 0; day < 6; day++) {
        let card = createCard(day);

        //if today append card to todaysWeatherElement
        if (day === 0) {
            todaysWeatherElement.appendChild(card);
        }

        //else append card to weatherForecastElement 
        else {
            weatherForecastElement.appendChild(card);
        }
    }
    addForecastHeading(weatherForecastElement);
}

//dynamically creating weather/forecast cards

function createCard(index) {
    const colDiv = document.createElement("div");
    if (index === 0) {
        colDiv.className = "col";
    }
    else {
        colDiv.className = "col-lg";
    }

    // Create main div element with class "card"

    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    // Create inner div element with class col

    const innerColDiv = document.createElement("div");
    innerColDiv.className = "col";

    // Create h3 element with id "date_index"

    const dateElement = document.createElement("h3");
    dateElement.id = "date_" + index;

    // Create img element with class "card-img", alt text, unique id "img_index"

    const imgElement = document.createElement("img");
    imgElement.className = "card-img";
    imgElement.alt = "Weather Image";
    imgElement.id = "img_" + index;

    // Append h3 and img elements to the "innerColDiv" div

    innerColDiv.appendChild(dateElement);
    innerColDiv.appendChild(imgElement);

    // Create div element with class "card-body"

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    // Create three p elements with unique ids "temp_index", "wind_index", "humidity_index"

    const tempElement = document.createElement("p");
    tempElement.id = "temp_" + index;

    const windElement = document.createElement("p");
    windElement.id = "wind_" + index;

    const humidityElement = document.createElement("p");
    humidityElement.id = "humidity_" + index;

    // Append p elements to the "card-body" div
    cardBodyDiv.appendChild(tempElement);
    cardBodyDiv.appendChild(windElement);
    cardBodyDiv.appendChild(humidityElement);

    // Append "innerColDiv" div and "card-body" div to the main "card" div
    cardDiv.appendChild(innerColDiv);
    cardDiv.appendChild(cardBodyDiv);
    colDiv.appendChild(cardDiv);

    // Return the created card div
    return colDiv;

}

function addForecastHeading(weatherForecastElement) {

    const heading = document.createElement("h3");

    heading.textContent = "5-day forecast:"

    weatherForecastElement.prepend(heading);

}

// getting current date in desired format dd/mm/yyyy
function currentDate() {

    // Create a new Date object representing the current date and time
    const currentDate = new Date();

    // Get individual components of the date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: Months are zero-based
    const day = currentDate.getDate();
    return `${day}/${month}/${year}`;
}

// fill in weather dashboard with fetched and processed data
// async function displayWeatherAndForecast() {

//     //if location has been found
//     if (coordinates) {

//         const latitude = coordinates.lat;
//         const longitude = coordinates.lon;

//         // Wait for the asynchronous fetchWeather operation to complete
//         const weatherData = await fetchWeather(latitude, longitude);

//         // Wait for the asynchronous fetchForecast operation to complete
//         const forecastData = await fetchForecast(latitude, longitude);

//         let data = [];
//         data = [weatherData, ...forecastData];

//         // Display  forecast
//         for (let i = 0; i < data.length; i++) {

//             // adding date to a card  
//             let dateArea = document.querySelector(`#date_${i}`);

//             //for current weather card
//             if (i === 0) {
//                 dateArea.textContent = coordinates.name + " (" + currentDate() + ") ";
//             }

//             //for weather forecast data
//             else {
//                 let timeStamp = data[i].dt_txt;
//                 dateArea.textContent = timeStampToFormattedDate(timeStamp);
//             }

//             //adding icon to a card

//             let iconArea = document.querySelector(`#img_${i}`);
//             let icon = data[i].weather[0].icon;
//             let iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
//             iconArea.setAttribute("src", iconURL);

//             //adding temperature to a card
//             let tempArea = document.querySelector(`#temp_${i}`);
//             let temp = data[i].main.temp;
//             tempArea.textContent = `Temp: ${temp}  °C`;

//             //adding wind speed to a card
//             let windArea = document.querySelector(`#wind_${i}`);
//             let windSpeed = data[i].wind.speed;
//             windArea.textContent = `Wind: ${windSpeed} m/s`;

//             //adding humidity to a card
//             let humidityArea = document.querySelector(`#humidity_${i}`);
//             let humidity = data[i].main.humidity;
//             humidityArea.textContent = `Humidity: ${humidity} %`;

//         } //end of for

//     } //end of if

// }
function displayWeatherAndForecast() {
    // If location has been found
    if (coordinates) {
        const latitude = coordinates.lat;
        const longitude = coordinates.lon;

        // Fetch weather and forecast data
        const weatherPromise = fetchWeather(latitude, longitude);
        const forecastPromise = fetchForecast(latitude, longitude);

        Promise.all([weatherPromise, forecastPromise])
            .then(results => {
                const weatherData = results[0];
                const forecastData = results[1];
                let data = [weatherData, ...forecastData];

                // Display forecast
                for (let i = 0; i < data.length; i++) {
                    // Adding date to a card  
                    let dateArea = document.querySelector(`#date_${i}`);

                    // For current weather card
                    if (i === 0) {
                        dateArea.textContent = coordinates.name + " (" + currentDate() + ") ";
                    } else {
                        // For weather forecast data
                        let timeStamp = data[i].dt_txt;
                        dateArea.textContent = timeStampToFormattedDate(timeStamp);
                    }

                    // Adding icon to a card
                    let iconArea = document.querySelector(`#img_${i}`);
                    let icon = data[i].weather[0].icon;
                    let iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                    iconArea.setAttribute("src", iconURL);

                    // Adding temperature to a card
                    let tempArea = document.querySelector(`#temp_${i}`);
                    let temp = data[i].main.temp;
                    tempArea.textContent = `Temp: ${temp} °C`;

                    // Adding wind speed to a card
                    let windArea = document.querySelector(`#wind_${i}`);
                    let windSpeed = data[i].wind.speed;
                    windArea.textContent = `Wind: ${windSpeed} m/s`;

                    // Adding humidity to a card
                    let humidityArea = document.querySelector(`#humidity_${i}`);
                    let humidity = data[i].main.humidity;
                    humidityArea.textContent = `Humidity: ${humidity} %`;
                } // End of for
            })
            .catch(error => {
                console.error('Error fetching weather or forecast data:', error);
            });
    } // End of if
}

//turn timestamp to dd/mm/yyyy date
function timeStampToFormattedDate(timeStamp) {
    const dateObject = new Date(timeStamp);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
}

// adding searched location to local storage

function addToSearchHistory(location) {
    
    if (location && coordinates && !storedLocations.includes(location)) {
        const button = createButton(location);
        searchHistoryArea.appendChild(button);
        saveToLocalStorage(location);
    }

}

// add buttons to search history area representing saved search history

function initialiseButtons() {
    searchBtn.className = "btn btn-primary mt-5";
    storedLocations = getFromLocalStorage();
    //checking if any data have been saved to local storage
    if (storedLocations) {
        for (let i = 0; i < storedLocations.length; i++) {
            button = createButton(storedLocations[i]);
            searchHistoryArea.appendChild(button);
        }
    }
}

//dynamically create buttons for searched and found locations

function createButton(location) {
    const buttonContainer = document.createElement("div");
    const button = document.createElement("button");
    button.className = "btn btn-secondary";
    button.setAttribute("data-location", location);
    button.textContent = location;
    button.style.width = "100%";
    button.style.color = "black";
    button.style.marginBottom = "1px";
    button.style.marginTop = "1px";
    buttonContainer.appendChild(button);
    return buttonContainer;
}

//display message about location not found or no input 
function displayMessage(message, duration) {
    const dashboard = document.querySelector("#dashboard")
    const messageArea = document.createElement("div");
    messageArea.className = "alert alert-danger";
    messageArea.style.textAlign = "center";
    messageArea.textContent = message;
    dashboard.prepend(messageArea);

    setTimeout(() => {
        messageArea.remove();
    }, duration);

}

//functions handling local storage

function saveToLocalStorage(location) {
    // Retrieve existing locations from local storage or initialize an empty array
    storedLocations = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // Add the new location to the array
    storedLocations.push(location);
    // Save the updated array back to local storage
    localStorage.setItem("searchHistory", JSON.stringify(storedLocations));
}

// retrieve data - locations from local storage
function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

//event listeners

searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const searchInput = document.querySelector("#search-input");
    const location = searchInput.value.trim();
    if (!location) {
        displayMessage("Please enter a location.", 5000);
        return;
    }

    coordinates = await fetchCoordinates(location);
    //if fetch returns false location doesn't exist in open weather database or there was an error

    if (!coordinates) {
        displayMessage(`Location ${location} not found.`, 5000);
        return;

    }

    // set weather dashboard only once per session  

    if (flag === false) {
        flag = true;
        setWeatherDashboard();
    }

    await displayWeatherAndForecast();
    addToSearchHistory(location);
});

searchHistoryArea.addEventListener("click", async function (event) {
    event.preventDefault();
    //check which exactly button from search history area was clicked excluding search button
    if (event.target.tagName === "BUTTON" && event.target.id !== "search-button") {
        const location = event.target.dataset.location;
        coordinates = await fetchCoordinates(location);
        if (coordinates) {
            //set weather dashboard once and only once for a session
            if (flag === false) {
                flag = true;
                setWeatherDashboard();
            }

            await displayWeatherAndForecast();
        }
    }
});

initialiseButtons();