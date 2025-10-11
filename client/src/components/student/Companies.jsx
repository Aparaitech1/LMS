import React, { useRef } from "react";
import { assets } from "../../assets/assets";
import { motion, useInView } from "framer-motion";

const Companies = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });

  const companies = [
    { logo: assets.microsoft_logo, name: "Microsoft" },
    // { logo: assets.google_logo, name: "Google" },
    // { logo: assets.amazon_logo, name: "Amazon" },
    { logo: assets.adobe_logo, name: "Adobe" },
    // { logo: assets.meta_logo, name: "Meta" },
    { logo: assets.paypal_logo, name: "PayPal" },
    // { logo: assets.apple_logo, name: "Apple" },
    { logo: assets.microsoft_logo, name: "Microsoft" },
    { logo: assets.adobe_logo, name: "Adobe" },
    // { logo: assets.netflix_logo, name: "Netflix" },
    { logo: assets.paypal_logo, name: "PayPal" },
    { logo: assets.microsoft_logo, name: "Microsoft" },
  ];

  const marqueeCompanies = [...companies, ...companies];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Video Background - No blur */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/Background.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"></div>
        </video>
        
        {/* Dark overlay for better content readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Background Pattern matching Hero - REMOVED GRID */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs matching Hero */}
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

        {/* Floating Elements matching Hero */}
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header matching Hero style */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-white font-medium">Trusted by Industry Leaders</span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Learn Where{" "}
            <motion.span 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Professionals
            </motion.span>{" "}
            Work
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Join <span className="text-cyan-300 font-semibold">50,000+ professionals</span> from the world's most innovative companies
          </motion.p>
        </motion.div>

        {/* Simple Marquee matching Hero's clean style */}
        <motion.div
          className="mb-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="flex">
            <motion.div
              className="flex space-x-16"
              animate={{
                x: [0, -1440],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {marqueeCompanies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex flex-col items-center justify-center min-w-[140px] group"
                >
                  {/* Company Logo */}
                  <div className="relative z-10 mb-4 p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 group-hover:bg-white/10 group-hover:border-cyan-400/30 transition-all duration-300">
                    <img 
                      src={company.logo}
                      alt={company.name}
                      className="h-14 w-14 object-contain brightness-125 contrast-125 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Company Name */}
                  <div className="text-center">
                    <span className="text-white font-semibold text-base group-hover:text-cyan-300 transition-colors duration-300">
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats matching Hero's stats style */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {[
            { number: "50K+", label: "Professionals", color: "from-cyan-400 to-blue-500" },
            { number: "100+", label: "Top Companies", color: "from-purple-400 to-pink-500" },
            { number: "98%", label: "Career Success", color: "from-green-400 to-emerald-500" },
            { number: "4.9/5", label: "Rating", color: "from-yellow-400 to-orange-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
            >
              <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-300 font-semibold text-lg">{stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA matching Hero's button style */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.button
            className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-12 py-5 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden text-lg"
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
          
          <motion.p 
            className="text-gray-400 mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.7 }}
          >
            Join thousands of professionals advancing their careers
          </motion.p>

          {/* Trust Badges matching Hero's style */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            {['7-day free trial', 'Money-back guarantee', 'No credit card required'].map((item, index) => (
              <motion.div 
                key={item}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 2.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                <span className="text-sm text-gray-300">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Companies; 