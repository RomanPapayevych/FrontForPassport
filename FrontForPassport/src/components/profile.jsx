import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import  {jwtDecode}  from 'jwt-decode';
import AdminProfile from './adminProfile'
import UserProfile from './userProfile';
import userIcon from '../photos/userIcon.png' 
import entrance from '../photos/entrance.png'


const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};
    
    const token = localStorage.getItem("token");
    let decodedToken = null;
    let isAdmin = false;
    
    if (token) {
        console.log("Stored token:", token);
        try {
        decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        isAdmin = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin';
        } catch (error) {
            console.error("Error decoding token:", error.message);
        }
    }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7001/api/Auth/logout", null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    localStorage.removeItem("token");
    navigate("/login");
    } catch(error){
        console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
};

  return (
    <div className='container_profile'>
      {decodedToken ? (
        <>
            <div className='profile-info'>
                {email ? (
                  <div>
                    <p className='welcome-text'> <img className='user-img' src={userIcon} alt=""/>  Welcome, {email}!<button className='button-logout' onClick={handleLogout}><img className='entrance-img' src={entrance} alt=""/></button></p>
                  </div>
                ) : (
                  <p className='welcome-text'>Email not provided.</p>
                )}

                {isAdmin ? (<AdminProfile/>) : (<UserProfile/>)}
            </div>
        </>
      ) : (
        <>
            <p>Token not decoded</p>
        </>
      )}
    </div>
  );
};

export default Profile;
