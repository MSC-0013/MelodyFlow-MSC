import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpotify, FaMusic, FaHeadphones, FaHeart, FaRandom, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaSearch, FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const features = [
    {
      icon: <FaMusic className="text-4xl" />,
      title: "Unlimited Music",
      description: "Access millions of songs from various artists and genres.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaHeadphones className="text-4xl" />,
      title: "High Quality Audio",
      description: "Experience crystal clear sound with our premium audio quality.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaHeart className="text-4xl" />,
      title: "Personalized Playlists",
      description: "Create and share your favorite playlists with friends.",
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        
        {/* Animated Music Visualizer */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              style={{
                left: `${i * 5}%`,
                bottom: '0',
                width: '2px',
                height: `${Math.random() * 100}px`,
              }}
              animate={{
                height: [null, `${Math.random() * 150}px`, `${Math.random() * 100}px`],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            MelodyFlow
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Experience music like never before. Stream your favorite tracks, create playlists, and discover new artists.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/login"
              className="group px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/contact"
              className="group px-8 py-3 bg-white/10 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Contact
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Why Choose MelodyFlow?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Experience the Player
          </motion.h2>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <FaMusic className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Sample Track</h3>
                <p className="text-gray-400">Artist Name</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  animate={{
                    width: isPlaying ? ['0%', '100%'] : '0%',
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${volume * 100}%` }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 100 }}
                        onDragEnd={(_, info) => {
                          const newVolume = Math.max(0, Math.min(1, info.point.x / 100));
                          setVolume(newVolume);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <FaRandom />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your account and connect with Spotify",
                icon: <FaUser className="text-2xl" />
              },
              {
                step: "2",
                title: "Explore",
                description: "Discover new music and create playlists",
                icon: <FaSearch className="text-2xl" />
              },
              {
                step: "3",
                title: "Enjoy",
                description: "Stream your favorite tracks anytime, anywhere",
                icon: <FaHeadphones className="text-2xl" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg group hover:bg-white/10 transition-all duration-300"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <div className="text-purple-500 mb-4 group-hover:text-blue-500 transition-colors duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-3xl p-12 backdrop-blur-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
              <p className="text-xl text-gray-300 mb-8">Join millions of music lovers and experience the best streaming platform.</p>
              <Link 
                to="/login"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30"
              >
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <FaMusic className="text-purple-500" />
            <span className="font-bold">MelodyFlow</span>
          </div>
          <div className="flex gap-6">
            {['About', 'Features', 'Contact'].map((item, index) => (
              <motion.a
                key={index}
                href={item === 'Contact' ? '/contact' : '#'}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 