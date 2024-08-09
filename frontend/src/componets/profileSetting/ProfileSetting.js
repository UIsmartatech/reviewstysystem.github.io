import React, { useRef, useState, useEffect } from "react";
import SidebarComponent from "../sidebar/sidebar";
import Card from "react-bootstrap/Card";
import * as Icons from "@mui/icons-material";
import IMAGES from "../../Assets/profile_img/profile_images";
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
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

  const handleFileUpload = () => {
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
      .post("http://localhost:8081/upload", formData, {
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
      .post("http://localhost:8081/personal-profile-insert", profileData)
      .then((res) => {
        if (res.data.Status === "success") {
          console.log("succeed");
          setMessage("successfull attempt");
        } else {
          console.log("failed");
          setMessage("unsuccessfull attempt");
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
      .get("http://localhost:8081/profile/image", {
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
  

  return (
    <>
      <div className="DashboardContainer">
        <div className="sidebar">
          <SidebarComponent />
        </div>
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
                </div>
                <div className="button-group">
                  <Button
                    as="input"
                    type="button"
                    value="update profile"
                    className="mt-1 d-block"
                    onClick={handleFileUpload}
                  />
                  {message && <p>{message}</p>}
                </div>
              </div>
              <Form className="profile-container">
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formMobile">
                  <Form.Label>Your Mobile no.</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    placeholder="+91 0000 00 0000"
                    value={mobile}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDesignation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    placeholder="Please enter designation"
                    value={designation}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formJoinDate">
                  <Form.Label>Join date</Form.Label>
                  <Form.Control
                    type="date"
                    name="joinDate"
                    value={joinDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <div className="button-group">
                  <Button
                    as="input"
                    type="button"
                    value="Update Details"
                    className="mt-2 d-block"
                    onClick={handleProfile}
                  />
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProfileSetting;
