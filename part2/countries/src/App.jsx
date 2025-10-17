import { useState, useEffect } from 'react'
import countryService from './services/countries'


const CountryInfo = ({ country, nameOnly }) => {
  if (nameOnly) {
    return (
      <p>{country.name.common}</p>
    )
  }

  return (
    <>
      <h1>{country.name.common}</h1>

      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h1>Languages</h1>
      <ul>
        {
          Object.values(country.languages).map((language, idx) =>
            <li key={idx}>{language}</li>
          )
        }
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`}></img>
    </>
  )
}

const Display = ({countriesToDisplay}) => {
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
        <CountryInfo country={countriesToDisplay[0]} nameOnly={false} />
      </div>
    )
  } else {
    return (
      <div>
        {countriesToDisplay.map((country, idx) =>
          <CountryInfo key={idx} country={country} nameOnly={true} />
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

  const countriesToDisplay = countries.filter(country => {
    return country.name.common.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>

      <Display countriesToDisplay={countriesToDisplay} />
    </div>
  )
}

export default App