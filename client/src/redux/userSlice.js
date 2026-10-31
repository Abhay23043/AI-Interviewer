import { createSlice } from "@reduxjs/toolkit"

const storedUser = (() => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
        localStorage.removeItem("user")
        return null
    }
})()

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: storedUser
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