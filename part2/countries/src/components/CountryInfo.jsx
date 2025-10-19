import { useState, useEffect } from 'react'
import countryService from '../services/countries'

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    countryService
      .getCityWeather(country.capital[0])
      .then(weatherData => {
        setWeather(weatherData)
      })
      .catch(error => {
        alert('An error occured')
      })
  }, [])

  return (
    <>
      <h1>{country.name.common}</h1>

      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {
          Object.values(country.languages).map((language, idx) =>
            <li key={idx}>{language}</li>
          )
        }
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`}></img>

      <h2>Weather in {country.capital[0]}</h2>

      {weather.main !== undefined ?
        <>
          <p>Temperature { (weather.main.temp -273.15).toFixed(2) } Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
          <p>Wind { weather.wind.speed } m/s</p>
        </>
        : "NA"
      }

    </>
  )
}

export default CountryInfo