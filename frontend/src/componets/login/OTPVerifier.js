import React, { useState } from 'react';
import SmartatechLogo from '../../Assets/profile_img/smartatechlogo.png'
function OTPVerifier({ email }) {
  const [otp, setOTP] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const OTPVerifier = () => {
    // Assuming you have an API endpoint to verify OTP
    fetch('http://localhost/review_system/backend/src/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: new URLSearchParams({
        email: email,otp
        
      })
    })
      .then(response => {
        // Handle response
        if (response.ok) {
          setVerificationStatus('OTP verified successfully!');
         
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
      <img src={SmartatechLogo} alt="Example" />
      <div className="login">
      <form onSubmit={OTPVerifier}>

        <h2>Enter OTP to Verify</h2>
        <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOTPChange}
        />
        <button type="submit">Verify OTP</button>
        <p>{verificationStatus}</p>
        </form>
      </div>
    </div>
</div>
  );
}

export default OTPVerifier;