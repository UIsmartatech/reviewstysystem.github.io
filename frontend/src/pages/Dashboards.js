import React, { useState, useEffect } from "react";
import "../componets/dashboard/dashboard.css";
import EmployCard from "../componets/dashboard/EmployCard";
import IMAGES from "../Assets/profile_img/profile_images";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function Dashboards() {
  const [users, setUsers] = useState([]);
  const [loginUser, setLoginUser] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("decode token:", decoded);
        setLoginUser(decoded.name); // Assuming 'name' is the username in the token
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.error("No token found");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://192.168.1.133:3000/employcards", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      fetchProfileImage();
    }
  }, [token]);

  const fetchProfileImage = () => {
    axios
      .get("http://192.168.1.133:3000/profile/image", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfileImageUrl(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile image:", error);
      });
  };

  const showUsers = true;

  return (
    <div className="all-member-section">
      {showUsers ? (
        <div className="container-fluid">
          <div className="row">
            {users.map((user) => {
              // Check if the current user's username matches the logged-in user's username
              if (user.username !== loginUser) {
                return (
                  <EmployCard
                    key={user.user_Id}
                    name={user.username}
                    designation={user.designation}
                    mobile={user.mobile_no}
                    img={user.image}
                  />
                );
              }
              // Return null or nothing if the current user is the logged-in user
              return null;
            })}
          </div>
        </div>
      ) : (
        <p>You cannot see the employees</p>
      )}
    </div>
  );
}

export default Dashboards;
