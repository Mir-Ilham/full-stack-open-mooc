import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

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

const { newAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const postedAnecdote = await anecdoteService.postAnecdote(content)
    dispatch(newAnecdote(postedAnecdote))
  }
}

export default anecdoteSlice.reducer

export const { vote } = anecdoteSlice.actions