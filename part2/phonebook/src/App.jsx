import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')


  const changeInputName = (event) => {
    setNewName(event.target.value)
  }

  const changeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const changeQuery = (event) => {
    setQuery(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToDisplay = persons.filter(person => {
    const cleanQuery = query.trim().toLowerCase()
    return person.name.toLowerCase().includes(cleanQuery)
  })

  return (
    <div>
      <h2>Phonebook</h2>
      
      <div>
        Search: <input value={query} onChange={changeQuery}/>
      </div>

      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={changeInputName}/>
        </div>
        <div>
          phone: <input value={newNumber} onChange={changeNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {personsToDisplay.map((person) =>
        <p key={person.id}>{person.name} {person.number}</p>
      )}

    </div>
  )
}

export default App