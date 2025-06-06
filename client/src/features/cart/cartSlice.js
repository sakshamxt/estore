import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async (itemData, thunkAPI) => {
  try {
    return await cartService.addItemToCart(itemData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, thunkAPI) => {
  try {
    return await cartService.updateItemQuantity(productId, quantity);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (productId, thunkAPI) => {
  try {
    return await cartService.removeItemFromCart(productId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => initialState,
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
    };
    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    };
    // The backend returns the entire updated cart on every operation
    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.items = action.payload.data.cart.items;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(updateCartItem.pending, handlePending)
      .addCase(updateCartItem.fulfilled, handleFulfilled)
      .addCase(updateCartItem.rejected, handleRejected)
      .addCase(removeCartItem.pending, handlePending)
      .addCase(removeCartItem.fulfilled, handleFulfilled)
      .addCase(removeCartItem.rejected, handleRejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;