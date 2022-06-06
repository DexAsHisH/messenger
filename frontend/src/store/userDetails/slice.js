import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
    name : 'USER_DETAILS',
    initialState: {
        name : null,
        userId: null,
        image: null,
        username: null,
        email: null,
        token: null,
        firstName: null,
        lastName: null,
    },
    reducers : {
        setUserDetails : (state, action) => {
            state.userId = action.payload.userId
            state.name = action.payload.name
            state.image = action.payload.image
            state.email = action.payload.email
            state.username = action.payload.username
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
        }   
    }
})



export const userDetailsReducer = reducer;
export const { setUserDetails } = actions