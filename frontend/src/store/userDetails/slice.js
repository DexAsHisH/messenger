import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
    name : 'USER_DETAILS',
    initialState: {
        name : null,
        userId: null
    },
    reducers : {
        setUserDetails : (state, action) => {
            state.userId = action.payload.userId
            state.name = action.payload.name
        }   
    }
})



export const userDetailsReducer = reducer;
export const { setUserDetails } = actions