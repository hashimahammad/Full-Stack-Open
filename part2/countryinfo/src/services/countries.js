import axios from "axios";

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = ()=>{
    return axios
    .get(baseURL)
    .then((response)=> response.data)
    .catch((error)=>{
        console.log('some error in fetching',error);        
    })
}

export default getAll