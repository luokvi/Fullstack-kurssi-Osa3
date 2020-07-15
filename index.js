require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


morgan.token('postContent', function getContent (req) {
    const jsonContent = req.body
    return JSON.stringify(jsonContent)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postContent'))
app.use(cors())
app.use(express.static('build'))

  
app.get('/', (req, res) =>{
res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res, next) =>{
    Person.find({ }).then(found =>{
      console.log(found)
      const length = found.length
      const date = new Date()
      res.send(`<p>Phonebook has info for ${length} persons</p>
      <p>${date} (Eastern European Standard Time)</p>`)
    })
    .catch(error => next(error))
    
})

app.get('/api/persons', (req, res) =>{
    Person.find({ }).then(found =>{
      res.json(found)
    })
})
app.get('/api/persons/:id', (req, res, next) =>{
    const id = req.params.id
    
    Person.findById(id).then(found =>{
      if(found){
        res.json(found)
      } else{
        res.status(404).end()
      }
      
    })
    .catch(error => next(error))
      
})

app.delete('/api/persons/:id', (req, res) =>{
    const id = req.params.id
    Person.findByIdAndDelete(id)
    .then(result =>{
      res.status(204).end()
    })

    
})

app.post('/api/persons', (req, res) =>{
    const body = req.body

    if (!body.name || !body.number){
        return res.status(400).json({ 
            error: 'content missing' 
          })
      }

    /*
    const match = (p) => p.name === person.name
    const alreadyInList = persons.some(match)
    if(alreadyInList){
        return res.status(400).json({ 
            error: 'name must be unique' 
          }) 
    }
    */

    console.log('adding: ', body)
    
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    

    person.save().then(saved =>{
      res.json(saved)
    })
  })

  app.put('/api/persons/:id', (req, res, next) =>{
    const body = req.body
    const updated = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, updated, {new: true})
    .then(response =>{
      res.json(response)
    })
    .catch(error => next(error))
  })

  const errorHandler = (error, req, res, next) =>{
    console.error(error.message)

    if (error.name === 'CastError'){
      return res.status(400).send({error: 'malformed id'})
    }

    next(error)
  }
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})