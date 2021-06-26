import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
    name : 'USER_DETAILS',
    initialState: {},
    reducers : {
        getName : () => {

        }
    }
})



export const userDetails = reducer;
export const { getName } = actions