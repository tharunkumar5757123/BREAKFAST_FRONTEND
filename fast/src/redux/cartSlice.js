import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null, // store single selected item for booking
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.item = action.payload;
    },
    clearCart: (state) => {
      state.item = null;
    },
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
