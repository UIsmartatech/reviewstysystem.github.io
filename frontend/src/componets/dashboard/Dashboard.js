import SidebarComponent from "../sidebar/sidebar";
import Dashboards from "../../pages/Dashboards";
import "./dashboard.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardComponent() {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("decode token:", decoded);
    } else {
      console.error("no token found");
    }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setName(decoded.name);
    }

    axios
      .get("http://localhost:8081", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && response.data.token) {
          setData(response.data.token);
        } else {
          setMessage("Unauthorized access");
        }
      })
      .catch((err) => {
        setMessage("Unauthorized access");
      });
  }, []);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = () => {
    
    axios
      .get("http://localhost:8081/profile/image", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        const imageUrl = response.data.imageUrl;
         setProfileImageUrl(imageUrl);
      })
      .catch(error => {
        console.error('Error fetching profile image:', error);
      });
  };

  useEffect(()=>{
    axios.get("http://localhost:8081/preview_user",{
      headers:{
        authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const userdata = response.data;
         console.log("userdata:",userdata);
      })
    })
  
  return (
    <div className="DashboardContainer">
      <div className="sidebar">
        <SidebarComponent />
      </div>
      <div className="mainContent">
        <div className="welcome-section">
          <div className="wecome-text">
            <h5> Hi, {name}</h5>
            <p>Welcome to the dashboard</p>
          </div>
          <div className="profile-part">
            <p> {name}</p>
            <img src={ profileImageUrl } className="responsive-circle" alt="Profile" />
          </div>
        </div>
        <div className="">
          <Dashboards />
        </div>
      </div>
    </div>
  );
}
export default DashboardComponent;
