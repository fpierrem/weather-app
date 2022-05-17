const APIkey = '948a0394778bf6fc78ef09f68d2313db';
const units = "metric";

// Get current weather data for given city
async function getCurrentWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=${units}`)
        return process(await response.json());
    }
    catch(error) {
        console.log(error);
        return null;
    };
};

// async function getForecasts(city) {
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`)
//     return process(await response.json());
// }

// Process data received from OpenWeather API
function process(data) {
    console.log(data);
    return {
        weather: data.weather[0].description,
        windSpeed: Math.round(data.wind.speed * 3600 / 1000),
        windDirection: data.wind.deg,
        clouds: data.clouds.all,
        temp: Math.round(data.main.temp),
        max: Math.round(data.main.temp_max),
        min: Math.round(data.main.temp_min),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        localTime: convertTimeStamp(data.dt, data.timezone),
        sunrise: convertTimeStamp(data.sys.sunrise, data.timezone),
        sunset: convertTimeStamp(data.sys.sunset, data.timezone)
    };

    // Convert Unix timestamp to human-readable time
    function convertTimeStamp(ts, tz) {
        let D = new Date((ts) * 1000);
        let hours = "0" + D.getHours();
        let mins = "0" + D.getMinutes();
        return hours.substr(-2) + "h" + mins.substr(-2);
    };
};

// View module
const form = document.getElementById('search-field');
const messageArea = document.getElementById('message-area');
const errorMessage = document.getElementById("error-message");
const cityInfo = document.getElementById("city-info");

form.onsubmit = async function() {
    const city = form["city"].value;
    let data = await getCurrentWeather(city);
    if (data) {
        hideErrorMessage();
        displayCityInfo();
        displayCityData(city,data.localTime);
        displayCurrentData(data);
    }
    else {
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

function displayCityData(city,localTime) {
    let mainTitle = document.getElementById('city-title');
    let localTimeDisplay = document.getElementById('local-time');
    mainTitle.innerHTML = 'Weather for ' + city.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
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

    
