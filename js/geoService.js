export async function getCoordinates(address) {
    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
        let data = await response.json()
        console.log(data)
        
        if(!data || data.length === 0) {
            throw new Error("Адрес не найден")
        }

        return [data[0].lat, data[0].lon]
    } catch (error) {
        console.error(error)
    }
}
