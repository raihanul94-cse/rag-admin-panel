import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { admin } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome to the Admin Panel</h1>
            <p className="mt-2 text-gray-600">Logged in as: {admin?.emailAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
