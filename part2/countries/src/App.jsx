import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Display from './components/Display'

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