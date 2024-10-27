import { createSlice } from "@reduxjs/toolkit";

type ToggleState = {
  value: string;
};

const initialState: ToggleState = {
  value: ""
};

export const vehicleSearchTerm = createSlice({
  name: "vehicleSearchTerm",
  initialState,
  reducers: {
    updateSearchTerm: (state, action) => {
      state.value = action.payload.value;
    }
  },
});

export const { updateSearchTerm } = vehicleSearchTerm.actions;

export default vehicleSearchTerm.reducer;
