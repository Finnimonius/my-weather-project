import { getCoordinates } from "./geoService.js";

const coords = await getCoordinates("443031");
console.log(coords)

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

const weathercode = {
    0: "Ясно",
    1: "Облачно",
    2: "Облачно",
    3: "Облачно",
    45: "Туман",
    61: "Небольшой дождь",
    63: "Умеренный дождь",
    80: "Ливень",
}
