import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './component/Navbar';
import Login from './page/Login';
import Register from './page/Register';
import Profile from './page/Profile';
import ListingPage from './page/ListingPage';
import UserProfile from './page/UserProfile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      getUserDetails(); // Call function to fetch user details if logged in
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUser(response.data); 
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data || error.message);

    }
  };

  return (
    <Router>
      <Navbar isAuthenticated={isLoggedIn} onLogout={handleLogout} />
      <Routes>
     
        <Route path="/" element={isLoggedIn ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/profile" /> : <Register />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/listing" element={<ListingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
