const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to mongo', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result =>{
        console.log('connected!')
    })
    .catch((error) =>{
        console.log('error connectiong: ', error.message)
    })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', phonebookSchema)