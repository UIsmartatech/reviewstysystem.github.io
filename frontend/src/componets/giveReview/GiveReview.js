import React, { useState, useEffect } from "react";
import SidebarComponent from "../sidebar/sidebar";
import Star from "@mui/icons-material/Star";
import IMAGES from "../../Assets/profile_img/profile_images";
import "./givereview.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ReviewStar from "./reviewStar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";


const GiveReview = () => {
  const [review, setReview] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState({});
  const [message, setMessage] = useState("");
  const [reviewee, setreviewee] = useState("");
  const [comment, setComment] = useState("");
  const [reviewstar, setreviewStar] = useState(0);
  const [messageType, setMessageType] = useState("");
  const [filterName, setfilterName] = useState([]);
  const [reviewDate, setReviewDate] = useState([]);
  const [records, setRecords] = useState([]);
  const [reviewer, setReviewer] = useState("");


  useEffect(() => {
    axios.get("http://localhost:8081/gettotalstar")
    .then((response)=> {
      const token = sessionStorage.getItem("token");
      const decoded = jwtDecode(token);
      const filtertoken = decoded.name;
      setReviewer(filtertoken);
      const allgivenStar = response.data;
      console.log("givenallstar:", allgivenStar)
    })
    .catch((error) => {
      setMessage("Error fetching review user data");
      console.error("Error fetching data:", error);
    });
  })

  useEffect(() => {
    axios
      .get("http://localhost:8081/reviewuser")
      .then((response) => {
        const token = sessionStorage.getItem("token");

        const decoded = jwtDecode(token);
        const filtertoken = decoded.name;
        setReviewer(filtertoken);

        console.log("here is the reviewer:", filtertoken);

        const filteredResult = response.data.filter(
          (r) => r.role !== 0 && r.name !== filtertoken
        );
        setRecords(filteredResult);
        console.log(records);
      })
      .catch((error) => {
        setMessage("Error fetching review user data");
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run once on mount


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

  const criteria = ["Performance", "Ability", "Caring", "Lovely"]; // List of criteria
  const totalStars = Object.values(rating).reduce(
    (total, rating) => total + (rating || 0),
    0
  );
  const handleRatingChange = (criterion, rating) => {
    setRating((prevRatings) => ({
      ...prevRatings,
      [criterion]: rating,
    }));
  };

  const handleRadioChange = (event) => {
    setreviewee(event.target.value);
  };

  const Performance =  Object.values(rating);
  console.log(Performance);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate fields
    if (!reviewee || !totalStars || !comment) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }
    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const decodedname = decoded.name;
      setReviewer(decodedname);
      console.log("here is the reviewer:", decodedname);
    } else {
      console.error("no token found");
    }

    const reviewData = {
      reviewee: reviewee,
      comment: comment,
      totalStars: totalStars,
    };

    axios
      .post("http://localhost:8081/review", reviewData, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })

      .then((response) => {
        setMessage("Review submitted successfully!");
        setMessageType("success");
        // Clear form fields
        setreviewee("");
        setComment("");
        setreviewStar(0);
      })
      .catch((error) => {
        setMessage("You can only review this employee  per month once only.");
        setMessageType("error");
      });
  };

  return (
    <>
      <div className="get-review-container">
        <div className="sidebar">
          <SidebarComponent />
        </div>

        <div className="mainContent">
          <div className="review-section">
            <div className="welcome-section">
              <div className="wecome-text">
                <h5> Please write your review </h5>
              </div>
              <div className="profile-part">
                <div className="profile-part">
                  <p>{name}</p>
                  <img
                    src={profileImageUrl}
                    className="responsive-circle"
                    alt="Profile"
                  />
                </div>
              </div>
            </div>

            <div className="all-card-section">
              <div className="card mb-3 border-0">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="employ-img give_reiview_img">
                      <img
                        src={profileImageUrl}
                        className="img-fluid"
                        alt="..."
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card-body d-flex">
                      <div className="employ-detail-panel text-align-left">
                        <h4>{name} </h4>
                        <p></p>
                        <div className="review-total">
                          {" "}
                          <p>
                            <span className="small"></span>{" "}
                            <Star className="text-yellow-600" />{" "}
                            <span className="small">({45} reviews)</span>
                          </p>
                        
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    {/* <div className="progressbar">
                      <div className="d-flex align-items-center justify-content-center">
                        {" "}
                        <span> 5 Star</span>
                        <ProgressBar variant="warning" now={40} />{" "}
                        <a href="">
                          <span>5 reviews</span>
                        </a>{" "}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="review-form">
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="my-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>
                    You can start rating for <strong>{reviewee}</strong>
                  </Form.Label>
                </Form.Group>
                <InputGroup required>
                  {records.map((r, index) => (
                    <React.Fragment>
                      <InputGroup.Radio
                        name="reviewee"
                        value={r.name}
                        onChange={handleRadioChange}
                      />
                      <ul className="employ-name">
                        <li key={index}>{r.name}</li>
                      </ul>
                    </React.Fragment>
                  ))}
                </InputGroup>
                <Form.Group
                  className="mt-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label> please rate the employee </Form.Label>
                </Form.Group>
                <InputGroup className="m-3">
                  <div className="star-icons-panel d-flex">
                    <div className="star-icons">
                      {criteria.map((criterion) => (
                        <ReviewStar
                          key={criterion}
                          criterion={criterion}
                          onRatingChange={handleRatingChange}
                        />
                      ))}
                    </div>
                    <div className="criteria">
                      {criteria.map((criterion) => (
                        <p key={criterion}>{criterion}</p>
                      ))}
                    </div>
                    <input
                      name="totalStar"
                      className="d-none"
                      value={totalStars}
                      onChange={(e) => setreviewStar(e.target.value)}
                      required
                    />
                  </div>
                </InputGroup>
                <Form.Group
                  className="mt-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>
                    please write your Opinion about the employee{" "}
                  </Form.Label>
                </Form.Group>
                <FloatingLabel
                  controlId="floatingTextarea2"
                  label="Leave a comment here"
                  className="comment mt-3"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: "100px" }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </FloatingLabel>
                <Button
                  as="input"
                  type="submit"
                  value="Sumbit"
                  className="my-3"
                />{" "}
                {message && (
                  <p
                    style={{
                      color: messageType === "success" ? "green" : "red",
                    }}
                  >
                    {message}
                  </p>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GiveReview;
