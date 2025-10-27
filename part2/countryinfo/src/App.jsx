import { useState,useEffect } from 'react'
import CountryInfo from './components/CountryInfo'
import getAll from './services/countries'


function App() {
  const [filter, setFilter] = useState('')
  const [countryData, setCountryData] = useState([])
  const [filteredCountryData, setFilteredCountryData] = useState([])
  


  useEffect(()=>{
    console.log('effect run',countryData);
    getAll()
    .then((data)=>{
      // console.log(`the respnes data is ${data}`,data);
      setCountryData(data)
    })
  },[])

  const selectCountry = (country)=>{
    setFilteredCountryData([country])
  }

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    const countries =
      newFilter.trim().length === 0
        ? countryData
        : countryData.filter((country) =>
            country.name.common
              .toLowerCase()
              .includes(newFilter.trim().toLowerCase())
          );
    setFilter(newFilter);
    setFilteredCountryData(countries);
  };  

  return(
    <div>
      <p>
        find countries <input type="text" value={filter} onChange={handleFilterChange}/>
      </p>
      <CountryInfo country={filteredCountryData} selectCountry={selectCountry}></CountryInfo>
    </div>
  )
  
}

export default App
