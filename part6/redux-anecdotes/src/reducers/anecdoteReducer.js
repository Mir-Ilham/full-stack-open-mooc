import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    newAnecdote(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      const id = action.payload
      const newState = state.map(anecdote => anecdote.id !== id ? anecdote : {
        ...anecdote,
        votes: anecdote.votes + 1
      })
      return newState.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export default anecdoteSlice.reducer

export const { newAnecdote, vote, setAnecdotes } = anecdoteSlice.actions