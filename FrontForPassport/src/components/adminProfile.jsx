import { useNavigate, useLocation } from 'react-router-dom';

const AdminProfile = () => {
    const navigate = useNavigate() 
    const location = useLocation() 
    const email = location.state?.email;
    
    const handleControl = () =>{
        navigate("/controlPanel", {state: {email}})
    }
    const handleDeletePass = () => {
        navigate("/controlDeletePassport", {state : {email}})
    }

    return (
        <div className="container_for_admin">
            <h1 className="pms">Passport Management System</h1>
            <div className="action-buttons">
                <button className="btn create-btn" onClick={handleControl}>Get orders</button>
                <button className="btn delete-btn" onClick={handleDeletePass}>Manage Passport</button>
            </div>
        </div>
    );
}
export default AdminProfile;