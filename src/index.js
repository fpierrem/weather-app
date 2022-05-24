import { DateTime } from "luxon";
import { getLatLon,getWeather,getTime } from "./data";

const form = document.getElementById('search-field');
const messageArea = document.getElementById('message-area');
const errorMessage = document.getElementById("error-message");
const results = document.getElementById("results");
const currentData = document.getElementById("current-data-container");
const cityInfo = document.getElementById("city-info");
const currentTab = document.getElementById("current-tab");
const forecastsTab = document.getElementById("forecasts-tab");
const forecastsGrid = document.getElementById('forecasts-container');

form.onsubmit = async function() {
    const city = form["city"].value;
    try {
        let coordinates = await getLatLon(city);
        let info = await getWeather(coordinates.lat,coordinates.lon);
        hideErrorMessage();
        showResults();
        displayCityInfo(city,info.timezone);
        loadCurrentData(info);
        createForecasts(info);
        showCurrent();
    }
    catch(error) {
        console.log(error);
        hideResults();
        displayErrorMessage();
    };
};

forecastsTab.onclick = () => showForecasts();
currentTab.onclick = () => showCurrent();

function showCurrent() {
    currentData.style.display = "grid";
    forecastsGrid.style.display = "none";
}

function showForecasts() {
    currentData.style.display = "none";
    forecastsGrid.style.display = "flex";
}

function displayErrorMessage() {
    messageArea.style.display = "block";
    errorMessage.innerHTML = "We couldn't find that city. Did you spell it right?"
}

function hideErrorMessage() {
    messageArea.style.display = "block";
    errorMessage.innerHTML = ""
}

function showResults() {
    results.style.display = "block";
}

function hideResults() {
    results.style.display = "none";
}

function displayCityInfo(city, timezone) {
    let cityName = document.getElementById('city-name');
    let localTimeDisplay = document.getElementById('local-time');
    cityName.innerHTML = 'Weather for ' + city.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    let localTime = getTime(DateTime.now().toMillis() / 1000, timezone);
    localTimeDisplay.innerHTML = 'Local time: ' + localTime;
}

function loadCurrentData(info) {
    const currentTemp = document.getElementById('current-temp');
    const currentWeather = document.getElementById('current-weather');
    const currentWind = document.getElementById('current-wind');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    currentTemp.innerHTML = info.current.temp + '°C';
    currentWeather.innerHTML = info.current.weather[0].toUpperCase() + info.current.weather.slice(1);
    currentWind.innerHTML = info.current.windSpeed + ' km/h';
    sunrise.innerHTML = 'Sunrise: ' + info.current.sunrise;
    sunset.innerHTML = 'Sunset: ' + info.current.sunset;
};

function createForecasts(info) {
    // Clean up any previously existing forecast elements
    document.querySelectorAll('.daily-forecast').forEach((element) => {
        if (element) {element.remove()};
    });
    // Create new forecasts elements
    for (let i = 0; i <= 7; i++) {
        const dailyForecast = document.createElement('div');
        dailyForecast.className = 'daily-forecast'
        const dailyDay = document.createElement('div');
        dailyDay.innerHTML = (i === 0) ? "Today" : info.forecast[i].date ;
        const dailyMin = document.createElement('div');
        dailyMin.innerHTML = info.forecast[i].min + ' °C';
        const dailyMax = document.createElement('div');
        dailyMax.innerHTML = info.forecast[i].max + ' °C';
        const dailyIcon = document.createElement('div');
        dailyIcon.innerHTML = `<img src=${info.forecast[i].iconURL}>`;
        dailyForecast.append(dailyDay);
        dailyForecast.append(dailyMin);
        dailyForecast.append(dailyMax);
        dailyForecast.append(dailyIcon);
        forecastsGrid.append(dailyForecast);
    };
};