import React, { useEffect, useState } from "react";
import "./login.css";
import SmartatechLogo from "../../Assets/profile_img/smartatechlogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const LoginComponent = () => {
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');

  const sendotp = (event) => {
    event.preventDefault();
    axios
      .post("http://192.168.1.133/send-otp", { email })
      .then((response) => {
        if (response.status === 200) {
          setOtpSent(true);
          setMessage("OTP sent to your email");
        }
      })
      .catch((error) => {
        setMessage("Email is not Register with us");
        {
          message && <p className="color-danger">{message}</p>;
        }
      });
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://192.168.1.133/verify-otp", {
        email,
        otp,
      });
      console.log("Response:", response); // Add this log to debug

      if (response.data && response.data.jwttoken) {
        console.log("OTP verified, navigating to dashboard");
        // localStorage.setItem('token', response.data.jwttoken);
        const token = response.data.jwttoken;
        const decoded = jwtDecode(token);
        sessionStorage.setItem("token",token); // Store the token in sessionStorage
        setRole(decoded.role);
        if (decoded.role === 1) {
          navigate('/');
      } else if (decoded.role === 0) {
          navigate('/admin');
      }
  
      } else {
        setMessage("Verification failed: Token not found in response");
        console.error("Token not found in response");
      }
    } catch (err) {
      setMessage("Error verifying OTP");
      console.error("Error verifying OTP:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="loginContainer">
        <img src={SmartatechLogo} alt="Example" />
        <div className="login">
          {!otpSent ? (
            <form onSubmit={sendotp}>
              <h2 className="login-header"> Please login here</h2>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="theme-btn mt-3">
                  Request OTP
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <h2 className="login-header"> Please enter the Otp</h2>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
              <button type="submit" className="theme-btn mt-3">
                Submit OTP
              </button>
            </form>
          )}
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
