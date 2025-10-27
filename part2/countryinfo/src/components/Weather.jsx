import axios from "axios"
import { useEffect, useState } from "react" 

const Weather = ({apiKey,country})=>{

    const [weather,setWeather] = useState(null)
    useEffect(()=>{
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}&units=metric`)
    .then((response)=> setWeather(response.data))
    .catch((error)=> console.log('some error occured'))
    },[country])

    if (!weather) {
    return <p>Loading weather...</p>;
    }


    return(
        <div>
            <h2>{`Wheater in ${country.capital} C`}</h2>
            <p>{`Temperature ${weather.main.temp}`}</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
            <p>{`Wind ${weather.wind.speed} m/s`}</p>
        </div>
    )
}

export default Weather