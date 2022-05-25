import { DateTime } from "luxon";
import { getLatLon,getWeather,getTime } from "./data";

const form = document.getElementById('search-field');
const messageArea = document.getElementById('message-area');
const errorMessage = document.getElementById("error-message");
const forecastsGrid = document.getElementById('forecasts-container');

form.onsubmit = async function() {
    const city = form["city"].value;
    try {
        let coordinates = await getLatLon(city);
        let info = await getWeather(coordinates.lat,coordinates.lon);
        hideErrorMessage();
        displayCityInfo(city,info.timezone);
        loadCurrentData(info);
        loadForecasts(info);
    }
    catch(error) {
        console.log(error);
        displayErrorMessage();
    };
};

function displayErrorMessage() {
    messageArea.style.display = "block";
    errorMessage.innerHTML = "We couldn't find that city. Did you spell it right?"
}

function hideErrorMessage() {
    messageArea.style.display = "block";
    errorMessage.innerHTML = ""
}

function displayCityInfo(city, timezone) {
    let cityName = document.getElementById('city-name');
    let localDateTimeDisplay = document.getElementById('local-date-time');
    cityName.innerHTML = city.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    localDateTimeDisplay.innerHTML = DateTime.now().setZone(timezone).toLocaleString(DateTime.DATETIME_MED);
};

function loadCurrentData(info) {
    const currentTemp = document.getElementById('current-temp');
    const currentWeatherIcon = document.getElementById('current-weather-icon');
    const currentWeatherDescription = document.getElementById('current-weather-description');
    const currentWind = document.getElementById('current-wind');
    const currentHumidity = document.getElementById('current-humidity');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    currentTemp.innerHTML = info.current.temp + '°C';
    currentWeatherIcon.innerHTML = `<img src=${info.current.iconURL} width="100px" height="100px">`;
    currentWeatherDescription.innerHTML = info.current.weather[0].toUpperCase() + info.current.weather.slice(1);
    currentWind.innerHTML = info.current.windSpeed + ' km/h';
    currentHumidity.innerHTML = info.current.humidity + '%';
    sunrise.innerHTML = 'Sunrise: ' + info.current.sunrise;
    sunset.innerHTML = 'Sunset: ' + info.current.sunset;
};

function loadForecasts(info) {
    // Clean up any previously existing forecast elements
    document.querySelectorAll('.daily-forecast').forEach((element) => {
        if (element) {element.remove()};
    });
    // Create new forecasts elements
    for (let i = 0; i <= 7; i++) {
        const dailyForecast = document.createElement('div');
        dailyForecast.className = 'daily-forecast'
        const dailyDay = document.createElement('div');
        dailyDay.className = 'daily-day';
        dailyDay.innerHTML = (i === 0) ? "Today" : info.forecast[i].date ;
        const dailyMin = document.createElement('div');
        dailyMin.innerHTML = info.forecast[i].min + ' °C';
        const dailyMax = document.createElement('div');
        dailyMax.innerHTML = info.forecast[i].max + ' °C';
        const dailyIcon = document.createElement('div');
        dailyIcon.innerHTML = `<img src=${info.forecast[i].iconURL} width="50" height="50">`;
        dailyForecast.append(dailyDay);
        dailyForecast.append(dailyMin);
        dailyForecast.append(dailyMax);
        dailyForecast.append(dailyIcon);
        forecastsGrid.append(dailyForecast);
    };
};