import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import useJwt from "@src/auth/jwt/useJwt";

// ✅ Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await useJwt.getAllProduct();
      return res.data.content.result;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    isCutomerSelected: false,
    filterItems: [],
  },
  reducers: {
    // You can add extra reducers like addProduct, removeProduct if needed
    checkCustomerSelected: (state, action) => {
      state.isCutomerSelected = action.payload;
    },
    storefilterSearch: (state, action) => {
      state.filterItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { checkCustomerSelected, storefilterSearch } =
  productSlice.actions;

export default productSlice.reducer;
