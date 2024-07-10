import React, { useEffect, useState } from "react";
import SidebarComponent from "../sidebar/sidebar";
import * as Icons from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UserDetails from "./UserDetails";

function AdminComponent() {
  const [name, setName] = useState("");
  const [data, setData] = useState();
  const [message, setMessage] = useState();

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
  return (
    <>
      <div className="get-review-container">
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
              {/* <img src= {ChethanImg} alt="Example" /> */}
            </div>
          </div>
          <div className="userdetails-Section">
            <UserDetails />
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminComponent;
