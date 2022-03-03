import axios from "axios"

const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=25.105497&lon=121.597366&appid=e9dcfcd6f8ec64ce20961a75e954fd69`

const dataRule = {
  wind_deg: {
    min: 0,
    max: 360,
    unit: 'deg'
  },
  wind_speed: {
    min: 0,
    max: 15,
    unit: 'm/s'
  },
  humidity: {
    min: 60,
    max: 76,
    unit: '%'
  },
  temp: {
    min: 15,
    max: 36,
    unit: '°C'
  }
}

const getFormattedWeather = async () => {
  const response = await axios.get(currentWeatherEndpoint)
  const rawData = response.data
  console.log(rawData)
  return {
    wind_deg: formatData(rawData.wind.deg, dataRule.wind_deg.min, dataRule.wind_deg.max),
    wind_speed: formatData(rawData.wind.speed, dataRule.wind_speed.min, dataRule.wind_speed.max),
    humidity: formatData(rawData.main.humidity, dataRule.humidity.min, dataRule.humidity.max),
    temp: formatData(rawData.main.temp - 273.15, dataRule.temp.min, dataRule.temp.max),
    is_raining: rawData.weather.main === 'Rain'
  }
}

export {
  dataRule,
  getFormattedWeather 
}

const formatData = (val, min, max) => {
  return Math.max(Math.min(val, max), min)
}
