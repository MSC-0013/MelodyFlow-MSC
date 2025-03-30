import React, { useState } from "react";
import { FaUser, FaEnvelope, FaGoogle, FaGithub, FaTwitter, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get all registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find user with matching email and password
      const user = registeredUsers.find(u => u.email === formData.email && u.password === formData.password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Set current user and token
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'dummy-auth-token');
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/music'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-blue-500/10 to-black opacity-50 blur-3xl"></div>

      <div className="relative w-full max-w-md bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-500/20 p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-orange-500 drop-shadow-md">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to continue</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 bg-black/50 border border-orange-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
              placeholder="Enter your password"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg shadow-lg hover:shadow-orange-400/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex justify-center space-x-4">
          <button className="p-3 bg-black/50 border border-orange-500/20 rounded-full hover:bg-orange-500/20 transition">
            <FaGoogle className="text-red-500" />
          </button>
          <button className="p-3 bg-black/50 border border-orange-500/20 rounded-full hover:bg-orange-500/20 transition">
            <FaGithub className="text-gray-300" />
          </button>
          <button className="p-3 bg-black/50 border border-orange-500/20 rounded-full hover:bg-orange-500/20 transition">
            <FaTwitter className="text-blue-400" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 hover:text-orange-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
