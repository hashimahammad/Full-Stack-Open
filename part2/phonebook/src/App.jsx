import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import {useEffect} from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')

  const [newPhone,setNewPhone] = useState('')

  const [filterName,setFilterName] = useState('')

  useEffect(()=>{
    axios
    .get('http://localhost:3001/persons')
    .then(response=> {
      const data = response.data
      setPersons(data)
      console.log(data);     
    })
  },[])

  const handleSearch = (e)=>{
    setFilterName(e.target.value)
  }

  const addPerson = (e)=>{
    e.preventDefault()
    if(persons.some((person)=> person.name === newName)){
      console.log('inside this logic');
      
      alert(`${newName} is already added to phonebook`)
    }
    else{
    let copyNewPerson = persons.concat({name:newName,id:Date.now(),number:newPhone})
    console.log(newName);
    setPersons(copyNewPerson)
    setNewName('')
    setNewPhone('')
    }
        
  }

  const handleChange = (e)=>{
    //console.log(e.target.value);
    setNewName(e.target.value)
  }

  const handlePhone = (e)=>{
    setNewPhone(e.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterName={filterName} handleSearch={handleSearch}></Filter>

      <h3>add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newPhone={newPhone}
        handlePhoneChange={(e) => setNewPhone(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} search={filterName}></Persons>

    </div>
  )
}

export default App