// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // cart items will be stored here
  billing: {
    subtotal: 0,
    tax: 0,
    total: 0,
  },
};

const calculateBilling = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1; // 10% example tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
   addItem: (state, action) => {
  const item = action.payload;
  const existing = state.items.find((i) => i.id === item.id);

  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    state.items.push({ ...item, qty: item.qty || 1 });
  }

  state.billing = calculateBilling(state.items);
},


    updateItemQty: (state, action) => {
      const { id, qty } = action.payload;
      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        existing.qty = qty;
      }

      state.billing = calculateBilling(state.items);
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.billing = calculateBilling(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.billing = { subtotal: 0, tax: 0, total: 0 };
    },
  },
});

export const { addItem, updateItemQty, removeItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
