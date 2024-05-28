$(document).ready(function () {
    const apiKey = '37598caafd8d626c1bcade9c751c5b90';
    const searchForm = $('#search-form');
    const cityInput = $('#city-input');
    const currentWeather = $('#current-weather');
    const forecast = $('#forecast');
    const searchHistory = $('#search-history');

    searchForm.on('submit', function (e) {
        e.preventDefault();
        const city = cityInput.val().trim();
        getWeather(city);
        cityInput.val('');
    });

    function getWeather(city) {
        const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        $.ajax({
            url: currentWeatherURL,
            method: 'GET',
            success: function (data) {
                displayCurrentWeather(data);
                saveSearchHistory(city);
            },
            error: function (error) {
                console.log('Error fetching current weather:', error);
            }
        });

        $.ajax({
            url: forecastURL,
            method: 'GET',
            success: function (data) {
                displayForecast(data);
            },
            error: function (error) {
                console.log('Error fetching forecast:', error);
            }
        });
    }

    function displayCurrentWeather(data) {
        const cityName = data.name;
        const date = new Date(data.dt * 1000); // Convert Unix timestamp to milliseconds
        const iconCode = data.weather[0].icon;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        const currentWeatherHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${cityName}</h5>
                    <p class="card-text">Date: ${date.toDateString()}</p>
                    <img src="${iconUrl}" class="card-img-top" alt="Weather Icon">
                    <p class="card-text">Temperature: ${temperature}°C</p>
                    <p class="card-text">Humidity: ${humidity}%</p>
                    <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                </div>
            </div>
        `;

        currentWeather.html(currentWeatherHTML);
    }

    function displayForecast(data) {
        const forecastItems = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Selecting forecasts for 12:00 PM
        let forecastHTML = '';

        forecastItems.forEach(item => {
            const date = new Date(item.dt * 1000); // Convert Unix timestamp to milliseconds
            const iconCode = item.weather[0].icon;
            const temperature = item.main.temp;
            const humidity = item.main.humidity;
            const windSpeed = item.wind.speed;

            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

            const forecastCardHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${date.toDateString()}</h5>
                        <img src="${iconUrl}" class="card-img-top" alt="Weather Icon">
                        <p class="card-text">Temperature: ${temperature}°C</p>
                        <p class="card-text">Humidity: ${humidity}%</p>
                        <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                    </div>
                </div>
            `;

            forecastHTML += forecastCardHTML;
        });

        forecast.html(forecastHTML);
    }

    function saveSearchHistory(city) {
        // Save search history
        // You can use localStorage to store the search history
        let searchHistoryData = localStorage.getItem('searchHistory');
        if (!searchHistoryData) {
            searchHistoryData = [];
        } else {
            searchHistoryData = JSON.parse(searchHistoryData);
        }

        if (!searchHistoryData.includes(city)) {
            searchHistoryData.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
            displaySearchHistory(searchHistoryData);
        }
    }

    function displaySearchHistory(history) {
        const searchHistoryElement = $('#search-history');
        searchHistoryElement.empty(); // Clear previous search history

        history.forEach(city => {
            const historyItemHTML = `
            <button type="button" class="btn btn-outline-secondary history-item">${city}</button>
        `;
            searchHistoryElement.append(historyItemHTML);
        });

        // Add click event listener to each history item
        $('.history-item').on('click', function () {
            const selectedCity = $(this).text();
            getWeather(selectedCity);
        });
    }
});





