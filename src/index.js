import './styles.css';
import { DateTime } from "luxon";
import { getLatLon,getWeather,getTime } from "./data";

const units = {
    "metric": {
        temp: "°C",
        wind: "km/h"
    },
    "imperial": {
        temp: "°F",
        wind: "mph"
    }
};

let system = "metric";
let city = 'Honolulu';
const form = document.getElementById('search-field');
const messageArea = document.getElementById('message-area');
const errorMessage = document.getElementById("error-message");
const forecastsGrid = document.getElementById('forecasts-container');

document.addEventListener('DOMContentLoaded', () => {
    loadCity(city);
    unitControl()
    form.onsubmit = () => {
        city = form["city"].value;
        loadCity(city);
    };
});

function unitControl() {
    let selectors = document.querySelectorAll(".unit-button");
    selectors.forEach((element) => {
      element.onclick = () => {
        selectors.forEach((e) => {
          e.className = "unit-button";
        });
        element.classList.add("selected");
        system = (element.innerHTML === '°C') ? "metric" : "imperial";
        loadCity(city);
      };
    });
};  

async function loadCity(city) {
    try {
        let coordinates = await getLatLon(city);
        let country = coordinates.country;
        let info = await getWeather(coordinates.lat,coordinates.lon,system);
        hideErrorMessage();
        loadBackground(info);
        loadCityInfo(city,country,info.timezone);
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
};

function hideErrorMessage() {
    messageArea.style.display = "none";
    errorMessage.innerHTML = ""
};

function loadBackground(info) {
    console.log('function called');
    document.getElementById('background-container').style.background = "url('../images/clear-sky.jpeg')no-repeat center center/cover";
};

function loadCityInfo(city,country,timezone) {
    let cityName = document.getElementById('city-name');
    let localDateTimeDisplay = document.getElementById('local-date-time');
    cityName.innerHTML = city.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) + ', ' + country;
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
    currentTemp.innerHTML = info.current.temp + units[system].temp;
    currentWeatherIcon.innerHTML = `<img src=${info.current.iconURL} width="150px" height="150px">`;
    currentWeatherDescription.innerHTML = info.current.weather[0].toUpperCase() + info.current.weather.slice(1);
    currentWind.innerHTML = 'Wind: ' + info.current.windSpeed + units[system].wind;
    currentHumidity.innerHTML = 'Humidity: ' + info.current.humidity + '%';
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
        dailyMin.innerHTML = info.forecast[i].min + units[system].temp;
        const dailyMax = document.createElement('div');
        dailyMax.innerHTML = info.forecast[i].max + units[system].temp;
        const dailyIcon = document.createElement('div');
        dailyIcon.innerHTML = `<img src=${info.forecast[i].iconURL} width="50" height="50">`;
        dailyForecast.append(dailyDay);
        dailyForecast.append(dailyMin);
        dailyForecast.append(dailyMax);
        dailyForecast.append(dailyIcon);
        forecastsGrid.append(dailyForecast);
    };
};