import React from 'react';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                              linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <motion.div
          className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex md:flex-row flex-col items-center justify-between gap-3">
          
          {/* Left Section - Brand */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <div className="relative group">
              <img 
                className="w-10 h-8 rounded-lg transition-transform group-hover:scale-105" 
                src='/logo.jpg' 
                alt="LearnPro Logo" 
              />
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-30 -z-10"
                animate={{
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Separator */}
            <div className="hidden md:block h-5 w-px bg-gradient-to-b from-cyan-400/30 to-blue-500/30"></div>

            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-300">
                © {currentYear} LearnPro LMS
              </p>
            </div>
          </motion.div>

          {/* Right Section - Social Links */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-1">
              {[
                { icon: assets.facebook_icon, label: 'Facebook' },
                { icon: assets.twitter_icon, label: 'Twitter' },
                { icon: assets.instagram_icon, label: 'Instagram' }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href="#"
                  className="group relative p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-cyan-400/20 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={social.icon} 
                    alt={social.label} 
                    className="w-3 h-3 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-200" 
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;