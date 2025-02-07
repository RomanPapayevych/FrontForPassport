import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  
import back from '../photos/back-arrow.png'

const CreatePassport = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');
    const [cityOfResidence, setCityOfResidence] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();   
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const token = localStorage.getItem("token"); 
            const config = {
              headers: {
                Authorization: `Bearer ${token}`
              },
            };
            var response = await axios.post('https://localhost:7001/api/User/createOrder', 
                {
                    firstName,
                    lastName,
                    dateOfBirth,
                    nationality,
                    gender,
                    cityOfResidence,
                    photoUrl
                }, config);

                if(response.data.succeeded){
                  toast.success("Order successfully created!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }); 

                setTimeout(() => {
                  navigate('/profile', {state: {email}});
                }, 2000);
                
              } else {
                  setErrorMessage(response.data.message);
                  toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
        }catch(error){
          if (error.response && error.response.data.errors) {
            const errors = error.response.data.errors;
            for (const [field, messages] of Object.entries(errors)) {
              if (field !== "$id") {
                  if (Array.isArray(messages)) {
                      messages.forEach((message) => {
                          toast.error(`${message}`, {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                          });
                      });
                  } else {
                      toast.error(`${field}: ${messages}`, {
                          position: "top-right",
                          autoClose: 3000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                      });
                  }
              }
          }
          } else{
            console.error("Error creating passport:", error.message);
            toast.error("An unexpected error occurred. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
          }
        }
    }
    
    const handleGoBack = () =>{
        navigate('/profile', { state: { email } });
    };

    return(
    <div>
      <button className="back-button" type="submit" onClick={handleGoBack}><img className="back" src={back} alt="" /></button>
      <h1 className="create-pass-h">Create Passport</h1>
      <div className="container_two">
        <form onSubmit={handleSubmit}>
        <div>
          <input className="inp-f" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="First name"/>
          <input className="inp-f" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Last name"/>
        </div>
        <div>
          <input className="inp-date" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required placeholder="Birthday"/>
        </div>
        <div>
          <input className="inp" type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} required placeholder="Nationality"/>
        </div>
        <div>
          <input className="inp" type="text" value={gender} onChange={(e) => setGender(e.target.value)} required placeholder="Gender"/>
        </div>
        <div>
          <input className="inp" type="text" value={cityOfResidence} onChange={(e) => setCityOfResidence(e.target.value)} required placeholder="City of residence"/>
        </div>
        <div>
          <input className="inp" type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} required placeholder="Photo"/>
        </div>
        <button className="button-create" type="submit">Create</button>
      </form>
      <ToastContainer />
    </div>
    </div>
    );
}
export default CreatePassport;