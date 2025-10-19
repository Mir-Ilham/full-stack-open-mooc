import CountryInfo from "./CountryInfo"
import CountryInfoShort from "./CountryInfoShort"

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

export default Display