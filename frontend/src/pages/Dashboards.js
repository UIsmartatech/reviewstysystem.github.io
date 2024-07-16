import React, { useState, useEffect } from "react";
import "../componets/dashboard/dashboard.css";
import EmployCard from "../componets/dashboard/EmployCard";
import IMAGES from "../Assets/profile_img/profile_images";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function Dashboards() {

  const [users, setUsers] = useState([""]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const token = sessionStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    console.log("decode token:", decoded);
  } else {
    console.error("no token found");
  }
  useEffect(() => {
    axios
      .get("http://localhost:8081/preview_user", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userdata = response.data;
        const image = response.data.imageUrl;
        setProfileImageUrl(image);
        setUsers(userdata);
        console.log(users);
      });
    }, []);

  const showUsers = true;
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
      .then((response) => {})
      .catch((error) => {
        console.error("Error fetching profile image:", error);
      });
  };
  return (
    <div className="all-member-section">
      {showUsers ? (
        <>
          <div className="container-fluid">
            <div className="row">
              {users.map((user) => {
                return (
                  <EmployCard
                    key={user.user_Id}
                    name={user.username}
                    designation={user.designation}
                    mobile={user.mobile_no}
                    img={user.image}
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <p> you can not see the employ </p>
      )}
    </div>
  );
}
export default Dashboards;
