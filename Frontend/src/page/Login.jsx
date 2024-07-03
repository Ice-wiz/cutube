import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import axios from 'axios';

const Login = () => {
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/api/users/login`, {
        firstname,
        password,
      });

      if (!response.data.token) {
        throw new Error('Token not found in response');
      }

      localStorage.setItem('token', response.data.token); 
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <div className="mb-4">
            <label htmlFor="firstname" className="block mb-2 text-sm">First Name</label>
            <input
              type="text"
              id="firstname"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Login
          </button>
          <p className="mt-4 text-sm text-center">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:underline">
              Sign up here
            </a>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
