import { createSlice } from '@reduxjs/toolkit'

const initialState = {

}

const orderSlice = createSlice({
  name: "order",
  initialState: {
        order:[]
  },
  reducers: {
    ADD_ORDER : (state,action) => {
        state.order = action.payload
    },
    REMOVE_ORDER : (state) => {
        state.order = []
    }
  }
});

export const {ADD_ORDER,REMOVE_ORDER} = orderSlice.actions

export default orderSlice.reducer