import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const DetailsPass = () => {
  const [passportDetails, setPassportDetails] = useState(null);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();   
  const location = useLocation();
  const email = location.state?.email;
  
  const token = localStorage.getItem('token');
  const id = token ? getIdFromToken(token) : null;
  
  function getIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  }
  
  useEffect(() => {
    if (id) {
      fetchDetails(id);
    } else {
      console.error('No ID provided in state');
    }
  }, [id]);

  const fetchDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7001/api/User/${id}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassportDetails(response.data.data.$values[0]);
    } catch (error) {
      setError('Error fetching passport details.');
      console.error('Error fetching details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://localhost:7001/api/User/${passportDetails.id}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.succeeded) {
        navigate('/profile', {state: {email}})
      } else {
        setDeleteError(response.data.message || 'Failed to delete order.');
      }
    } catch (error) {
      setDeleteError('Error deleting order.');
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div>
      <h1>Passport Details</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {passportDetails ? (
        <div>
          <p><strong>Passport ID:</strong> {passportDetails.id}</p>
          <p><strong>Full Name:</strong> {passportDetails.firstName}</p>
          <p><strong>Last Name:</strong> {passportDetails.lastName}</p>
          <p><strong>Date of Birth:</strong> {passportDetails.dateOfBirth}</p>
          <p><strong>Nationality:</strong> {passportDetails.nationality}</p>
          <p><strong>Gender:</strong> {passportDetails.gender}</p>
          <p><strong>City:</strong> {passportDetails.cityOfResidence}</p>
          <p><strong>Photo URL:</strong> {passportDetails.photoUrl}</p>
          <p><strong>Status:</strong> {passportDetails.status}</p>
          <button className="btn delete-btn" onClick={handleDelete}>Delete Order</button>
          {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
        </div>
      ) : (
        <p>Loading passport details...</p>
      )}
    </div>
  );
};

export default DetailsPass;