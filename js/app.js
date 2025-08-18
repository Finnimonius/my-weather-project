import { getCoordinates, getCityName } from "./geoService.js";

const WEATHER_CODES = [
    { codes: [0], description: "Чистое небо", imgUrl: "/img/clearsky.jpg", iconUrl: "/img/clearicon0.ico" },
    { codes: [1, 2, 3], description: "В основном ясно", imgUrl: "/img/clearsky.jpg", iconUrl: "/img/clearicon.ico" },
    { codes: [45, 48], description: "Туман и образование инея", imgUrl: "/img/fog.jpeg", iconUrl: "/img/fogicon.ico" },
    { codes: [51, 53, 55], description: "Морось", imgUrl: "/img/drizzle.jpg", iconUrl: "/img/drizzleicon.ico" },
    { codes: [56, 57], description: "Моросящий дождь", imgUrl: "/img/drizzle.jpg", iconUrl: "/img/drizzleicon.ico" },
    { codes: [61, 63, 65], description: "Дождь", imgUrl: "/img/rain.jpg", iconUrl: "/img/rainicon.ico" },
    { codes: [66, 67], description: "Ледяной дождь", imgUrl: "/img/rain.jpg", iconUrl: "/img/rainicon.ico" },
    { codes: [71, 73, 75], description: "Снегопад", imgUrl: "/img/snow.jpg", iconUrl: "/img/snowicon.ico"  },
    { codes: [77], description: "Снежные зерна", imgUrl: "/img/snow.jpg", iconUrl: "/img/snowicon.ico" },
    { codes: [80, 81, 82], description: "Ливневые дожди", imgUrl: "/img/rain.jpg", iconUrl: "/img/rainicon.ico" },
    { codes: [85, 86], description: "Снегопад", imgUrl: "/img/snow.jpg", iconUrl: "/img/snowicon.ico" },
    { codes: [95], description: "Гроза", imgUrl: "/img/storm.jpeg", iconUrl: "/img/stormicon.ico" },
    { codes: [96, 99], description: "Гроза с небольшим и сильным градом", imgUrl: "/img/storm.jpeg", iconUrl: "/img/stormicon.ico" }
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
const weatherIcon = document.getElementById("weather-icon");

const checkWeatherCode = (code) => {
    try {
        const weatherObj = WEATHER_CODES.find(weatherCodeObj => {
            return code === weatherCodeObj.codes.find(item => item === code)
        })

        return [weatherObj.description, weatherObj.imgUrl, weatherObj.iconUrl]
    } catch (error) {
        console.error("Такого кода описания погоды не существует", error)
    }
}

const getMaxMinTemp = (daylyTemp) => {
    const daylyArr = [...daylyTemp].sort((a, b) => a - b)
    return {
        min: daylyArr[0],
        max: daylyArr[daylyArr.length - 1]
    }
}

const dateFormatter = (dataDate) => {
    const date = new Date(dataDate);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const timePart = new Intl.DateTimeFormat('ru-RU', timeOptions).format(date);

    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: '2-digit'
    };
    const datePart = new Intl.DateTimeFormat('ru-RU', dateOptions).format(date);

    const formattedDate = `${timePart} - ${datePart.charAt(0).toUpperCase() + datePart.slice(1)}`;
    return formattedDate
}

const displayWeather = (weather, cityName) => {
    const { current_weather, hourly } = weather

    temperatureSpan.textContent = `${current_weather.temperature}°`
    citySpan.textContent = cityName ? cityName : searchInput.value;
    app.style.backgroundImage = `url('${checkWeatherCode(current_weather.weathercode)[1]}')`;
    precipitation.textContent = checkWeatherCode(current_weather.weathercode)[0];

    dateSpan.textContent = dateFormatter(current_weather.time);
    weatherIcon.style.backgroundImage = `url('${checkWeatherCode(current_weather.weathercode)[2]}')`

    const { min, max } = getMaxMinTemp(hourly.temperature_2m);
    tempMax.textContent = `${max}°`;
    tempMin.textContent = `${min}°`;
    humidity.textContent = `${hourly.relative_humidity_2m[0]}%`;
    cloudy.textContent = `${hourly.cloudcover[0]}%`;
    wind.textContent = `${((Number(current_weather.windspeed) * 1000) / 3600).toFixed(1)} м/c`
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