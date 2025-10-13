import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      phone: 420
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')


  const changeInputName = (event) => {
    setNewName(event.target.value)
  }

  const changePhoneNumber = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      phone: newPhoneNumber
    }

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewPhoneNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>newName : {newName}</div>
      <div>newPhoneNumber : {newPhoneNumber}</div>


      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={changeInputName}/>
        </div>
        <div>
          phone: <input value={newPhoneNumber} onChange={changePhoneNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.map((person) =>
        <p key={person.name}>{person.name} {person.phone}</p>
      )}

    </div>
  )
}

export default App