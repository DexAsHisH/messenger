import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
    name : 'USER_DETAILS',
    initialState: {
        name : null,
        userId: null,
        image: null
    },
    reducers : {
        setUserDetails : (state, action) => {
            state.userId = action.payload.userId
            state.name = action.payload.name
            state.image = action.payload.image
        }   
    }
})



export const userDetailsReducer = reducer;
export const { setUserDetails } = actions