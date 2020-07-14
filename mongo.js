const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give atleast password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dbname = "phonebook"

const url =
`mongodb+srv://viivi:${password}@cluster0-f1buv.azure.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3){
    console.log('Phonebook:')
    Person.find({}).then(result =>{
        result.forEach(person =>{
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit()
    })
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (person.name != undefined){
    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
