import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const initialState = {
  addresses: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchAddresses = createAsyncThunk('user/fetchAddresses', async (_, thunkAPI) => {
  try {
    return await userService.getAddresses();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addAddress = createAsyncThunk('user/addAddress', async (addressData, thunkAPI) => {
  try {
    return await userService.addAddress(addressData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const deleteAddress = createAsyncThunk('user/deleteAddress', async (addressId, thunkAPI) => {
  try {
    await userService.deleteAddress(addressId);
    return addressId; // Return the ID on success
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.data.addresses;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
          state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload.data.address);
      });
  },
});

export default userSlice.reducer;