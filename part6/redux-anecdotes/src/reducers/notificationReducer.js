import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Notify',
  reducers: {
    notificationChange(state, action) {
      return action.payload
    }
  }
})

export default notificationSlice.reducer

export const { notificationChange } = notificationSlice.actions