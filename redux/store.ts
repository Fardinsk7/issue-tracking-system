import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";

import vehicleReducer from "./features/vehicles-slice";
import userReducer from "./features/user-slice";
import sidebarToggleReducer from "./features/sidebar-toogle-slice";
import vehicleSearchTermReducer from "./features/vehicle-search-slice";
import issueDataReducer from "./features/issue-data";
import processAreasData from "./features/processAreasData";
import usersDataSlice from "./features/usersDataSlice"

export const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    user: userReducer,
    sidebarToggle: sidebarToggleReducer,
    vehicleSearchTerm: vehicleSearchTermReducer,
    issueData:issueDataReducer,
    processAreasData:processAreasData,
    usersData:usersDataSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
