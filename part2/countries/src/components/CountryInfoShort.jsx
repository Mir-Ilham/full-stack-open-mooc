const CountryInfoShort = ({ country, handleShowCountry }) => {
  return (
    <div>
      {country.name.common} &nbsp;
      <button onClick={() => handleShowCountry(country.name.common)}>Show</button>
    </div>
  )
}

export default CountryInfoShort