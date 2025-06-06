import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  orders: [],
  order: null,
  razorpayOrder: null,
  isLoading: false,
  isError: false,
  message: '',
};


export const fetchMyOrders = createAsyncThunk('order/fetchMy', async (_, thunkAPI) => {
    try {
        return await orderService.getMyOrders();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});


export const createOrder = createAsyncThunk('order/create', async (orderData, thunkAPI) => {
  try {
    return await orderService.createOrder(orderData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const verifyPayment = createAsyncThunk('order/verify', async (verificationData, thunkAPI) => {
  try {
    const response = await orderService.verifyPayment(verificationData);
    // After successful verification, reset the cart
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.razorpayOrder = action.payload.data;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.data.order;
        state.razorpayOrder = null;
      })
      .addCase(fetchMyOrders.pending, (state) => {
    state.isLoading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orders = action.payload.data.orders;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;