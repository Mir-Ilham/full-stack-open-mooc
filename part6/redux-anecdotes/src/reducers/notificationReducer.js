import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return ''
    }
  }
})

export default notificationSlice.reducer

export const { setNotification, resetNotification } = notificationSlice.actions