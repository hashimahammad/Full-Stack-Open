
const Content = ({countryData})=>{
    console.log(countryData,countryData[0].name.common);
    
    return(
        <div>
            <h1>{countryData[0].name.common}</h1>
            <p>{countryData[0].capital}</p>
            <h2>Languages</h2>
            <ul>
                {Object.entries(countryData[0].languages).map(([na,nameFull])=>{
                    return <li key={nameFull}>{nameFull}</li>
                })}
            </ul>
             <img src={countryData[0].flags.png} alt={countryData[0].flags.alt}></img>       
        </div>
    )
}

export default Content