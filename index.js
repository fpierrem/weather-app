const APIkey = '948a0394778bf6fc78ef09f68d2313db';

function convertTimeStamp(ts) {
    let D = new Date(ts * 1000);
    let hours = "0" + D.getHours();
    let mins = "0" + D.getMinutes();
    return hours.substr(-2) + "h" + mins.substr(-2);
};

function process(data) {
    let weather = data.weather[0].description;
    let wind = data.wind;
    let clouds = data.clouds.all;
    let temp = data.main.temp;
    let max = data.main.temp_max;
    let min = data.main.temp_min;
    let feelsLike = data.main.feels_like;
    let humidity = data.main.humidity;
    let localTime = convertTimeStamp(data.dt);
    let sunrise = convertTimeStamp(data.sys.sunrise);
    let sunset = convertTimeStamp(data.sys.sunset);

    return { weather, temp, max, min, feelsLike, wind, clouds, localTime, sunrise, sunset };
}

function displayData(data) {
    currentTemp.innerHTML = data.temp;
};

// function getInfo(city) {
//     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`)
//         .then(response => response.json())
//         .then(response => process(response))
//         .then(data => displayData(data));    
// };

const form = document.getElementById('search-field');
const currentTemp = document.getElementById('current-temp');

// form.onsubmit = function() {
//     let city = form["city"].value;
//     getInfo(city);
// };

async function getInfo(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`)
    const data = process(await response.json());
    return data;
}

form.onsubmit = async function() {
    let city = form["city"].value;
    let data = await getInfo(city);
    displayData(data);
};
