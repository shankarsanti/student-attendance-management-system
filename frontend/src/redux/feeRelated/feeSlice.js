import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    feeStructuresList: [],
    paymentsList: [],
    feeDefaulters: [],
    studentFeeStatus: [],
    loading: false,
    error: null,
    response: null,
};

const feeSlice = createSlice({
    name: 'fee',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.feeStructuresList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getPaymentsSuccess: (state, action) => {
            state.paymentsList = action.payload;
            state.loading = false;
            state.error = null;
        },
        getDefaultersSuccess: (state, action) => {
            state.feeDefaulters = action.payload;
            state.loading = false;
            state.error = null;
        },
        getStudentFeeSuccess: (state, action) => {
            state.studentFeeStatus = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        stuffAdded: (state) => {
            state.loading = false;
            state.error = null;
            state.response = "Added Successfully";
        },
        stuffUpdated: (state) => {
            state.loading = false;
            state.error = null;
            state.response = "Updated Successfully";
        },
        stuffDeleted: (state) => {
            state.loading = false;
            state.error = null;
            state.response = "Deleted Successfully";
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getPaymentsSuccess,
    getDefaultersSuccess,
    getStudentFeeSuccess,
    getFailed,
    getError,
    stuffAdded,
    stuffUpdated,
    stuffDeleted
} = feeSlice.actions;

export const feeReducer = feeSlice.reducer;
