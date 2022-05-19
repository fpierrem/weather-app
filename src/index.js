import { DateTime } from "luxon";
import { getLatLon,getWeather,getTime } from "./data";

const form = document.getElementById('search-field');
const messageArea = document.getElementById('message-area');
const errorMessage = document.getElementById("error-message");
const cityInfo = document.getElementById("city-info");

form.onsubmit = async function() {
    const city = form["city"].value;
    try {
        let coordinates = await getLatLon(city);
        let info = await getWeather(coordinates.lat,coordinates.lon);
        hideErrorMessage();
        displayCityInfo();
        loadCityInfo(city,info.timezone);
        displayCurrentInfo(info);
    }
    catch(error) {
        console.log(error);
        hideCityInfo();
        displayErrorMessage();
    };
};

function displayErrorMessage() {
    messageArea.style.visibility = "visible";
    errorMessage.innerHTML = "We couldn't find that city. Did you spell it right?"
}

function hideErrorMessage() {
    messageArea.style.visibility = "hidden";
    errorMessage.innerHTML = ""
}

function displayCityInfo() {
    cityInfo.style.visibility = "visible";
}

function hideCityInfo() {
    cityInfo.style.visibility = "hidden";
}

function loadCityInfo(city, timezone) {
    console.log(timezone);
    let mainTitle = document.getElementById('city-title');
    let localTimeDisplay = document.getElementById('local-time');
    mainTitle.innerHTML = 'Weather for ' + city.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    let localTime = getTime(DateTime.now().toMillis() / 1000, timezone);
    localTimeDisplay.innerHTML = 'Local time: ' + localTime;
}

function displayCurrentInfo(info) {
    const currentTemp = document.getElementById('current-temp');
    const currentWeather = document.getElementById('current-weather');
    const currentWind = document.getElementById('current-wind');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    currentTemp.innerHTML = info.temp + '°C';
    currentWeather.innerHTML = info.weather[0].toUpperCase() + info.weather.slice(1);
    currentWind.innerHTML = info.windSpeed + ' km/h';
    sunrise.innerHTML = 'Sunrise: ' + info.sunrise;
    sunset.innerHTML = 'Sunset: ' + info.sunset;
};