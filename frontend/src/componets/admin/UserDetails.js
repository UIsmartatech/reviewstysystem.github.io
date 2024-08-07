import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user_details.css";
import { Form, FormControl } from 'react-bootstrap';

function UserDetails() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8081/preview_user", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRecords(response.data);
        } else {
          console.error("Response data is not an array:", response.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.error("Error fetching data:", error);
      });
  }, [token]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Converts to local date and time string
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredRecords = records.filter((record) =>
    record.reviewee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid ">
      <Form className="mb-4">
        <h4>Please search by name</h4>
        <FormControl
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by reviewee"
          className="mr-sm-2 mb-2"
        />
      </Form>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      <table className="table table-responsive userdetails">
        <thead>
          <tr>
            <th scope="col">Serial no</th>
            <th scope="col">Reviewee</th>
            <th scope="col">Reviewer</th>
            <th scope="col">Punctuality</th>
            <th scope="col">Proactive</th>
            <th scope="col">Support</th>
            <th scope="col">Performance</th>
            <th scope="col">Comments</th>
            <th scope="col">Total Star</th>
            <th scope="col">Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredRecords) && filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.reviewee}</td>
                <td>{record.reviewer}</td>
                <td>{record.punctuality}</td>
                <td>{record.proactive}</td>
                <td>{record.pr_support}</td>
                <td>{record.performance}</td>
                <td>{record.comment}</td>
                <td>{record.reviewstar}</td>
                <td>{formatDate(record.review_date)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserDetails;
