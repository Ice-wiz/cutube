import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    onLogout(); // Notifying App component to update isAuthenticated state
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white py-4 border-b border-stone-600">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Cutube</div>
        <div className="hidden md:flex space-x-6">
          {isAuthenticated ? (
            <>
              <Link to='/profile' className='hover:text-gray-400'>{user ? user.firstname : 'Profile'}</Link>
              <Link to="/listing" className="hover:text-gray-400">Listing Page</Link>
              <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-400">Login</Link>
              <Link to="/register" className="hover:text-gray-400">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
