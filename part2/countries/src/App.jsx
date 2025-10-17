import { useState, useEffect } from 'react'
import countryService from './services/countries'

const CountryInfoShort = ({ country, handleShowCountry }) => {
  return (
    <div>
      {country.name.common} &nbsp;
      <button onClick={() => handleShowCountry(country.name.common)}>Show</button>
    </div>
  )
}

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

const Display = ({countriesToDisplay, handleShowCountry}) => {
  if (countriesToDisplay.length == 0) {
    return (
      <p>No matches found</p>
    )
  } else if (countriesToDisplay.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countriesToDisplay.length == 1) {
    return (
      <div>
        <CountryInfo country={countriesToDisplay[0]} />
      </div>
    )
  } else {
    return (
      <div>
        {countriesToDisplay.map((country, idx) =>
          <CountryInfoShort key={idx} country={country} handleShowCountry={handleShowCountry} />
        )}
      </div>
    )
  }
}

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
      .getAllCountries()
      .then(allCountries => {
        setCountries(allCountries)
        // console.log(allCountries[0])
      })
      .catch(error => {
        alert('An error occured')
      })
  }, [])

  const handleQueryChange = (event) => {
    const newQuery = event.target.value
    setQuery(event.target.value)
  }

  const handleShowCountry = (name) => {
    setQuery(name)
  }

  const countriesToDisplay = countries.filter(country => {
    return country.name.common.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>

      <Display countriesToDisplay={countriesToDisplay} handleShowCountry={handleShowCountry} />
    </div>
  )
}

export default App