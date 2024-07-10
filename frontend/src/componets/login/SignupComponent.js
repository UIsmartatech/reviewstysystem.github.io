import React,{useEffect, useState} from 'react';
import './login.css';
import smartatechLogo from '../../Assets/profile_img/smartatechlogo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function SignupComponent({ email }) {
  const [otp, setOTP] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigate = useNavigate();
  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const SignupComponent = (event) => {
    event.preventDefault();
    // Assuming you have an API endpoint to verify OTP
    fetch('http://localhost/review_system/backend/src/login.php', {
      method: 'POST',
      headers: {
        //'Content-Type': 'application/json',
      },
       body: new URLSearchParams({
        email: email,otp
        
      })
    })
      .then(response => {
        // Handle response
        if (response.ok) {
          setVerificationStatus('OTP verified successfully!');

          navigate('/dashboard');
         
        } else {
          setVerificationStatus('OTP verification failed. Please try again.');
        }
      })
      .catch(error => {
        // Handle network error
        console.error('Network error:', error);
        setVerificationStatus('Network error. Please try again.');
      });
  };



  return (
    <div className="login-container">
      <div className="loginContainer">
        <div className="login">
        <form onSubmit={SignupComponent}>
        <h2 className="login-header"> Enter OTP to Verify</h2>
    
          <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOTPChange}
          />
          <button type="submit" className="theme-btn mt-3">Verify OTP</button>
          <p>{verificationStatus}</p>
          </form>
        </div>
      </div>
    </div>
  );
}



export default SignupComponent;

