import { getCoordinates, getCityName } from "./geoService.js";

const WEATHER_CODES = [
    { codes: [0], description: "Чистое небо" },
    { codes: [1, 2, 3], description: "В основном ясно" },
    { codes: [45, 48], description: "Туман и образование инея" },
    { codes: [51, 53, 55], description: "Морось" },
    { codes: [56, 57], description: "Моросящий дождь" },
    { codes: [61, 63, 65], description: "Дождь" },
    { codes: [66, 67], description: "Ледяной дождь" },
    { codes: [71, 73, 75], description: "Снегопад" },
    { codes: [77], description: "Снежные зерна" },
    { codes: [80, 81, 82], description: "Ливневые дожди" },
    { codes: [85, 86], description: "Снегопад" },
    { codes: [95], description: "Гроза" },
    { codes: [96, 99], description: "Гроза с небольшим и сильным градом" }
];

const app = document.getElementById("app")
const temperatureSpan = document.getElementById("weather-temperature");
const citySpan = document.getElementById("weather-city");
const dateSpan = document.getElementById("weather-date");
const searchInput = document.getElementById("search-input");
const precipitation = document.getElementById("precipitation");
const tempMax = document.getElementById("temp-max");
const tempMin = document.getElementById("temp-min");
const humidity = document.getElementById("humidity");
const cloudy = document.getElementById("cloudy");
const wind = document.getElementById("wind");

const checkWeatherCode = (code) => {
    try {
        const weatherDescr = WEATHER_CODES.find(weatherCodeObj => {
            return code === weatherCodeObj.codes.find(item => item === code)
        }).description
        return weatherDescr
    } catch (error) {
        console.error("Такого кода описания погоды не существует", error)
        return " "
    }
}

const getMaxMinTemp = (daylyTemp) => {
    const daylyArr = [...daylyTemp].sort((a, b) => a - b)
    return {
        min: daylyArr[0],
        max: daylyArr[daylyArr.length - 1]
    }
}

const displayWeather = (weather, cityName) => {
    const { current_weather, hourly } = weather
    temperatureSpan.textContent = `${current_weather.temperature}°`
    citySpan.textContent = cityName
    precipitation.textContent = checkWeatherCode(current_weather.weathercode);

    const { min, max } = getMaxMinTemp(hourly.temperature_2m);
    tempMax.textContent = `${max}°`;
    tempMin.textContent = `${min}°`;
    humidity.textContent = `${hourly.relative_humidity_2m[0]}%`;
    cloudy.textContent = `${hourly.cloudcover[0]}%`;
    wind.textContent = `${(Number(current_weather.windspeed) * 1000) / 3600} м/c`
}

async function fetchUserGeo() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
        const { latitude: lat, longitude: lon } = position.coords;

        return [lat, lon]
    } catch (error) {
        console.error("Ошибка геолокации пользователя:", error)

        return ['55.6255780', '37.6063916']
    }
}

async function getWeather(coordinates) {
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=temperature_2m,precipitation,weathercode,windspeed_10m,relative_humidity_2m,cloudcover&current_weather=true&timezone=auto&forecast_days=1`);
        let data = await response.json()

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        console.log(data)
        return data
    } catch (error) {
        console.error(error)
    }
}

async function initWeather() {
    try {
        const userGeo = await fetchUserGeo()
        const city = await getCityName(userGeo)
        const weatherLoad = await getWeather(userGeo)
        displayWeather(weatherLoad, city)

    } catch (error) {
        console.error(error)
    }
}

searchInput.addEventListener("change", async () => {
    const coords = await getCoordinates(searchInput.value)
    const city = await getCityName(coords)
    const weather = await getWeather(coords)
    displayWeather(weather, city)
})

document.addEventListener("DOMContentLoaded", () => {
    initWeather()
})