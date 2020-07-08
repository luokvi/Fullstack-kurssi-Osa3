const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Matti Meikäläinen",
        "number": "12-345-6789",
        "id": 5
      }
]

  app.use(express.json())
  app.use(morgan('tiny'))
  
  app.get('/', (req, res) =>{
    res.send('<h1>Phonebook</h1>')
  })

  app.get('/info', (req, res) =>{
      const length = persons.length
      const date = new Date()
      res.send(`<p>Phonebook has info for ${length} persons</p>
      <p>${date} (Eastern European Standard Time)</p>`)
  })

  app.get('/api/persons', (req, res) =>{
      res.json(persons)
  })
  app.get('/api/persons/:id', (req, res) =>{
      const id = Number(req.params.id)
      const person = persons.find(person => person.id === id)

      if (person){
        res.json(person)
      } else{
          res.status(404).end()
      }
      
  })

  app.delete('/api/persons/:id', (req, res) =>{
      const id = Number(req.params.id)
      persons = persons.filter(person => person.id !== id)

      res.status(204).end()
  })

  app.post('/api/persons', (req, res) =>{
    const person = req.body

    if (!person.name || !person.number){
        return res.status(400).json({ 
            error: 'content missing' 
          })
      }
    const match = (p) => p.name === person.name
    const alreadyInList = persons.some(match)
    if(alreadyInList){
        return res.status(400).json({ 
            error: 'name must be unique' 
          }) 
    }


    person.id = Math.floor(Math.random() * 10 + 5)
      
    persons.concat(person)

    res.json(person)
  })

const PORT = 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})