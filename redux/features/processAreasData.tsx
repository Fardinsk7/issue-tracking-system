import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export interface IFromsData{
    formName:string;
    formId:string;
}

export interface IProcessAreas {
  _id: string;
  nameOfProcess:string;
  label:string;
  forms:IFromsData[];
}

export interface initState {
  processAreasData: IProcessAreas[];
  processAreasDataStatus: string;
  processAreasDataError: string | null;
}

export const fetchProcessAreasData = createAsyncThunk(
  'fetchProcessAreasData',
  async () => {
    try {
      const response = await axios.get('/api/getAllProcessAreas', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store', // Prevent caching
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch process areas data');
    }
  }
);

const initialState: initState = {
    processAreasData: [],
    processAreasDataStatus: 'idle',
    processAreasDataError:null,
};

const processAreasDataSlice = createSlice({
  name: 'packingMaterialData',
  initialState,
  reducers: {
    addProcessAreasData(state, action: PayloadAction<IProcessAreas[]>) {
      state.processAreasData = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcessAreasData.pending, (state) => {
        state.processAreasDataStatus = 'loading';
      })
      .addCase(fetchProcessAreasData.fulfilled, (state, action) => {
        state.processAreasDataStatus = 'success';
        state.processAreasData = [...action.payload];
      })
      .addCase(fetchProcessAreasData.rejected, (state, action) => {
        state.processAreasDataStatus = 'failed';
        state.processAreasDataError = action.error.message || null;
      });
  }
});

export const { addProcessAreasData } = processAreasDataSlice.actions;

export default processAreasDataSlice.reducer;
