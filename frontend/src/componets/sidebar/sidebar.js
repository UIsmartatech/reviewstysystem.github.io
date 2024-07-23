import React from "react";
import * as Icons from "@mui/icons-material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { NavLink } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SmartatechLogo from "../../Assets/profile_img/smartatechlogo.png";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";

const SidebarComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebarContainer">
      <div className="logo-part">
        <img src={SmartatechLogo} alt="logo" className="img-fluid" />
        <div className="employ-details mt-2 pl-0">
          <p>Subsidiary of Smarta Industrial</p>
        </div>
      </div>

      <div className="sidenav">
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Icons.Dashboard /><span> Dashboard</span>
          </NavLink>
          <NavLink to="/giveReview">
            <RateReviewIcon /><span> Give your review</span>
          </NavLink>
          <NavLink to="/profileSetting">
            <Icons.Settings /><span> Personal profile</span>
          </NavLink>

          <NavLink to="/login" className="logo-part" onClick={handleLogout}>
            <Icons.Logout /> <span>Logout</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
export default SidebarComponent;
