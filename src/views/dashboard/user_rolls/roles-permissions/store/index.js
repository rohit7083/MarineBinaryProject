// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import useJwt from "@src/auth/jwt/useJwt";
// ** Axios Imports
import axios from 'axios'

export const getData = createAsyncThunk('permissions/getData', async params => {
  const response = await axios.get('/apps/permissions/data', { params })
  return {
    total: response.data.total,
    params: response.data.params,
    allData: response.data.allData,
    data: response.data.permissions
  }
})



// export const getData = createAsyncThunk('permissions/getData', async (params, { rejectWithValue }) => {
//   try {
    const response = await useJwt.userpermission();

//     // Assuming the structure of `response` matches the original template
//     return {
//       total: response.data.total,
//       // params: response.data.params,
//       allData: response.data.allData,
//       data: response.data.permissions,
//     };
//   } catch (error) {
//     // Handle errors gracefully
//     return rejectWithValue(error.response?.data || 'Something went wrong');
//   }
// });  



export const addPermission = createAsyncThunk(
  'permissions/addPermission',
  async (permission, { dispatch, getState }) => {
    await axios.post('/apps/permissions/add-permission', { permission })
    await dispatch(getData(getState().permissions.params))
    return permission
  }
)

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, name }, { dispatch, getState }) => {
    await axios.post('/apps/permissions/update-permission', { id, name })
    await dispatch(getData(getState().permissions.params))
    return { id, name }
  }
)

export const deletePermission = createAsyncThunk('permissions/deletePermission', async (id, { dispatch, getState }) => {
  await axios.delete('/apps/permissions/delete', { id })
  await dispatch(getData(getState().permissions.params))
  return id
})

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selected: null
  },
  reducers: {
    selectPermission: (state, action) => {
      if (action.payload === null) {
        state.selected = null
      } else {
        state.selected = action.payload
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export const { selectPermission } = permissionsSlice.actions

export default permissionsSlice.reducer




// // ** Redux Imports
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// // ** useJwt API Import
// import useJwt from "@src/auth/jwt/useJwt";

// // Async Thunk to fetch permission data
// export const getData = createAsyncThunk('permissions/getData', async (params) => {
//   const res = await useJwt.permission(); // Use your new API
//   const data = res.content.result; // Assuming the data you need is in the 'result' field
//   return {
//     total: data.length, // Calculate total based on the length of the result
//     params: params,
//     allData: data, // This is your full data array from the API
//     data: data // Same data as 'data' in the state
//   }
// })

// // Async Thunks for add, update, and delete remain the same as before
// export const addPermission = createAsyncThunk(
//   'permissions/addPermission',
//   async (permission, { dispatch, getState }) => {
//     await axios.post('/apps/permissions/add-permission', { permission })
//     await dispatch(getData(getState().permissions.params))
//     return permission
//   }
// )

// export const updatePermission = createAsyncThunk(
//   'permissions/updatePermission',
//   async ({ id, name }, { dispatch, getState }) => {
//     await axios.post('/apps/permissions/update-permission', { id, name })
//     await dispatch(getData(getState().permissions.params))
//     return { id, name }
//   }
// )

// export const deletePermission = createAsyncThunk('permissions/deletePermission', async (id, { dispatch, getState }) => {
//   await axios.delete('/apps/permissions/delete', { id })
//   await dispatch(getData(getState().permissions.params))
//   return id
// })

// export const permissionsSlice = createSlice({
//   name: 'permissions',
//   initialState: {
//     data: [],
//     total: 1,
//     params: {},
//     allData: [],
//     selected: null
//   },
//   reducers: {
//     selectPermission: (state, action) => {
//       if (action.payload === null) {
//         state.selected = null
//       } else {
//         state.selected = action.payload
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getData.fulfilled, (state, action) => {
//       state.data = action.payload.data
//       state.total = action.payload.total
//       state.params = action.payload.params
//       state.allData = action.payload.allData
//     })
//   }
// })

// export const { selectPermission } = permissionsSlice.actions

// export default permissionsSlice.reducer
