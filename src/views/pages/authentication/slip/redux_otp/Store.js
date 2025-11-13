// store.js
import { configureStore } from "@reduxjs/toolkit";
import otpReducer from "./path/to/OtpSlice"; // adjust this path

const Store = configureStore({
  reducer: {
    otp: otpReducer, // This MUST match useSelector((state) => state.otp)
  },
});

export default Store;
