const Persons = ({ persons, search }) => {
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
          {person.name} {person.phone}
        </div>
      ))}
    </div>
  );
};

export default Persons;