import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export interface IUsersData {
    _id: string;
    name:string;
    phone:string;
    role:string;
    userVerificationStatus:string;
}

export interface initState {
  usersData: IUsersData[];
  usersDataStatus: string;
  usersDataError: string | null;
}

export const fetchUsersData = createAsyncThunk(
  'fetchUsersData',
  async () => {
    try {
      const response = await axios.get('/api/users/getAllUsers', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store', // Prevent caching
        },
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch inter Branches data');
    }
  }
);

const initialState: initState = {
    usersData: [],
    usersDataStatus: 'idle',
    usersDataError:null,
};

const usersDataSlice = createSlice({
  name: 'usersData',
  initialState,
  reducers: {
    addUsersData(state, action: PayloadAction<IUsersData[]>) {
      state.usersData = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersData.pending, (state) => {
        state.usersDataStatus = 'loading';
      })
      .addCase(fetchUsersData.fulfilled, (state, action) => {
        state.usersDataStatus = 'success';
        state.usersData = [...action.payload];
      })
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.usersDataStatus = 'failed';
        state.usersDataError = action.error.message || null;
      });
  }
});

export const { addUsersData } = usersDataSlice.actions;

export default usersDataSlice.reducer;
