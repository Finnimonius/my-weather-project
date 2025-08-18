export async function getCoordinates(address) {
    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
        let data = await response.json()

        if (!data || data.length === 0) {
            throw new Error("Адрес не найден")
        }

        return [data[0].lat, data[0].lon]
    } catch (error) {
        console.error(error)
    }
}

export async function getCityName(coords) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords[0]}&lon=${coords[1]}&format=json`);
        const data = await response.json();

        return data.address.city
    } catch (error) {
        console.error(error)
    }
}
