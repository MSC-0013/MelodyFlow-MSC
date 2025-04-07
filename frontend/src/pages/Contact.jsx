import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaUser className="text-2xl" />,
      title: "Name",
      value: "Soumyashree Rout",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
      value: "soumayshreerout99@gmail.com",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone",
      value: "+91 93480121930",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400">
            Get in touch with us for any queries or support
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-400 group-hover:text-white transition-colors duration-300">
                  {info.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">
            We'll get back to you as soon as possible
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="mailto:soumayshreerout99@gmail.com"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30"
            >
              Send Email
            </a>
            <a 
              href="tel:+9193480121930"
              className="px-6 py-3 bg-white/10 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 