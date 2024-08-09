import React, { useRef, useState, useEffect } from "react";
import SidebarComponent from "../sidebar/sidebar";
import Card from "react-bootstrap/Card";
import "./profileSetting.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

function ProfileSetting() {
  const [Image, setImage] = useState("");
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([""]);
  const token = sessionStorage.getItem("token");

  const handleInputChange = (event) => {
    
    const { name, value } = event.target;
    if (name === "username") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "mobile") {
      setMobile(value);
    } else if (name === "designation") {
      setDesignation(value);
    } else if (name === "joinDate") {
      setJoinDate(value);
    }
  };

  const handleImgClick = () => inputRef.current.click();
  const handleImgChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setImage(event.target.files[0]);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("decode token:", decoded);
    } else {
      console.error("no token found");
    }
    const formData = new FormData();
    formData.append("image", Image);

    axios
      .post("http://192.168.1.133:3000/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('succeeded');
          setMessage('profile is successfully updated ! please refresh the page');
        } else {
          console.log('failed');
          setMessage('unsuccessful attempt');
        }
      })
      .catch((error) => {
        console.log('failed', error);
        setMessage('unsuccessful attempt');
      });
      
  };

  const handleProfile = (event) => {
    event.preventDefault();
    const profileData = { name, email, mobile, designation, joinDate };
    axios
      .post("http://192.168.1.133:3000/personal-profile-insert", profileData)
      .then((res) => {
        if (res.data.Status === "success") {
          setMessage(`Profile added successfully`);
          setMessage("successfull attempt");
        } else {
          console.log("failed");
          setMessage("unsuccessfull attempt");
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 409) {
          setMessage('Profile already exists');
        } else {
          setMessage('Error adding profile');
        }
      });
  };
  useEffect(() => {
    fetchProfileImage();
  }, []);


  const fetchProfileImage = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setName(decoded.name);
    } else {
      console.error("no token found");
    }
    axios
      .get("http://192.168.1.133:3000/profile/image", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        setProfileImageUrl(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching profile image:", error);
      });
  };
  useEffect(() => {
    axios
      .get("http://192.168.1.133:3000/profilepagedata", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userdata = response.data;
        setUsers(userdata);
        console.log(userdata);
      });
    }, []);

  return (
    <>
      <div className="DashboardContainer">
        <div className="sidebar">
          <SidebarComponent />
        </div>
        {users && (
        <div className="mainContent">
          <div className="welcome-section">
            <div className="wecome-text">
              <h5> Edit your profile details </h5>
            </div>
            <div className="profile-part">
              <p>{name}</p>
              <img
                src={profileImageUrl}
                className="responsive-circle"
                alt="Profile"
              />
            </div>
          </div>
          <div className=" employ-detail-panel">
          {users.map((user) => (
            <Card>
              <div className="profile-upload-panel">
                <div className="employ-img-edit" onClick={handleImgClick}>
                  <div className="profileSection">
                    {Image ? (
                      <img
                        src={profileImageUrl}
                        className="responsive-circle"
                        alt="Profile"
                      />
                    ) : (
                      <img
                        src={profileImageUrl}
                        className="responsive-circle"
                        alt="Profile"
                      />
                    )}
                    <ModeEditIcon />
                    <input
                      type="file"
                      ref={inputRef}
                      onChange={handleImgChange}
                      className="d-none"
                    />
                  </div>
                  <div className="button-group">
                  <Button
                    as="input"
                    type="button"
                    value="update profile"
                    className="mt-1 d-block btn-theme"
                    onClick={handleFileUpload}
                  />
                  {message && <p>{message}</p>}
                </div>
                </div>

              </div>
              <Form className="profile-container">
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Your full name"
                    value={user.username}
                    onChange={handleInputChange} disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formMobile">
                  <Form.Label>Your Mobile no.</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    placeholder="+91 0000 00 0000"
                    value={user.mobile_no}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDesignation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    placeholder="Please enter designation"
                    value={user.designation}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
                 <Form.Group className="mb-3" controlId="formJoinDate">
                  <Form.Label>Join date</Form.Label>
                  <Form.Control
                    type="text"
                    name="joinDate"
                    value={user.join_date}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
                <div className="button-group btn-theme">
                  {/* <Button
                    as="input"
                    type="button"
                    value="Update Details"
                    className="mt-2 .button-group btn-theme d-block"
                    onClick={handleProfile}
                  /> */}
                </div>
              </Form>
              {message && <p>{message}</p>}
            </Card>
           ))}
          </div>
        </div>
        )}
      </div>
    </>
  );
}
export default ProfileSetting;
