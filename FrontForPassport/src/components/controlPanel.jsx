import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'; 
import back from '../photos/back-arrow.png'

const ControlPanel = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [orders, setOrder] = useState([])
    const [error, setError] = useState(null);

    const [searchCity, setSearchCity] = useState('')

    const email = location.state?.email;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () =>{
            try{
                const response = await axios.get(`https://localhost:7001/api/Admin`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(response.data.$values)
            }catch(error){
                console.error("Error fetching orders", error);
                setError("Error fetching orders");
            }
        }
        fetchOrders();
    }, [token]);

    const sortedOrders = [...orders].sort((a,b) => {
        return a.cityOfResidence.localeCompare(b.cityOfResidence);
    });

    const filteredOrders = sortedOrders.filter(order => 
        order.cityOfResidence.toLowerCase().includes(searchCity.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchCity(e.target.value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    const handleGoBack = () =>{
        navigate('/profile', { state: { email } });
    };

    const handleCreatePassport = (id) => {
        try{
            const response =  axios.post(`https://localhost:7001/api/Admin/${id}/createPass`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(prevOrders => prevOrders.filter(order => order.id !== id))
        }catch(error){
            console.error("Error creating passport: ", error)
        }
    }

    const handleRejectPassport =  (id) => {
        try{
            const response =  axios.delete(`https://localhost:7001/api/Admin/${id}/rejectPass`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(prevOrders => prevOrders.filter(order => order.id !== id))
            console.log("Passport deleted successfully");
        }catch(error){
            console.error("Error deleting passport: ", error);
        }
    }
    return(
        <div className='container--'>
        <button className="back-button" type="submit" onClick={handleGoBack}><img className="back" src={back} alt="" /></button>
            <h1 className='pms'>Orders</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <input type="text" placeholder="Search by City" value={searchCity} onChange={handleSearchChange} className="search-input"/>
            </div>
            {filteredOrders.length > 0 ? (
            <div>
                <div className='order-container'>
                    {filteredOrders.map(order => (
                        <div key={order.id} className="order-item">
                            <p className='items'><strong>Full name:</strong> {order.firstName} {order.lastName}</p>
                            <p className='items'><strong>Date of Birth:</strong> {formatDate(order.dateOfBirth)}</p>
                            <p className='items'><strong>Nationality:</strong> {order.nationality}</p>
                            <p className='items'><strong>Gender:</strong> {order.gender}</p>
                            <p className='items'><strong>City:</strong> {order.cityOfResidence}</p>
                            <p className='items'><strong>photoUrl:</strong> {order.photoUrl}</p>
                            <p className='items'><strong>Passport Status:</strong> {order.status}</p>
                            <button className='btn create-btn' onClick={() => handleCreatePassport(order.id)}>
                                Create Passport
                            </button>
                            <button className='button-delete' onClick={() => handleRejectPassport(order.id)}>
                                Reject Passport
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className='passport-container'>
                <p style={{color: 'black'}}>Order list empty</p>
            </div>
        )}
        </div>
    );

}
export default ControlPanel; 