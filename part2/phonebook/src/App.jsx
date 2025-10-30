import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import {useEffect} from 'react'
import personService from './services/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')

  const [newPhone,setNewPhone] = useState('')

  const [filterName,setFilterName] = useState('')

  const [msg,setMsg] = useState('')

  const [msgType, setMsgType] = useState("success")

  useEffect(()=> {
    personService
    .getAll().
    then(data=> setPersons(data))
  },[])

  const handleSearch = (e)=>{
    setFilterName(e.target.value)
  }

  const showMessage = (message, type) => {
  setMsg(message)
  setMsgType(type)
  setTimeout(() => {
    setMsg(null)
  }, 4000)
}

  const addPerson = (e)=>{
    e.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if(existingPerson){
      if(window.confirm('update the number?'))
      {
        existingPerson.number = newPhone
        personService.update(existingPerson.id,existingPerson)
        .then((response) => {
          setPersons(
            persons.map((p) => p.id === response.id ? response : p)
          )
          showMessage(`Updated ${response.name}'s number to ${response.number}`, "success")
        })
        .catch(() => showMessage(`Failed to update ${newName} because its been removed from server`, "error"))
      }
    }
    else{
      let newPerson = {name:newName,number:newPhone}
      console.log(newName);
      personService.create(newPerson)
      .then((data) => {
        setPersons(persons.concat(data))
        showMessage(`Added ${newName}`, "success")
        setNewName("")
        setNewPhone("") 
      })
      .catch(() => showMessage(`Failed to add ${newName}`, "error"))
    }
        
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={msg} css={msgType}></Notification>

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

      <Persons persons={persons} search={filterName} setPersons={setPersons}></Persons>

    </div>
  )
}

export default App