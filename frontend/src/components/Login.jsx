import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... existing login logic ...
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <FaMusic className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">MelodyFlow</h1>
          </div>
          <h2 className="text-xl text-gray-300">Welcome back</h2>
        </div>
        
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... rest of the form ... */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 