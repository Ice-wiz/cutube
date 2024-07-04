import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../component/Footer';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/users/register`, {
        firstname,
        lastname,
        email,
        mobile,
      });

      setMessage(`Registration successful! Please check your email (${email}) for login instructions , you can close this page .`); 
      setError('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); 
      } else {
        setError('Registration failed. Please try again.'); 
      }
      setMessage(''); 
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          {message && (
            <p className="text-green-500 mb-4 text-center">{message}</p>
          )}
          {error && (
            <p className="text-red-500 mb-4 text-center">{error}</p>
          )}
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
          <div className="mb-4">
            <label htmlFor="lastname" className="block mb-2 text-sm">Last Name</label>
            <input
              type="text"
              id="lastname"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="mobile" className="block mb-2 text-sm">Mobile</label>
            <input
              type="text"
              id="mobile"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Register
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
