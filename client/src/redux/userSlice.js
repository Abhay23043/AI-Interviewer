import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: JSON.parse(localStorage.getItem("user") || "null")
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        clearUserData: (state) => {
            state.userData = null
            localStorage.removeItem("user")
            localStorage.removeItem("token")
        }
    }
})

export const { setUserData, clearUserData } = userSlice.actions

export default userSlice.reducer 