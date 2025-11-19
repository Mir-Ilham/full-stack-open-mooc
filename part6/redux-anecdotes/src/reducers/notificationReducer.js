import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return ''
    }
  }
})

const { addNotification, resetNotification } = notificationSlice.actions

export const setNotification = (notification, timeout) => {
  return (dispatch) => {
    dispatch(addNotification(notification))
    setTimeout(() => {
      dispatch(resetNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer