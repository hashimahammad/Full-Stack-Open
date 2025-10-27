import Content from './Content'
import Weather from './Weather'

const api_key = import.meta.env.VITE_OPEN_WHEATHER

const CountryInfo = ({country,selectCountry})=>{
    if(country.length>10){
        return(
            <div>too much results</div>
        )
    }
    if(country.length === 1){
        return(
            <div>
                <Content countryData={country}></Content>
                <Weather country={country[0]} apiKey={api_key}></Weather>
            </div>
        )
    }

    return (
        <div>
            {country.map((c)=>{
                return (
                <div key={c.name.common}>
                    <p>
                        {c.name.common}
                        <button onClick={()=> selectCountry(c)}>Show</button>
                    </p>
                </div>)
            })}
        </div>
    )
    
}

export default CountryInfo