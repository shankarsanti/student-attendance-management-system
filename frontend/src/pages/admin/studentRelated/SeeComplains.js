import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, IconButton, Chip, Select, MenuItem, FormControl
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Popup from '../../../components/Popup';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const handleStatusChange = async (complainId, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/Complain/${complainId}`, {
        status: newStatus
      });
      dispatch(getAllComplains(currentUser._id, "Complain"));
      setMessage("Status updated successfully");
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setMessage("Error updating status");
      setShowPopup(true);
    }
  };

  const handleDelete = async (complainId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/Complain/${complainId}`);
      dispatch(getAllComplains(currentUser._id, "Complain"));
      setMessage("Complain deleted successfully");
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setMessage("Error deleting complain");
      setShowPopup(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 200 },
    { id: 'date', label: 'Date', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 150 },
  ];

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user ? complain.user.name : 'Unknown User',
      complaint: complain.complaint,
      date: dateString,
      status: complain.status || 'Pending',
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            displayEmpty
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
        <Chip 
          label={row.status} 
          color={getStatusColor(row.status)} 
          size="small" 
        />
        <IconButton onClick={() => handleDelete(row.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              No Complains Right Now
            </Box>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(complainsList) && complainsList.length > 0 &&
                <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
              }
            </Paper>
          }
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default SeeComplains;