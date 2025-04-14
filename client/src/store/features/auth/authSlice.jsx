import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))
const newUser = JSON.parse(localStorage.getItem('newUser'))

const initialState = {
  user: user ? user : false,
  newUser: newUser ? newUser : false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}
// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      var data = `{"method": "user.registration",    "params": {        "login": "${user.username}",        "password": "${user.password}",        "repeat_password": "${user.password2}",        "email": "${user.email}",        "magazin_id": ${user.magazin_id},        "magazin_token": "${user.magazin_token}"    }}`;
      const token = JSON.parse(localStorage.getItem('user'))
      var config = {
        method: 'post',
        url: 'https://13.u6964.xvest3.ru/',
        headers: {
          'TOKEN': token.token
        },
        data: data
      };
      const newData = await axios(config)
      if (newData) {
        return newData.data
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
  }
)

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    var data = `{    "method": "user.login",    "params": {        "login": "${user.username}",        "password": "${user.password}"    }}`;
    var config = {
      method: 'POST',
      url: 'https://13.u6964.xvest3.ru/',
      data: data
    };
    const res = await axios(config)
    if (res.data.result) {
      localStorage.setItem('user', JSON.stringify(res.data.result))
    }
    return res.data.result;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await localStorage.removeItem('user')
  await localStorage.removeItem('newUser')
})
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.welcome = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.newUser = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.newUser = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = false
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.user = false
        state.newUser = false
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
