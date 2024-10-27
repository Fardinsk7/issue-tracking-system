import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface chat{
    _id:string,
    message:string
    senderName:string
    senderNumber:string 
    documentUrl:string
    createdAt:string
  }
  
export interface IssueData {
    _id: string
    issueTitle: string
    mainIssue:string
    assignedTo: string
    relatedTo: string
    issueStatus: string
    problemStatus: string

    description:string
    noOfTimesOpen:string
    vehicleNumber:string
    vehicleStatusBot:string
    driverMobileNumber:string
    issueType:string
    problemIs:string
    proofLink:string
    locationBot:string
    issueLocation:string
    problemProof:string[]
    currentStatus:string
    estimate:string[]
    amountPaidBy:string
    invoicePic:string[]
    total:number
    addedToInventory:string
    taxInvoice:string
    utr_cmsNo:string
    tripSheetNumber:string
    newBatteryPicture:string[]
    subIssue:string
    warrantyProofPicture:string[]
    warrantyProofPicture2:string[]
    sopLink:string
    trackOldBattery:string
    location:string

    chats:chat[]
}

export interface IssueLogs{
  _id:string,
  name:string,
  updateMade:string,
  updatedAt:string,
  issueId:string,
}

export interface initState {
    issueData: any[]
    issueDataStatus: string,
    issueDataError: string|null
    issueLogData: IssueLogs[]
    issueLogDataStatus:string,
    issueLogDataError: string|null
}

export const fetchIssueData = createAsyncThunk('fetchIssueData', async()=>{
    const response = await axios.get('/api/issues/getAllIssues');
    console.log(response.data)
    return response.data.data;
})

export const fetchIssueLogData = createAsyncThunk<
  IssueLogs[],
  string,
  { rejectValue: string }
>('fetchIssueLogData', async (issueId, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/issues/getAllIssueLogs', {
      issueId: issueId
    });
    
    console.log(response.data);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      return rejectWithValue(response.data.message || "Failed to fetch issue log data");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Failed to fetch issue log data");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

const initialState={
    issueData:[],
    issueDataStatus: 'idle',
    issueDataError: null,

    issueLogData:[],
    issueLogDataStatus:'idle',
    issueLogDataError: null,
}

const issueDataSlice = createSlice({
    name:'issueData Slice',
    initialState,
    reducers:{
        addIssueData(state,action){
            state.issueData = [...action.payload]
        },
        // addIssueLogData(state,action: PayloadAction<IssueLogs[]>){
        addIssueLogData(state,action){
          state.issueLogData = [...action.payload]
        }
    },
    extraReducers:(builder)=>{
        builder
      .addCase(fetchIssueData.pending, (state) => {
        state.issueDataStatus = 'loading';
      })
      .addCase(fetchIssueData.fulfilled, (state, action) => {
        (state.issueDataStatus = 'success'),
          (state.issueData = [...action.payload]);
      })
      .addCase(fetchIssueData.rejected, (state, action) => {
        state.issueDataStatus = 'failed';
        state.issueDataError = action.error.message || null;
      })
      
      .addCase(fetchIssueLogData.pending, (state) => {
        state.issueLogDataStatus = 'loading';
      })
      .addCase(fetchIssueLogData.fulfilled, (state, action) => {
        (state.issueLogDataStatus = 'success'),
          (state.issueLogData = [...action.payload]);
      })
      .addCase(fetchIssueLogData.rejected, (state, action) => {
        state.issueLogDataStatus = 'failed';
        state.issueLogDataError = action.error.message || null;
      });
    }
})

export const {addIssueData, addIssueLogData}= issueDataSlice.actions;
export default issueDataSlice.reducer;