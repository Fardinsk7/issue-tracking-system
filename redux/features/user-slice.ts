import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  value: {
    number: number | undefined;
    name: string | undefined;
    views: string[] | undefined;
    id:string|undefined;
  } | null;
};

const initialState: UserState = {
  value: null,
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      console.log(action.payload)
      state.value = {
        id:action.payload._id,
        name: action.payload.name,
        number: action.payload.phone,
        views: action.payload.views,
      };
      localStorage.setItem("id",action.payload._id)
      localStorage.setItem("name",action.payload.name)
      localStorage.setItem("number",action.payload.phone)
      localStorage.setItem("views",action.payload.views)
      localStorage.setItem("role",action.payload.role)
      localStorage.setItem("userVerificationStatus",action.payload.userVerificationStatus)
    },
  },
});

export const { updateUser } = user.actions;

export default user.reducer;
