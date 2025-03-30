import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateForm = () => {
        if (!formData.name.trim()) return setError("Please enter your name"), false;
        if (!formData.email.trim()) return setError("Please enter your email"), false;
        if (!formData.password) return setError("Please enter a password"), false;
        if (formData.password.length < 8) return setError("Password must be at least 8 characters"), false;
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match"), false;
        if (passwordStrength < 2) return setError("Please choose a stronger password"), false;
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
        setSuccess("");

        if (name === "password") {
            const result = zxcvbn(value);
            setPasswordStrength(result.score);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // Get existing users
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Check if email already exists
            if (registeredUsers.some(user => user.email === formData.email)) {
                throw new Error('Email already registered');
            }
            
            // Create new user
            const newUser = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                createdAt: new Date().toISOString()
            };
            
            // Add to registered users
            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            setSuccess("Account created successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-blue-500/10 to-black opacity-50 blur-3xl"></div>

            <div className="relative w-full max-w-md bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-500/20 p-6">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-orange-500 drop-shadow-md">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join us and start your journey</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300"></label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300"></label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300"></label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Create a password"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300"> </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your password"
                                required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-orange-500 hover:text-orange-400">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
