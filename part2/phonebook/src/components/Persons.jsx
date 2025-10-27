import personService from '../services/Persons'

const Persons = ({ persons, search, setPersons}) => {
  
  const handleDelete = (id,name)=>{
    if(window.confirm(`do you really want to delete this ${name}`)){
      personService.del(id).then(()=>{
        setPersons(persons.filter((p)=> p.id !== id))
      })
    }
  }

  const filteredPersons =
    search.trim() === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().startsWith(search.toLowerCase())
        );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id,person.name)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;