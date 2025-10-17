import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"
const API_KEY = import.meta.env.VITE_SOME_KEY

const getAllCountries = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getCityWeather = (city) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    return request.then(response => response.data)
}

export default { getAllCountries, getCityWeather }