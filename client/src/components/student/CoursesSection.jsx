import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Sample features data to fill the space
  const features = [
    { icon: '🎯', title: 'Project-Based', desc: 'Hands-on learning' },
    { icon: '📚', title: 'Resources', desc: 'Downloadable materials' },
    { icon: '💬', title: 'Community', desc: 'Peer support' },
    { icon: '🏆', title: 'Certification', desc: 'Industry recognized' }
  ];

  const stats = [
    { number: '98%', label: 'Completion Rate' },
    { number: '24/7', label: 'Mentor Support' },
    { number: '50+', label: 'Real Projects' },
    { number: '1-on-1', label: 'Code Reviews' }
  ];

  return (
    <motion.div 
      className="relative w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      
      {/* Professional Background Pattern - Matching Hero */}
      <div className="absolute inset-0">
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                              linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Animated Gradient Orbs - Matching Hero */}
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

        {/* Floating Elements - Matching Hero */}
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Instructor Photo on LEFT */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-16">
          {/* Instructor Photo - LEFT Side */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1"
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Main Instructor Photo - Made larger */}
              <motion.div
                className="relative w-96 h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="/Instructor.png" // Replace with your actual photo path
                  alt="Lead Instructor"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                
                {/* Instructor Info Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-white font-bold text-xl mb-1">Raj Chaturvedi</h3>
                    <p className="text-cyan-300 text-sm mb-2">Senior Full-Stack Developer</p>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>⭐ 4.9 Rating</span>
                      <span>•</span>
                      <span>👨‍🎓 10K+ Students</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Elements Around Photo */}
              <motion.div
                className="absolute -top-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-4 shadow-2xl"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-xs">Years Experience</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 shadow-2xl"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-xs">Courses</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content - RIGHT Side */}
          <motion.div
            className="flex-1 order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-white font-medium">Premium Learning Experience</span>
              </motion.div>

              {/* Main Heading */}
              <div>
                <motion.h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-left"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Learn from{' '}
                  <motion.span 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent block"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Industry Experts
                  </motion.span>
                </motion.h2>

                <motion.p 
                  className="text-xl text-gray-300 leading-relaxed text-left max-w-2xl"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  Join thousands of students who have transformed their careers with our expert-led courses. 
                  Get real-world experience and build projects that matter.
                </motion.p>
              </div>

              {/* Features Grid */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                viewport={{ once: true }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="text-2xl">{feature.icon}</div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">{feature.title}</div>
                      <div className="text-cyan-400 text-xs">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap gap-6 pt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                viewport={{ once: true }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-2xl font-bold text-cyan-400">{stat.number}</div>
                    <div className="text-gray-400 text-sm whitespace-nowrap">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden text-lg w-full sm:w-auto"
                  whileHover={{ 
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Start Learning Today
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Courses Grid - IMPROVED SECTION */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Courses</span>
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hand-picked courses to kickstart your development journey
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {allCourses.slice(0, 8).map((course, index) => (
            <motion.div
              key={course.id || index}
              variants={itemVariants}
              className="flex"
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Courses Button */}
        {allCourses.length > 8 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/course-list">
              <motion.button
                className="group relative bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View All Courses
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CoursesSection;