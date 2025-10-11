import React, { useRef } from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';
import { motion, useInView } from 'framer-motion';

const Hero = () => {
  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: true, threshold: 0.3 });

  return (
    <div className="relative w-full min-h-[80vh] bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                              linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Content - Text & CTA */}
          <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">Learn from Industry Experts</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Advance Your 
                <motion.span 
                  className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Career Skills
                </motion.span>
                With Professional Courses
              </h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Master in-demand skills with our comprehensive learning platform. 
                <span className="text-cyan-300 font-semibold"> 98% career success rate.</span>
              </motion.p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="max-w-2xl w-full mx-auto lg:mx-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
                <SearchBar />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Courses
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                className="group relative bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10"
            >
              {[
                { number: '10K+', label: 'Students Enrolled' },
                { number: '500+', label: 'Expert Courses' },
                { number: '98%', label: 'Success Rate' },
                { number: '24/7', label: 'Live Support' }
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400">{stat.number}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Image */}
          <motion.div
            ref={imageRef}
            className="flex-1 flex justify-center lg:justify-end w-full max-w-2xl"
            initial={{ opacity: 0, x: 40 }}
            animate={isImageInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative">
              {/* Main Image Container */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/5 bg-gradient-to-br from-slate-800 to-slate-900"
                initial={{ scale: 0.9, rotateY: 15 }}
                animate={isImageInView ? { scale: 1, rotateY: 0 } : { scale: 0.9, rotateY: 15 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.7,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <img
                  src="/Photo1.png"
                  alt="Professional LMS Learning Platform"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-cyan-500/10" />

                {/* Floating Cards */}
                <motion.div
                  className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20"
                  initial={{ scale: 0, x: -20 }}
                  animate={isImageInView ? { scale: 1, x: 0 } : { scale: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Certificate</div>
                      <div className="text-sm text-gray-600">Ready to claim</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 shadow-2xl"
                  initial={{ scale: 0, y: 20 }}
                  animate={isImageInView ? { scale: 1, y: 0 } : { scale: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="text-sm font-semibold">Live Now</div>
                  <div className="text-xs opacity-90">Web Development</div>
                </motion.div>
              </motion.div>

              {/* Floating Achievement Badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20"
                initial={{ scale: 0, rotate: -10 }}
                animate={isImageInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Top Rated</div>
                    <div className="text-sm text-gray-600">By 2K+ students</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="flex flex-col items-center text-cyan-300 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-sm font-medium mb-2">Explore Courses</span>
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;