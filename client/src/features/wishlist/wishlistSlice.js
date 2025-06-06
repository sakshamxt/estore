import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService';

const initialState = {
  items: [], // Will store full product objects
  itemIds: [], // Will store just the IDs for quick lookups
  isLoading: false,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, thunkAPI) => {
  try {
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, thunkAPI) => {
  try {
    return await wishlistService.addItemToWishlist(productId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, thunkAPI) => {
  try {
    return await wishlistService.removeItemFromWishlist(productId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.items = action.payload.data.wishlist.products;
      state.itemIds = action.payload.data.wishlist.products.map(p => p._id);
    };
    builder
      .addCase(fetchWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(addToWishlist.fulfilled, handleFulfilled)
      .addCase(removeFromWishlist.fulfilled, handleFulfilled);
  },
});

export default wishlistSlice.reducer;