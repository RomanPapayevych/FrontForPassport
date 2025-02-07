import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import back from '../photos/back-arrow.png'

const DetailsPass = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [passportDetails, setPassportDetails] = useState(null);
    const [passport, setPassports] = useState(null);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const token = localStorage.getItem('token');
    const id = token ? getIdFromToken(token) : null;

    function getIdFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      }
      
    useEffect(() => {
        if (id) {
            console.log('ID received:', id);
            fetchDetails(id); 
        } else {
            console.error('No ID provided in state');
        }
    }, [id]);

    const fetchDetails = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://localhost:7001/api/User/${id}/details`, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });
        setPassportDetails(response.data.data.$values[0]);
        console.log('Passport details:', response.data);
        if (response.data.data.$values[0]?.status === 'Approved') {
            fetchPassport(response.data.data.$values[0].id); 
        }
        console.log('Passport details:', response.data);
        } catch (error) {
            setError('Error fetching passport details.');
            console.error('Error fetching details:', error);
        }
    };
    const fetchPassport = async (applicationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://localhost:7001/api/User/${applicationId}/getPass`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Passport info:', response.data);
            if (response.data && response.data.data) {
                setPassports(response.data.data); 
            } else {
                console.error('No passports found in response');
                setError('No passports found');
            }
        } catch (error) {
            setError('Error fetching passport data.');
            console.error('Error fetching passport data:', error);
        }
    };
  
    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
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

    const handleGoBack = () =>{
        navigate('/profile', { state: { email } });
    };
    return (
        <div className='container_by_receive_passport-------'>
        <button className="back-button" type="submit" onClick={handleGoBack}><img className="back" src={back} alt="" /></button>
        <h1 className='pms'>Passport Details</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {passportDetails ? (
            <div className='wrapper'>
                <div className='form-container'>
                    <h3 className='pms'>Data details</h3>
                    {/* <p className='items'><strong>Passport ID:</strong> {passportDetails.id}</p> */}
                    <p className='items'><strong>Full Name:</strong> {passportDetails.firstName}</p>
                    <p className='items'><strong>Last Name:</strong> {passportDetails.lastName}</p>
                    <p className='items'><strong>Date of Birth:</strong> {formatDate(passportDetails.dateOfBirth)}</p>
                    <p className='items'><strong>Nationality:</strong> {passportDetails.nationality}</p>
                    <p className='items'><strong>Gender:</strong> {passportDetails.gender}</p>
                    <p className='items'><strong>City:</strong> {passportDetails.cityOfResidence}</p>
                    <p className='items'><strong>photoUrl:</strong> {passportDetails.photoUrl}</p>
                    <p className='items'><strong>Passport Status:</strong> {passportDetails.status}</p>
                    {(
                        passportDetails.status === 'Pending' || passportDetails.status === 'Rejected'
                    ) && (
                        <button type="submit" className="btn delete-btn" onClick={handleDelete}>Delete</button>
                    )}
                </div>
                {passport &&(
                <div className='passport-container'>
                    <h3 className='pms'>Passport Details</h3>
                    <div className='passport'>
                        <p className='items'><strong>Passport Number:</strong> {passport.passportNumber || 'N/A'}</p>
                        <p className='items'><strong>Identification Code:</strong> {passport.identificationCode || 'N/A'}</p>
                        <p className='items'><strong>Issue Date:</strong> {new Date(passport.issueDate).toLocaleDateString() || 'N/A'}</p>
                        <p className='items'><strong>Expiry Date:</strong> {new Date(passport.expiryDate).toLocaleDateString() || 'N/A'}</p>
                    </div>
                </div>
                )}
            </div>
        ) : (
            <div className='passport-container'>
                <p style={{color: 'black'}}>You don't have an order and a passport yet</p>
            </div>
        )}
        </div>
    );
};
export default DetailsPass;