import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Notifying App component to update isAuthenticated state
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white py-4 border-b border-stone-600">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Cutube</div>
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className={`md:flex space-x-6 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-gray-400">
                {user ? user.firstname : 'Profile'}
              </Link>
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
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 mt-4">
            {isAuthenticated ? (
              <>
{/*                 <Link to="/profile" className="hover:text-gray-400" onClick={toggleMobileMenu}>
                  {user ? user.firstname : 'Profile'}
                </Link>
                <Link to="/listing" className="hover:text-gray-400" onClick={toggleMobileMenu}>
                  Listing Page
                </Link>
                <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="hover:text-gray-400">
                  Logout
                </button> */}
              </>
            ) : (
              <>
{/*                 <Link to="/login" className="hover:text-gray-400" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className="hover:text-gray-400" onClick={toggleMobileMenu}>Register</Link> */}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

















// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = ({ isAuthenticated, onLogout, user }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     onLogout(); // Notifying App component to update isAuthenticated state
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-gray-900 text-white py-4 border-b border-stone-600">
//       <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">Cutube</div>
//         <div className="hidden md:flex space-x-6">
//           {isAuthenticated ? (
//             <>
//               <Link to="/profile" className="hover:text-gray-400">{user ? user.firstname : 'Profile'}</Link>
//               <Link to="/listing" className="hover:text-gray-400">Listing Page</Link>
//               <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-gray-400">Login</Link>
//               <Link to="/register" className="hover:text-gray-400">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
