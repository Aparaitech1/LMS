import React, { useRef } from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';
import { motion, useInView } from 'framer-motion';

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Unified left entrance animation for all elements
  const slideFromLeft = {
    hidden: { 
      opacity: 0, 
      x: -80,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Staggered left entrance for cards
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -60,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      className="relative w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden py-16"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
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
        {/* Clean Header Section - All from left */}
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
        >
          {/* Simple Badge - Comes from left */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 mb-6"
            variants={slideFromLeft}
          >
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white text-sm font-medium">Success Stories</span>
          </motion.div>

          {/* Heading - All from left */}
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            variants={slideFromLeft}
          >
            What Our{' '}
            <span className="text-cyan-400">Students</span>
            {' '}Say
          </motion.h2>

          {/* Subtitle - Comes from left */}
          <motion.p 
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            variants={slideFromLeft}
          >
            Real stories from learners who transformed their careers through our courses
          </motion.p>
        </motion.div>

        {/* Clean Testimonials Grid - All cards from left with staggered delay */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {dummyTestimonial.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group"
              whileHover={{
                y: -5,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Clean Testimonial Card */}
              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/20 transition-all duration-300 h-full flex flex-col">
                
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-cyan-400/30">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h3 
                      className="text-lg font-semibold text-white truncate"
                      whileHover={{ color: "#f0f9ff" }}
                      transition={{ duration: 0.2 }}
                    >
                      {testimonial.name}
                    </motion.h3>
                    <p className="text-cyan-300 text-sm truncate">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <motion.div 
                  className="flex items-center gap-2 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.img
                        key={i}
                        className="h-4 w-4"
                        src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                        alt="star"
                        initial={{ scale: 0.8, opacity: 0, x: -10 }}
                        whileInView={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 + 0.2 }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </div>
                  <motion.span 
                    className="text-cyan-300 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    {testimonial.rating.toFixed(1)}
                  </motion.span>
                </motion.div>

                {/* Testimonial Text */}
                <motion.p 
                  className="text-gray-200 text-sm leading-relaxed flex-1 mb-4 line-clamp-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  "{testimonial.feedback}"
                </motion.p>

                {/* Achievement Badge */}
                {testimonial.achievement && (
                  <motion.div
                    className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg px-3 py-2 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-cyan-300 text-xs font-medium">
                      🎯 {testimonial.achievement}
                    </p>
                  </motion.div>
                )}

                {/* Simple CTA */}
                <motion.button 
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 text-cyan-300 hover:text-cyan-200 text-sm font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                >
                  Read Story
                  <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple Stats Section - All from left */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            { number: '10K+', label: 'Students' },
            { number: '4.9/5', label: 'Rating' },
            { number: '98%', label: 'Success' },
            { number: '50+', label: 'Countries' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              variants={slideFromLeft}
              whileHover={{ 
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(34, 211, 238, 0.2)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-xl font-bold text-cyan-400 mb-1">{stat.number}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;