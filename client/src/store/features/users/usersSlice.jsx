import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const usersList = createAsyncThunk('users/usersList', async (pagePagin, thunkAPI) => {
    try {
        const { startPage, endPage } = pagePagin
        const token = JSON.parse(localStorage.getItem('user'))
        var config = {
            method: 'post',
            url: 'https://13.u6964.xvest3.ru/',
            headers: {
                'TOKEN': token.token
            },
            data: {
                "method": "user.list",
                "params": {
                    "startPage": startPage,
                    "endPage": endPage
                }
            }
        };
        const res = await axios(config)
        if (res) {
            return await res.data.result
        }
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(usersList.fulfilled, (state, action) => {
                state.users = action.payload
            })
    },
})
export const { reset } = usersSlice.actions
export default usersSlice.reducer