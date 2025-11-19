const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anedotes')
  }

  return await response.json()
}

const postAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  })

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}

const voteAnecdote = async (id) => {
  let anecdoteToUpdate = await fetch(`${baseUrl}/${id}`)
  anecdoteToUpdate = await anecdoteToUpdate.json()
  
  const updatedAnecdote = await fetch(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes: anecdoteToUpdate.votes + 1 })
  })

  return await updatedAnecdote.json()
}

export default { getAll, postAnecdote, voteAnecdote }