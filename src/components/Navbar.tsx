import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/agencies"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Agencies
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
