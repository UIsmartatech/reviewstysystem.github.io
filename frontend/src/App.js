
import './App.css';
import React, { useEffect } from 'react';
import LoginComponent from './componets/login/LoginComponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardComponent from "./componets/dashboard/Dashboard";
import Dashboards from "./pages/Dashboards";
import GiveReview from './componets/giveReview/GiveReview';
import ProfileSetting from './componets/profileSetting/ProfileSetting';
import SignupComponent from './componets/login/SignupComponent';
import verifyOTP from './componets/login/OTPVerifier';
import AdminComponent from './componets/admin/AdminComponent';
import UserDetails from './componets/admin/UserDetails';
 import AuthRoute from './componets/AuthRoute';
 import Layout from './Layout.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
 
  return (
    <>
     <Router>
      <Routes>
        {/* Separate Login Route */}
        <Route path="/login" element={<LoginComponent />} key="login" />

        {/* Authenticated Routes */}
        <Route path="/" element={<AuthRoute><Layout /></AuthRoute>} key="dashboards">
                <Route index element={<DashboardComponent />} />
                <Route path="GiveReview/*" element={<GiveReview />} />
                <Route path="ProfileSetting/*" element={<ProfileSetting />} />
                <Route path="admin*" element={<AdminComponent />} />
        </Route>
      </Routes>
     </Router>

    </>
  );
}
export default App;
