import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

type TotalPageCount = {
  total: number;
  maxPageCount: number;
};

type VehicleState = {
  value: {
    vehicles: any[];
    counts: Record<string, TotalPageCount>;
  } | null;
};

const initialState: VehicleState = {
  value: null,
};

export const vehicle = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    appendVehcilePage: (state, action) => {
      const status: string = action.payload.statusType;

      const total = action.payload.total;
      const maxPageCount = total && Math.ceil(total / 10);

      const pageNumber = action.payload.pageNumber;

      if (!state.value) {
        state.value = {
          vehicles: [action.payload.vehicles],
          counts: {
            [status]: {
              total,
              maxPageCount,
            },
          },
        };
      } else {
        if (typeof pageNumber === "number") {
          state.value.vehicles[pageNumber] = action.payload.vehicles;

          state.value.counts[status] = {
            total: total ?? state.value.counts[status].total,
            maxPageCount:
              maxPageCount ?? state.value.counts[status].maxPageCount,
          };
        } else {
          const vehicles = state.value.vehicles;

          if (Array.isArray(vehicles)) {
            const lastPageLength = vehicles.at(-1).length;
            const maxPageCount = Math.ceil(total / 10);

            if (lastPageLength < 10) {
            } else {
            }
          } else {
          }
        }
      }
    },
    updateVehicleCounts: (state, action) => {
    },
  },
});

export const { appendVehcilePage, updateVehicleCounts } = vehicle.actions;

export default vehicle.reducer;
