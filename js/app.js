import { getCoordinates } from "./geoService.js";

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

const coords = await getCoordinates("443031");

async function getWeather(coordinates) {
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=temperature_2m,precipitation,weathercode,windspeed_10m&current_weather=true&timezone=auto&forecast_days=1`);
        let data = await response.json()

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(error)
    }
}

const weatherObj = await getWeather(coords)
console.log(weatherObj)
