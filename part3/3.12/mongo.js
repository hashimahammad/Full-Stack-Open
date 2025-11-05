const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person',personSchema)

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =`mongodb+srv://hashim:${password}@phonebook.uizw0xw.mongodb.net/?appName=phoneBook`

mongoose.set('strictQuery',false)
mongoose.connect(url)

if (process.argv.length == 3){
    console.log('PhoneBook:');
    
    Person
    .find({})
    .then(persons=> {
        persons.forEach((person)=> console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
    return 

}

let Pname = process.argv[3]
let Pnum = process.argv[4]

const person = new Person({
    name:Pname,
    number:Pnum
})


person.save().then(result=> {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})