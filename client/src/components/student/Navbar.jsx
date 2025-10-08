import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const isCoursesListPage = location.pathname.includes('/course-list');
  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for navbar background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (data.success) {
        toast.success(data.message);
        setIsEducator(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Premium floating elements for navbar
  const floatingElements = [
    { id: 1, left: 5, delay: 0, size: 3 },
    { id: 2, left: 15, delay: 1.5, size: 2 },
    { id: 3, left: 25, delay: 0.8, size: 4 },
    { id: 4, left: 35, delay: 2.2, size: 3 },
    { id: 5, left: 45, delay: 1.1, size: 2 },
    { id: 6, left: 55, delay: 2.8, size: 3 },
    { id: 7, left: 65, delay: 0.5, size: 4 },
    { id: 8, left: 75, delay: 1.8, size: 2 },
    { id: 9, left: 85, delay: 3.1, size: 3 },
    { id: 10, left: 95, delay: 0.9, size: 2 },
  ];

  const floatingSparkles = [
    { id: 1, left: 20, top: 30, delay: 0.3 },
    { id: 2, left: 40, top: 70, delay: 1.2 },
    { id: 3, left: 60, top: 40, delay: 2.1 },
    { id: 4, left: 80, top: 60, delay: 0.7 },
  ];

  return (
    <motion.div 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 md:px-16 lg:px-24 py-4 luxury-navbar relative overflow-hidden ${
        isScrolled ? 'luxury-glass-scrolled' : 'luxury-glass'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      {/* Custom CSS for ultra luxury navbar */}
      <style jsx>{`
        .luxury-navbar {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .luxury-navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(248, 250, 252, 0.98) 0%,
            rgba(239, 246, 255, 0.95) 50%,
            rgba(236, 254, 255, 0.98) 100%
          );
          z-index: -1;
        }
        .luxury-glass {
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        .luxury-glass-scrolled {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .luxury-glass-white {
          background: rgba(255, 255, 255, 0.98);
        }
        .nav-link {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 12px;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover::before {
          opacity: 1;
          animation: gradientBorder 3s ease infinite;
        }
        .luxury-button {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 45%, #06b6d4 85%, #3b82f6 100%);
          background-size: 300% 300%;
          animation: gradientShift 4s ease infinite;
          box-shadow: 
            0 8px 32px rgba(59, 130, 246, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        .luxury-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }
        .luxury-button:hover::before {
          left: 100%;
        }
        .luxury-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 45%, #06b6d4 85%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 300%;
          animation: luxuryGradient 6s ease infinite;
          text-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        }
        .premium-logo {
          filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.2));
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes luxuryGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradientBorder {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .floating-element {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0.7;
        }
        .sparkle {
          position: absolute;
          background: white;
          border-radius: 50%;
          filter: blur(0.5px);
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
        }
      `}</style>

      {/* Animated Background Elements */}
      <AnimatePresence>
        {!isCoursesListPage && floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="floating-element bg-gradient-to-br from-blue-400/30 to-cyan-400/20"
            style={{
              left: `${element.left}%`,
              width: element.size,
              height: element.size,
              bottom: Math.random() * 20 + 10,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay
            }}
          />
        ))}
      </AnimatePresence>

      {/* Floating Sparkles */}
      <AnimatePresence>
        {floatingSparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: 1,
              height: 1,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: sparkle.delay
            }}
          />
        ))}
      </AnimatePresence>

      {/* Premium Logo with Enhanced Animation */}
      <motion.div
        className="flex-shrink-0 cursor-pointer group"
        whileHover={{ 
          scale: 1.05,
          rotateZ: -2 
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
        onClick={() => navigate('/')}
      >
        <motion.div
          className="relative"
          whileHover={{
            rotateY: 10,
          }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={assets.logo} 
            alt="EduPlus Premium" 
            className="w-28 lg:w-32 premium-logo transition-all duration-300 group-hover:brightness-110" 
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: -100 }}
            animate={{ x: 100 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Desktop Navigation - Premium Version */}
      <div className="md:flex hidden items-center gap-8">
        <div className="flex items-center gap-6 text-gray-700 font-medium">
          {user && (
            <>
              <motion.button 
                onClick={becomeEducator}
                className="nav-link text-sm font-semibold luxury-text relative group"
                whileHover={{ 
                  scale: 1.02,
                  y: -1
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ 
                      rotate: isEducator ? [0, 10, 0] : [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    {isEducator ? '🎓' : '🚀'}
                  </motion.span>
                  {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                </span>
              </motion.button>
              
              <motion.div
                className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.3 }}
              />
              
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  y: -1
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to='/my-enrollments' className="nav-link text-sm font-semibold luxury-text">
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ 
                        y: [0, -2, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      📚
                    </motion.span>
                    My Courses
                  </span>
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Premium User Auth Section */}
        {user ? (
          <motion.div
            className="relative group"
            whileHover={{ 
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <UserButton 
              appearance={{
                elements: {
                  rootBox: "shadow-xl rounded-full border-2 border-white/40 bg-white/20 backdrop-blur-sm",
                  userButtonAvatarBox: "w-9 h-9",
                  userButtonOuterIdentifier: "luxury-text font-semibold"
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.button 
            onClick={() => openSignIn()} 
            className="luxury-button text-white px-8 py-3 rounded-2xl font-semibold text-sm relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <motion.span
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                ✨
              </motion.span>
              Join Free Today
              <motion.span
                animate={{ 
                  rotate: [0, -15, 0, 15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                ✨
              </motion.span>
            </span>
            
            {/* Animated shine effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: -100 }}
              animate={{ x: 400 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        )}
      </div>

      {/* Mobile Navigation - Premium */}
      <div className='md:hidden flex items-center gap-4 text-gray-700'>
        <div className="flex items-center gap-3 text-sm font-medium">
          {user && (
            <>
              <motion.button 
                onClick={becomeEducator}
                className="nav-link luxury-text font-semibold p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="flex items-center gap-1">
                  {isEducator ? '🎓' : '🚀'}
                </span>
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to='/my-enrollments' className="nav-link luxury-text font-semibold p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="flex items-center gap-1">
                    📚
                  </span>
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {user ? (
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-sm" />
            <UserButton 
              appearance={{
                elements: {
                  rootBox: "shadow-lg rounded-full border border-white/30 bg-white/20 backdrop-blur-sm",
                  userButtonAvatarBox: "w-8 h-8"
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.button 
            onClick={() => openSignIn()}
            className="luxury-button text-white px-5 py-2.5 rounded-xl font-semibold text-xs relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-1">
              ✨ Join
            </span>
          </motion.button>
        )}
      </div>

      {/* Premium Animated Border Bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-300/60 via-purple-300/60 to-cyan-300/60 rounded-full"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            x: [-100, 100],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Premium Glow Effect */}
      <motion.div 
        className="absolute bottom-0 left-1/4 right-1/4 h-1 blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="h-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default Navbar;