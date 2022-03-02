import axios from "axios"

const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=25.105497&lon=121.597366&appid=e9dcfcd6f8ec64ce20961a75e954fd69`

const getFormattedWeather = async () => {
  const response = await axios.get(currentWeatherEndpoint)
  const rawData = response.data
  console.log(rawData)
  return {
    wind_deg: rawData.wind.deg,
    wind_speed: Math.max(Math.min(rawData.wind.speed, 15), 0),
    humidity: Math.max(Math.min(rawData.main.humidity, 90), 60),
    temp: Math.max(Math.min(rawData.main.temp - 273.15, 40), 15),
  }
}

export default getFormattedWeather
