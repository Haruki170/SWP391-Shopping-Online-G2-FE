import { configureStore } from '@reduxjs/toolkit'
import authReduce from './slice/AuthSlice'
import orderReduce from './slice/OrderSlice'
import forgotReduce from './slice/ForgotPasswordSlice'
import chatReduce from "./slice/ChatSlice"
export const store = configureStore({
  reducer: {
    auth : authReduce,
    order: orderReduce,
    forgot: forgotReduce,
    chat: chatReduce
  },
})