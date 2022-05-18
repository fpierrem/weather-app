import { DateTime } from "luxon";

const APIkey = '948a0394778bf6fc78ef09f68d2313db';
const units = "metric";

// Get coordinates from city name by calling OpenWeather's Geocoding API
const getLatLon = async (city) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`)
        const data = await response.json();
        return {lat:data[0].lat,lon:data[0].lon};
    }
    catch(error) {
        console.log(error);
        return null;
    };
};

// Get current weather data for given city
const getWeather = async (lat,lon) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIkey}&units=${units}`)
        const data = process(await response.json());
        console.log(data);
        return data;
    }
    catch(error) {
        console.log(error);
        return null;
    };
};

// Process data received from OpenWeather API
const process = (data) => {
    console.log(data);
    return {
        weather: data.current.weather[0].description,
        windSpeed: Math.round(data.current.wind_speed * 3600 / 1000),
        windDirection: data.current.wind_deg,
        temp: Math.round(data.current.temp),
        humidity: data.current.humidity,
        timezone: data.timezone,
        sunrise: getTime(data.current.sunrise, data.timezone),
        sunset: getTime(data.current.sunset, data.timezone)
    };
};

// Convert Unix UTC D to human-readable time
const getTime = (timestamp, timezone) => {
    let D = new Date(timestamp * 1000).toISOString();
    let localDateTime = DateTime.fromISO(D).setZone(timezone);
    let hours = "0" + localDateTime.hour;
    let mins = "0" + localDateTime.minute;
    return hours.substr(-2) + "h" + mins.substr(-2);
};

export { getLatLon,getWeather,getTime };