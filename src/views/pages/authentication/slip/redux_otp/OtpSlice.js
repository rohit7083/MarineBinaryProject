import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countDown: 30,
  canResendOtp: false,
  showCallOption: false,
  mode: "initial",
};

const OtpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    startOtpCountdown: (state) => {
      state.countDown = 30;
      state.canResendOtp = false;
      state.showCallOption = false;
      state.mode = "initial";
    },

    tickCountdown: (state) => {
      if (state.countDown > 0) {
        state.countDown -= 1;
      }

      if (state.countDown === 0 && state.mode === "initial") {
        state.canResendOtp = true;
        state.mode = "resend";
        state.countDown = 60;
      } else if (state.countDown === 0 && state.mode === "resend") {
        state.showCallOption = true;
        state.mode = "call";
      }
    },

    resetOtp: () => initialState,
  },
});

export const { startOtpCountdown, tickCountdown, resetOtp } = OtpSlice.actions;
export default OtpSlice.reducer;
