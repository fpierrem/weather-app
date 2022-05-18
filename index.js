const APIkey = '948a0394778bf6fc78ef09f68d2313db';
const units = "metric";

// View module
const form = document.getElementById('search-field');
const messageArea = document.getElementById('message-area');
const errorMessage = document.getElementById("error-message");
const cityInfo = document.getElementById("city-info");

form.onsubmit = async function() {
    const city = form["city"].value;
    try {
        let coordinates = await getLatLon(city);
        let data = await getWeather(coordinates.lat,coordinates.lon);
        hideErrorMessage();
        displayCityInfo();
        displayCityData(city,localTime);
        displayCurrentData(data);
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

function displayCityData(city, timezone) {
    let mainTitle = document.getElementById('city-title');
    let localTimeDisplay = document.getElementById('local-time');
    mainTitle.innerHTML = 'Weather for ' + city.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    let now = now();
    localTimeDisplay.innerHTML = 'Local time: ' + localTime;
}

function displayCurrentData(data) {
    const currentTemp = document.getElementById('current-temp');
    const currentWeather = document.getElementById('current-weather');
    const currentWind = document.getElementById('current-wind');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    currentTemp.innerHTML = data.temp;
    currentWeather.innerHTML = data.weather[0].toUpperCase() + data.weather.slice(1);
    currentWind.innerHTML = data.windSpeed + ' km/h';
    sunrise.innerHTML = data.sunrise;
    sunset.innerHTML = data.sunset;
};


// Get coordinates using city name
async function getLatLon(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`)
        const data = await response.json();
        console.log(data);
        return {lat:data[0].lat,lon:data[0].lon};
    }
    catch(error) {
        console.log(error);
        return null;
    };
};

// Get current weather data for given city
async function getWeather(lat,lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIkey}&units=${units}`)
        return process(await response.json());
    }
    catch(error) {
        console.log(error);
        return null;
    };
};

// Process data received from OpenWeather API
function process(data) {
    console.log(data);
    return {
        weather: data.current.weather[0].description,
        windSpeed: Math.round(data.current.wind_speed * 3600 / 1000),
        windDirection: data.current.wind_deg,
        temp: Math.round(data.current.temp),
        // max: Math.round(data.main.temp_max),
        // min: Math.round(data.main.temp_min),
        // feelsLike: Math.round(data.main.feels_like),
        humidity: data.current.humidity,
        timezone: data.timezone,
        sunrise: getTime(data.current.sunrise, this.timezone),
        sunset: getTime(data.current.sunset, this.timezone)
    };
};

// Convert Unix UTC timestamp to human-readable time
function getTime(timestamp, timezone) {
    let D = new Date(timestamp * 1000);
    let hours = "0" + D.getHours();
    let mins = "0" + D.getMinutes();
    return hours.substr(-2) + "h" + mins.substr(-2);
};

// Get current time at location
// function getCurrentTime(offset) {
//     let D = new Date(ts * 1000);
//     let hours = "0" + D.getHours();
//     let mins = "0" + D.getMinutes();
//     return hours.substr(-2) + "h" + mins.substr(-2);
// };
