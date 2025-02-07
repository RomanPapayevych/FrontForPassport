import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7001/api/Auth/login", {
        email,
        password,
      });
      const token = response.data;
      localStorage.setItem("token", token);
      
      const id = response.data;
      localStorage.setItem("id", id);
      console.log(("id:", id));

      navigate('/profile', {state : {email, id}});
      console.log("Login successful:", response.data.message);
    } catch (error) {
      setErrorMessage("Invalid email or password");
      console.error("Login failed:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="login_frame">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/>
        </div>
        <div>
          <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/>
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account?</p>
      <Link to="/registration"> registration </Link>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
