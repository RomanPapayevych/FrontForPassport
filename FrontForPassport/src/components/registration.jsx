import React, { useState } from "react";
import axios from "axios";
import { useNavigate,useNavigation,Link} from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
          }
        try{
            const response = await axios.post("https://localhost:7001/api/Auth/register", {name, email, password, confirmPassword});
            if(response.status === 200){
                setSuccess('User registered!');
                setTimeout(() => {navigate('/login');}, 1000)
            }
        }catch(error){
            console.error("Login failed:", error.response ? error.response.data : error.message)
        }
    }

    return(
        <div className="login_frame">
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input className="inp" value={name} onChange={(e) => setName(e.target.value)} type="name" required placeholder="Name"/>
                </div>
                <div>
                    <input className="inp" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email"/>
                </div>
                <div>
                    <input className="inp" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password"/>
                </div>
                <div>
                    <input className="inp" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required placeholder="Confirm Password"/>
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Do you have an account?</p>
            <Link to="/login"> login </Link>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};
export default Registration;