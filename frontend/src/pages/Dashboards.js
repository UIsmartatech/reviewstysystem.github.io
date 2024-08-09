import React, { useState } from 'react';
import '../componets/dashboard/dashboard.css';
import EmployCard from "../componets/dashboard/EmployCard";
import IMAGES from '../Assets/profile_img/profile_images';



function Dashboards() { 
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Rajesh",
      designation: "Backend developer",
      img: IMAGES.RajeshImg,
    },
    {
      id: 2,
      name: "Nagababu",
      designation: "Frontend developer",
      img: IMAGES.NagababuImg,
    },
    {
      id: 3,
      name: "Pooja",
      designation: "Backend developer",
      img: IMAGES.PoojaImg,
    },
    {
      id: 4,
      name: "Vishal",
      designation: "Frontend developer",
      img: IMAGES.VishalImg,
    },
    {
      id: 5,
      name: "Shubhi",
      designation: "UI developer",
      img: IMAGES.ShubhiImg,
    },
    {
      id: 6,
      name: "Vidhya",
      designation: "Data Entry Operator",
      img: IMAGES.VidhyaImg,
    },
    {
      id: 7,
      name: "Priyanka",
      designation: "Data engineer",
      img: IMAGES.PriyankaImg,
    },
    {
      id: 8,
      name: "Jebha",
      designation: "Data engineer",
      img: IMAGES.JebhaImg,
    },
    {
      id: 9,
      name: "Priyanka",
      designation: "Data Entry Operator",
      img: IMAGES.VidhyaImg,
    },
  ]);

  const showEmployees = true;
  return (
    <div className="all-member-section">
      {showEmployees ? (
        <>
         <div className="container-fluid">
             

           <div className="row">
            {employees.map((employee) => {
             
              return (
               
                <EmployCard
                  key={employee.id}
                  name={employee.name}
                  designation={employee.designation}
                  img={employee.img}
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