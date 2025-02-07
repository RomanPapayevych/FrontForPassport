import { useNavigate, useLocation } from 'react-router-dom';
import logoMainPage from '../photos/logo-mainpage.jpg'

const UserProfile = () => {
    const navigate = useNavigate('')
    const location = useLocation();
    const email = location.state?.email;

    const handleCreatePassport = (e) => {
        e.preventDefault();
        try{
            navigate('/createPassport', {state: {email}})
        }catch(error){
            console.error("wrong")
        }
    };
    const handleGetDetails = async (e) =>{
        e.preventDefault();
        try{   
            navigate('/detailsPass', {state: {"email" : email}})
            console.log(localStorage.getItem('id'));
        }catch(error){
            console.error("wrong")
        }
    };

    return(
        <div className="container">
            <h1 className="pms">Passport Management System</h1>
            <div className="action-buttons">
                <img className='logoMainPage' src={logoMainPage} alt="" />
                <button className="button-create" onClick={handleCreatePassport} >Create a passport order</button>
                <button className="button-create" onClick={handleGetDetails}>Get Application Details</button>
            </div>
        </div>
    );
}
export default UserProfile;