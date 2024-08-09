import React, { useEffect, useState } from "react";
import axios from 'axios';
import './user_details.css'
import EditIcon from '@mui/icons-material/Edit';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';


function UserDetails() {
  const[records, setRecords]= useState('');
  const[message, setMessage]= useState();

  useEffect(() => {
    axios.get('http://localhost:8081/preview_user')
    .then(response => {
      console.log('Response data:', response.data);
      // Filter data where status is not zero
      if (Array.isArray(response.data)) {
        // Filter data where status is not zero
        const filteredResult = response.data.filter(record => record.status !== 0);
        setRecords(filteredResult);
      } else {
        console.error('Response data is not an array:', response.data);
      }
    })
    .catch(error => {
      setMessage(error);
      console.error('Error fetching data:', error);
    });
}, []);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Converts to local date and time string
};
  return (
    <div>
      <table className="table table-responsive userdetails">
        <thead>
          <tr>
            <th scope="col">Serial no</th>
            <th scope="col">Reviewee</th>
            <th scope="col">Reviewer</th>
            <th scope="col">Comments</th>
            <th scope="col">Reivews</th>
            <th scope="col">Date/Time</th>
            <th scope="col">Action</th>

          </tr>
        </thead>
        <tbody>
        {Array.isArray(records) && records.length > 0 ? (
            records.map(record => (
              <tr key={record.id}>
                <td>{record.Employ_id}</td>
                <td>{record.reviewee}</td>
                <td>{record.reviewer}</td>
                <td>{record.comment}</td>
                <td>{record.reviewstar}</td>
                <td>{formatDate (record.review_date)}</td>
                <td>
                <ButtonGroup aria-label="Basic example">
                  <Button variant="secondary" title="edit"> <EditIcon/></Button>
                  <Button variant="secondary" title="hide"><VisibilityIcon/></Button>
                  <Button variant="secondary" title="Delete"><DeleteIcon/></Button>
                </ButtonGroup>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No records available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default UserDetails;
