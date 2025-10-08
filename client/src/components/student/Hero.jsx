import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';
import { motion } from 'framer-motion';

// Enhanced Small Luxury Bubble Component
const SmallBubble = ({ size, left, top, delay, duration, gradient, glow }) => {
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br ${gradient} ${glow} blur-[1px]`}
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
      }}
      animate={{
        opacity: [0.3, 0.8, 0.4, 0.7],
        scale: [0.8, 1.4, 1, 1.2],
        y: [0, -50, -20, -40],
        x: [0, 20, -15, 10],
        rotate: [0, 90, 180, 270],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.8,
        opacity: 0.9,
        rotate: 360,
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      }}
    />
  );
};

// Premium Floating Sparkle Component
const FloatingSparkle = ({ size, left, top, delay, duration }) => (
  <motion.div
    className="absolute bg-white rounded-full shadow-lg shadow-white/80"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      top: `${top}%`,
    }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0.4, 1.4, 0.4],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Enhanced Company Logo with Magnetic Animation
const AnimatedCompanyLogo = ({ icon, name, delay, position }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`absolute ${position} group`}
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1.2,
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{
        scale: 1.2,
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Logo Container */}
      <motion.div
        className="relative w-20 h-20 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/25 shadow-2xl luxury-glass flex items-center justify-center cursor-pointer"
        animate={{
          y: [0, -8, 0],
          rotateY: isHovered ? 180 : 0,
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
          },
          rotateY: {
            duration: 0.6,
            ease: "easeInOut"
          }
        }}
      >
        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-cyan-400/30 rounded-2xl opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.img 
          src={icon} 
          alt={name}
          className="relative z-10 w-12 h-12 object-contain filter brightness-110 contrast-110"
          animate={{
            scale: isHovered ? 1.3 : 1,
            filter: isHovered ? 
              "brightness(1.3) contrast(1.2) drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))" : 
              "brightness(1.1) contrast(1.1)"
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Particle Burst on Hover */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-lg"
                initial={{ scale: 0, opacity: 0, x: "50%", y: "50%" }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                  x: `calc(50% + ${Math.cos((i / 6) * Math.PI * 2) * 60}px)`,
                  y: `calc(50% + ${Math.sin((i / 6) * Math.PI * 2) * 60}px)`,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Company Name Tooltip */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg opacity-0 whitespace-nowrap"
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 5 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {name}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45" />
      </motion.div>
    </motion.div>
  );
};

// Luxury Animated Text Character Component
const AnimatedChar = ({ children, delay, isSpace, isHighlighted }) => (
  <motion.span
    className={`inline-block ${isSpace ? 'w-3' : ''} ${isHighlighted ? 'luxury-text' : ''}`}
    initial={{ opacity: 0, y: 60, scale: 0.8, rotateY: 90 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
    transition={{
      duration: 0.6,
      delay: delay,
      ease: [0.23, 1, 0.32, 1],
    }}
    whileHover={{
      scale: 1.4,
      y: -6,
      textShadow: isHighlighted ? "0 0 30px rgba(59, 130, 246, 0.6)" : "0 0 20px rgba(0, 0, 0, 0.2)",
      transition: { type: "spring", stiffness: 600, damping: 12 }
    }}
  >
    {children}
  </motion.span>
);

// Animated Search Bar Wrapper
const AnimatedSearchBar = () => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 2.6,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/15 rounded-2xl blur-lg scale-105 -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <SearchBar />
    </motion.div>
  );
};

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse movement for cursor effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced bubble configurations - Using the Companies component style
  const floatingParticles = [
    { id: 1, left: 5, top: 10, delay: 0, size: 12, color: 'from-blue-500/70 to-cyan-500/60', glow: 'shadow-lg shadow-blue-300/20' },
    { id: 2, size: 8, left: 12, top: 15, delay: 1.2, color: 'from-purple-500/65 to-pink-500/55', glow: 'shadow-md shadow-purple-300/15' },
    { id: 3, size: 14, left: 18, top: 8, delay: 2.5, color: 'from-cyan-500/70 to-blue-500/60', glow: 'shadow-lg shadow-cyan-300/20' },
    { id: 4, size: 10, left: 25, top: 12, delay: 0.8, color: 'from-pink-500/65 to-rose-500/55', glow: 'shadow-md shadow-pink-300/15' },
    { id: 5, size: 13, left: 32, top: 18, delay: 1.8, color: 'from-indigo-500/60 to-purple-500/50', glow: 'shadow-lg shadow-indigo-300/20' },
    { id: 6, size: 15, left: 8, top: 35, delay: 3.2, color: 'from-emerald-500/65 to-teal-500/55', glow: 'shadow-md shadow-emerald-300/15' },
    { id: 7, size: 10, left: 15, top: 42, delay: 1.5, color: 'from-amber-500/70 to-orange-500/60', glow: 'shadow-lg shadow-amber-300/20' },
    { id: 8, size: 12, left: 22, top: 38, delay: 2.8, color: 'from-rose-500/65 to-pink-500/55', glow: 'shadow-md shadow-rose-300/15' },
    { id: 9, size: 11, left: 45, top: 15, delay: 0.3, color: 'from-blue-500/65 to-cyan-500/55', glow: 'shadow-lg shadow-blue-300/20' },
    { id: 10, size: 9, left: 55, top: 25, delay: 1.7, color: 'from-purple-500/60 to-indigo-500/50', glow: 'shadow-md shadow-purple-300/15' },
    { id: 11, size: 16, left: 65, top: 12, delay: 2.2, color: 'from-cyan-500/65 to-blue-500/55', glow: 'shadow-lg shadow-cyan-300/20' },
    { id: 12, size: 7, left: 75, top: 30, delay: 0.9, color: 'from-pink-500/60 to-rose-500/50', glow: 'shadow-md shadow-pink-300/15' },
    { id: 13, size: 14, left: 85, top: 20, delay: 3.5, color: 'from-indigo-500/65 to-purple-500/55', glow: 'shadow-lg shadow-indigo-300/20' },
    { id: 14, size: 10, left: 92, top: 35, delay: 1.1, color: 'from-emerald-500/60 to-teal-500/50', glow: 'shadow-md shadow-emerald-300/15' },
    { id: 15, size: 13, left: 40, top: 45, delay: 2.6, color: 'from-amber-500/65 to-orange-500/55', glow: 'shadow-lg shadow-amber-300/20' },
    { id: 16, size: 8, left: 50, top: 55, delay: 0.6, color: 'from-rose-500/60 to-pink-500/50', glow: 'shadow-md shadow-rose-300/15' },
    { id: 17, size: 12, left: 60, top: 65, delay: 3.1, color: 'from-blue-500/60 to-cyan-500/50', glow: 'shadow-lg shadow-blue-300/20' },
    { id: 18, size: 9, left: 70, top: 75, delay: 1.4, color: 'from-purple-500/65 to-indigo-500/55', glow: 'shadow-md shadow-purple-300/15' },
    { id: 19, size: 15, left: 80, top: 85, delay: 2.9, color: 'from-cyan-500/60 to-blue-500/50', glow: 'shadow-lg shadow-cyan-300/20' },
    { id: 20, size: 11, left: 90, top: 95, delay: 0.5, color: 'from-pink-500/65 to-rose-500/55', glow: 'shadow-md shadow-pink-300/15' },
  ];

  // Floating sparkles - Increased quantity
  const floatingSparkles = [
    { id: 1, size: 3, left: 20, top: 25, delay: 0.5, duration: 4 },
    { id: 2, size: 2, left: 35, top: 40, delay: 1.8, duration: 5 },
    { id: 3, size: 4, left: 50, top: 30, delay: 2.3, duration: 6 },
    { id: 4, size: 3, left: 65, top: 45, delay: 0.9, duration: 4 },
    { id: 5, size: 2, left: 80, top: 35, delay: 3.1, duration: 5 },
    { id: 6, size: 3, left: 15, top: 60, delay: 1.2, duration: 5 },
    { id: 7, size: 4, left: 30, top: 70, delay: 2.7, duration: 6 },
    { id: 8, size: 2, left: 45, top: 80, delay: 0.8, duration: 4 },
    { id: 9, size: 3, left: 60, top: 90, delay: 3.3, duration: 5 },
    { id: 10, size: 4, left: 75, top: 65, delay: 1.5, duration: 6 },
  ];

  // Company data with positions
  const companies = [
    { 
      icon: assets.microsoft_logo, 
      name: 'Microsoft',
      position: 'top-20 left-20',
      delay: 1.2
    },
    { 
      icon: assets.adobe_logo, 
      name: 'Adobe',
      position: 'top-20 right-20',
      delay: 1.4
    },
    { 
      icon: assets.paypal_logo, 
      name: 'PayPal',
      position: 'bottom-20 left-20',
      delay: 1.6
    },
    { 
      icon: assets.accenture_logo, 
      name: 'Accenture',
      position: 'bottom-20 right-20',
      delay: 1.8
    },
    { 
      icon: assets.walmart_logo, 
      name: 'Walmart',
      position: 'top-1/3 left-10',
      delay: 2.0
    },
    { 
      icon: assets.microsoft_logo, // You can add more companies here
      name: 'Google',
      position: 'top-1/3 right-10',
      delay: 2.2
    },
  ];

  const headingText = "Empower your future with courses designed to fit your choice.";
  const words = headingText.split(' ');

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-8 md:px-0 overflow-hidden luxury-bg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Enhanced Custom CSS */}
      <style jsx>{`
        .luxury-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 25%, #ecfeff 50%, #f0f9ff 75%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }
        .luxury-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
          animation: luxuryShimmer 15s ease-in-out infinite;
        }
        @keyframes luxuryShimmer {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .luxury-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 45%, #06b6d4 85%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: luxuryGradient 8s ease infinite;
          text-shadow: 0 6px 30px rgba(59, 130, 246, 0.4);
        }
        @keyframes luxuryGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .luxury-glass {
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          background: rgba(255, 255, 255, 0.15);
        }
        .cursor-glow {
          position: fixed;
          pointer-events: none;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          z-index: 9999;
          mix-blend-mode: overlay;
        }
      `}</style>

      {/* Cursor Glow Effect */}
      {isHovering && (
        <motion.div
          className="cursor-glow"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            scale: [1, 1.2, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 150, damping: 15 },
            y: { type: "spring", stiffness: 150, damping: 15 },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      )}

      {/* Floating Particles - Using Companies component style */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full bg-gradient-to-br ${p.color} ${p.glow}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.4, 0.7],
            scale: [0.8, 1.4, 1, 1.2],
            y: [0, -50, -20, -40],
            x: [0, 20, -15, 10],
            rotate: [0, 90, 180, 270],
          }}
          transition={{
            duration: 8,
            delay: p.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Sparkles */}
      {floatingSparkles.map((sparkle) => (
        <FloatingSparkle
          key={sparkle.id}
          size={sparkle.size}
          left={sparkle.left}
          top={sparkle.top}
          delay={sparkle.delay}
          duration={sparkle.duration}
        />
      ))}

      {/* Animated Company Logos */}
      {companies.map((company) => (
        <AnimatedCompanyLogo
          key={company.position}
          icon={company.icon}
          name={company.name}
          position={company.position}
          delay={company.delay}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 text-center max-w-6xl mx-auto">

        {/* Luxury Animated Heading */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.h1
            className="md:text-6xl text-4xl font-extrabold text-gray-800 max-w-5xl leading-snug tracking-tight"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-5 last:mr-0 mb-3">
                {word.split('').map((char, charIndex) => {
                  const delay = 0.2 + (wordIndex * 0.06) + (charIndex * 0.02);
                  const isHighlighted = word.toLowerCase().includes('courses') || word.toLowerCase().includes('designed') || word.toLowerCase().includes('empower');

                  return (
                    <AnimatedChar
                      key={`${wordIndex}-${charIndex}`}
                      delay={delay}
                      isSpace={char === ' '}
                      isHighlighted={isHighlighted}
                    >
                      {char}
                    </AnimatedChar>
                  );
                })}
              </span>
            ))}
          </motion.h1>

          {/* Luxury Animated Underline */}
          <motion.div
            className="absolute -bottom-6 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 2.2, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full blur-sm"
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Luxury Animated Sketch Element */}
          <motion.img
            src={assets.sketch}
            alt="sketch"
            className="md:block hidden absolute -bottom-14 right-10 w-36 opacity-90 drop-shadow-2xl"
            initial={{ opacity: 0, rotate: -25, scale: 0.6, x: 120 }}
            animate={{
              opacity: 1,
              rotate: 0,
              scale: 1,
              x: 0,
              y: [0, -12, 0]
            }}
            transition={{
              opacity: { duration: 1.2, delay: 1.8 },
              rotate: { duration: 1.2, delay: 1.8, type: "spring", stiffness: 120 },
              scale: { duration: 1.2, delay: 1.8, type: "spring", stiffness: 120 },
              x: { duration: 1.2, delay: 1.8, type: "spring", stiffness: 120 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{
              rotate: 8,
              scale: 1.15,
              y: -8,
              transition: { type: "spring", stiffness: 450, damping: 12 }
            }}
          />
        </motion.div>

        {/* Luxury Animated Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="relative"
        >
          <motion.p
            className="md:block hidden text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light relative z-10 px-8 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
          >
            {["world-class instructors", "interactive content", "supportive community"].map((phrase, index) => (
              <motion.span
                key={phrase}
                className="relative mx-1.5"
                initial={{ opacity: 0, y: 25, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 2.4 + (index * 0.25),
                  type: "spring",
                  stiffness: 250
                }}
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  transition: { type: "spring", stiffness: 550 }
                }}
              >
                <span className={`font-semibold text-base ${index === 0 ? 'text-blue-500' :
                    index === 1 ? 'text-cyan-500' : 'text-purple-500'
                  }`}>
                  {phrase}
                </span>
                {index < 2 && (
                  <motion.span
                    className="mx-2.5 text-gray-300"
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: index * 0.8 }}
                  >
                    •
                  </motion.span>
                )}
              </motion.span>
            ))}
            {' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 3.1 }}
              className="text-gray-500"
            >
              to help you achieve your personal and professional goals.
            </motion.span>
          </motion.p>

          <motion.p
            className="md:hidden text-lg text-gray-500 max-w-sm mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            We bring together <span className="font-semibold text-blue-500">world-class instructors</span>
            {' '}to help you achieve your professional goals.
          </motion.p>
        </motion.div>

        {/* Animated Search Bar */}
        <div className="w-full max-w-2xl">
          <AnimatedSearchBar />
        </div>

        {/* Luxury Trust Badge */}
        <motion.div
          className="flex items-center gap-8 mt-12 text-sm bg-white/20 backdrop-blur-2xl rounded-3xl px-10 py-7 border border-white/15 shadow-2xl luxury-glass"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.1,
            delay: 3.2,
            type: "spring",
            stiffness: 90,
            damping: 16
          }}
          whileHover={{
            scale: 1.04,
            backgroundColor: "rgba(255,255,255,0.25)",
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.2)",
            transition: { type: "spring", stiffness: 380, damping: 12 }
          }}
        >
          <div className="flex items-center gap-7">
            <div className="flex -space-x-3.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.div
                  key={item}
                  className="w-11 h-11 bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400 rounded-full border-2 border-white/80 shadow-xl relative luxury-glass"
                  initial={{ x: -25, opacity: 0, scale: 0, rotate: -90 }}
                  animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 3.6 + (item * 0.12),
                    type: "spring",
                    stiffness: 180
                  }}
                  whileHover={{
                    scale: 1.25,
                    y: -6,
                    z: 50,
                    transition: { type: "spring", stiffness: 550, damping: 12 }
                  }}
                >
                  <div className="absolute inset-1 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full" />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex flex-col text-left"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 4.2 }}
            >
              <motion.span
                className="text-lg font-bold text-gray-700"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 450 }}
              >
                Join <span className="luxury-text">10,000+</span>
              </motion.span>
              <motion.span
                className="text-base text-gray-500 font-medium"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 450 }}
              >
                successful learners worldwide
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Luxury Scroll Indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 4.6 }}
      >
        <motion.div
          className="w-9 h-14 border border-white/25 rounded-full flex justify-center backdrop-blur-2xl bg-white/12 shadow-2xl luxury-glass"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{
            scale: 1.15,
            borderColor: "rgba(59, 130, 246, 0.4)",
            backgroundColor: "rgba(255,255,255,0.18)",
            transition: { duration: 0.4 }
          }}
        >
          <motion.div
            className="w-1 h-5 bg-gradient-to-b from-blue-300 to-cyan-300 rounded-full mt-4 shadow-lg"
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;