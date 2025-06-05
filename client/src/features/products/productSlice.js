import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  product: null,
  totalProducts: 0,
  totalPages: 1,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Fetch products with pagination/sorting/filtering
export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params, thunkAPI) => {
    try {
      // The API response is expected to be { data: { products: [], totalProducts: X, totalPages: Y } }
      return await productService.getProducts(params);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, thunkAPI) => {
    try {
      // The API response is expected to be { data: { product: {...} } }
      return await productService.getProductById(productId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => {
      // When resetting, we might want to preserve the list of products
      // but clear the single product view.
      state.product = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data.products;
        state.totalProducts = action.payload.data.totalProducts;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // ADD CASES for fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.product = null; // Clear previous product
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload.data.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;