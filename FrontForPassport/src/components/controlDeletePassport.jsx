import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import back from '../photos/back-arrow.png'

const ControlDeletePassport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email
    const [passports, setPassports] = useState([]);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const token = localStorage.getItem('token');

    const fetchPassport = async () => {
        try{
            const response = await axios.get('https://localhost:7001/api/Admin/getPass', {
                headers: { Authorization : `Bearer ${token}`}
            });
            setPassports(response.data.data.$values);   
        }catch(error){
            setError('Error fetching passports');
            console.error('Error fetching passports:', error);
        }
    }
    useEffect(() => {
        fetchPassport();
        CountsOfPass();
    }, [])

    const handleDeletePassport = async (passportId) => {
        try{
            const response = await axios.delete(`https://localhost:7001/api/Admin/${passportId}/deletePass`)
            setPassports(passports.filter(passport => passport.id !== passportId))
            CountsOfPass();
        }catch(error){
            console.error('Error deleting passport:', error);
            setError('Error deleting passport');
        }
    }

    const handleGenerateReport = async (passportId) => {
        try{
            const response = await axios.get(`https://localhost:7001/api/Admin/${passportId}/GenerateReport`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `passport_report_${passportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }catch(error){
            setError(`Error generating report`);
            console.error(`Error generating report:`, error);
        }
    }

    const handleGenerateCsvReport = async (passportId) => {
        try{
            const response = await axios.get(`https://localhost:7001/api/Admin/${passportId}/GenerateCsvReport`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'passport_report.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }catch(error){
            setError(`Error generating ${format} report`);
            console.error(`Error generating ${format} report:`, error);
        }
    }

    const CountsOfPass = async () => {
        try{
            const response = await axios.get(`https://localhost:7001/api/Admin/GetTotalPassportCount`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCount(response.data.data);
        }catch(error){
            console.error('Error fetching passport count:', error);
        }
    }

    const handleGoBack = () =>{
        navigate('/profile', { state: { email } });
    };

    return (
        <div>
        <button className="back-button" type="submit" onClick={handleGoBack}><img className="back" src={back} alt="" /></button>
            <h1 className='pms'>Passport list</h1>
            <div>
                <h3 className="total">Total passports created: {count}</h3>
            </div>
            {error && <p style={{color: 'red'}}>error</p>}
            {passports.length > 0 ? (
                <div>
                    <div className='order-container'>
                    {passports.map((passport) => (
                        <div key={passport.id} className="order-item">
                            <p className='items'><strong>ID:</strong> {passport.id}</p>
                            <p className='items'><strong>Passport Number:</strong> {passport.passportNumber}</p>
                            <p className='items'><strong>Identification Code:</strong> {passport.identificationCode}</p>
                            <p className='items'><strong>Issue Date:</strong> {new Date(passport.issueDate).toLocaleDateString()}</p>
                            <p className='items'><strong>Expiry Date:</strong> {new Date(passport.expiryDate).toLocaleDateString()}</p>
                            <button className='button-generate' onClick={() => handleGenerateReport(passport.id)}>
                                    Generate PDF Report
                            </button>
                            <button className='button-generate' onClick={() => handleGenerateCsvReport(passport.id)}>
                                    Generate CSV Report
                            </button>
                            <button className='button-delete' onClick={() => handleDeletePassport(passport.id)}>
                                Delete Passport and Related Data
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
            ): (
                <div className='passport-container'>
                    <p style={{color: 'black'}}>No passports found</p>
                </div>
            )}
        </div>
    );
}
export default ControlDeletePassport;