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
      const updatedAnecdote = action.payload
      const newState = state.map(anecdote => anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote)
      return newState.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      const initialAnecdotes = action.payload
      return initialAnecdotes.sort((a, b) => b.votes - a.votes)
    }
  }
})

const { newAnecdote, vote, setAnecdotes } = anecdoteSlice.actions

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

export const voteAnecdote = id => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.voteAnecdote(id)
    dispatch(vote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer