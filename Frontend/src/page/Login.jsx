import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = ({ onLogin }) => {
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to hold error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before making request

    try {
      const response = await axios.post(`${backendUrl}/api/users/login`, {
        firstname,
        password,
      });

      if (!response.data.token) {
        throw new Error('Token not found in response');
      }

      localStorage.setItem('token', response.data.token);
       onLogin();
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          {error && (
            <div className="mb-4 p-2 bg-red-600 text-white rounded-md">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="firstname" className="block mb-2 text-sm">Email</label>
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

















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../component/Navbar';
// import Footer from '../component/Footer';
// import axios from 'axios';
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const Login = ({onLogin}) => {
//   const [firstname, setFirstname] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();


//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`${backendUrl}/api/users/login`, {
//         firstname,
//         password,
//       });

//       if (!response.data.token) {
//         throw new Error('Token not found in response');
//       }

//       localStorage.setItem('token', response.data.token);
//       onLogin(); 
//       navigate('/profile');
//     } catch (error) {
//       console.error('Login error:', error);

//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-black text-white">
//       <main className="flex-grow flex flex-col items-center justify-center px-4">
//         <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold mb-6">Login</h2>
//           <div className="mb-4">
//             <label htmlFor="firstname" className="block mb-2 text-sm">First Name</label>
//             <input
//               type="text"
//               id="firstname"
//               className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
//               value={firstname}
//               onChange={(e) => setFirstname(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block mb-2 text-sm">Password</label>
//             <input
//               type="password"
//               id="password"
//               className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
//           >
//             Login
//           </button>
//           <p className="mt-4 text-sm text-center">
//             Don't have an account?{' '}
//             <a href="/register" className="text-blue-400 hover:underline">
//               Sign up here
//             </a>
//           </p>
//         </form>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Login;
