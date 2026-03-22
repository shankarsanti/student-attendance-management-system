import axios from 'axios';
import {
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
} from './feeSlice';

export const getAllFeeStructures = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeStructures/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const createFeeStructure = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeStructureCreate`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const updateFeeStructure = (id, fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FeeStructure/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffUpdated());
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const deleteFeeStructure = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/FeeStructure/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDeleted());
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const recordPayment = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FeePaymentCreate`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const getAllPayments = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeePayments/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getPaymentsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const getStudentPayments = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/StudentPayments/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getPaymentsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const getStudentFeeStatus = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/StudentFeeStatus/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getStudentFeeSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const getFeeDefaulters = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeDefaulters/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDefaultersSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};

export const deletePayment = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/FeePayment/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDeleted());
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
    }
};
