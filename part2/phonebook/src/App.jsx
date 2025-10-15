import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({query, changeQuery}) => {
  return (
    <div>
      Search: <input value={query} onChange={changeQuery}/>
    </div>
  )
}

const PersonForm = ({addPerson, newName, changeInputName, newNumber, changeNumber}) => {
  return (
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
  )
}

const Person = ({name, number, deletePersonOf}) => {
  return (
    <p>
      {name} {number} &nbsp;
      <button onClick={deletePersonOf}>delete</button>
    </p>
  )
}

const Persons = ({personsToDisplay, deletePersonHandler}) => {
  return (
    <>
      {personsToDisplay.map((person) =>
        <Person key={person.id} name={person.name} number={person.number} deletePersonOf={() => deletePersonHandler(person.id)}/>
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
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

  useEffect(() => {
    personService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        alert('An error occured.')
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const match = persons.find(person => person.name === newName)

    if (match) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .updatePerson(match.id, {...match, number: newNumber})
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id == updatedPerson.id ? updatedPerson : person))
          })
          .catch(error => {
            alert('An error occured.')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .createPerson(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert('An error occured.')
      })
  }

  const deletePersonHandler = personId => {
    if (window.confirm("Do you want to delete this person entry?")) {
      personService
        .deletePerson(personId)
        .then(deletedPerson => {
          const newPersons = persons.filter(person =>
            person.id != deletedPerson.id
          )
          setPersons(newPersons)
        })
        .catch(error => {
          alert('An error occured.')
        })
    }
  }

  const personsToDisplay = persons.filter(person => {
    const cleanQuery = query.trim().toLowerCase()
    return person.name.toLowerCase().includes(cleanQuery)
  })

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter query={query} changeQuery={changeQuery} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} newName={newName} changeInputName={changeInputName} newNumber={newNumber} changeNumber={changeNumber} />

      <h2>Numbers</h2>

      <Persons personsToDisplay={personsToDisplay} deletePersonHandler={deletePersonHandler} />

    </div>
  )
}

export default App