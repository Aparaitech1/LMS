import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const Companies = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const companies = [
    { logo: assets.microsoft_logo, name: 'Microsoft', delay: 0.1 },
    { logo: assets.walmart_logo, name: 'Walmart', delay: 0.2 },
    { logo: assets.accenture_logo, name: 'Accenture', delay: 0.3 },
    { logo: assets.adobe_logo, name: 'Adobe', delay: 0.4 },
    { logo: assets.paypal_logo, name: 'PayPal', delay: 0.5 },
  ];

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate cursor influence for each card
  const getCardTransform = (index) => {
    if (!isHovering) return { x: 0, y: 0, rotate: 0 };
    const card = document.getElementById(`company-card-${index}`);
    if (!card) return { x: 0, y: 0, rotate: 0 };

    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const deltaX = mousePosition.x - cardCenterX;
    const deltaY = mousePosition.y - cardCenterY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 300;
    const influence = Math.max(0, 1 - distance / maxDistance);

    return {
      x: deltaX * influence * 0.03,
      y: deltaY * influence * 0.03,
      rotate: deltaX * influence * 0.1
    };
  };

  const floatingParticles = [
    { id: 1, left: 5, top: 10, delay: 0, size: 12, color: 'from-blue-500/70 to-cyan-500/60' },
    { id: 2, size: 8, left: 12, top: 15, delay: 1.2, color: 'from-purple-500/65 to-pink-500/55' },
    { id: 3, size: 14, left: 18, top: 8, delay: 2.5, color: 'from-cyan-500/70 to-blue-500/60' },
    { id: 4, size: 10, left: 25, top: 12, delay: 0.8, color: 'from-pink-500/65 to-rose-500/55' },
    { id: 5, size: 13, left: 32, top: 18, delay: 1.8, color: 'from-indigo-500/60 to-purple-500/50' },
    { id: 6, size: 15, left: 8, top: 35, delay: 3.2, color: 'from-emerald-500/65 to-teal-500/55' },
    { id: 7, size: 10, left: 15, top: 42, delay: 1.5, color: 'from-amber-500/70 to-orange-500/60' },
    { id: 8, size: 12, left: 22, top: 38, delay: 2.8, color: 'from-rose-500/65 to-pink-500/55' },
  ];

  const floatingSparkles = [
    { id: 1, size: 3, left: 20, top: 25, delay: 0.5, duration: 4 },
    { id: 2, size: 2, left: 35, top: 40, delay: 1.8, duration: 5 },
    { id: 3, size: 4, left: 50, top: 30, delay: 2.3, duration: 6 },
    { id: 4, size: 3, left: 65, top: 45, delay: 0.9, duration: 4 },
    { id: 5, size: 2, left: 80, top: 35, delay: 3.1, duration: 5 },
  ];

  return (
    <motion.div 
      className="relative py-24 overflow-hidden luxury-bg w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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
        .magnetic-card {
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>

      {/* Cursor Glow */}
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

      {/* Floating Particles */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full bg-gradient-to-br ${p.color} shadow-2xl`}
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

      {/* Sparkles */}
      {floatingSparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute bg-white rounded-full shadow-lg shadow-white/80"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: `${s.top}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.4, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full px-4">
        {/* Title */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 120 }}
            viewport={{ once: true }}
          >
            Trusted by{' '}
            <motion.span
              className="luxury-text"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Industry Leaders
            </motion.span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Join professionals from the world's most innovative companies who trust our platform
          </motion.p>

          {/* Underline */}
          <motion.div
            className="mx-auto mt-8 w-40 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full overflow-hidden"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-full h-full bg-white rounded-full"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scaleX: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Company Cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              id={`company-card-${index}`}
              className="relative group magnetic-card"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: company.delay, type: "spring", stiffness: 100, damping: 20 }}
              viewport={{ once: true, margin: "-30px" }}
              animate={getCardTransform(index)}
              whileHover={{
                scale: 1.1,
                y: -15,
                rotateZ: 5,
                transition: { type: "spring", stiffness: 400, damping: 15, duration: 0.3 }
              }}
            >
              {/* Hover Pulse Ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl luxury-glass overflow-hidden hover:border-white/60 transition-all duration-500">
                {/* Animated Gradient Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100"
                  initial={false}
                  style={{
                    padding: '2px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Floating Logo */}
                <motion.div 
                  className="relative z-10 flex items-center justify-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: company.delay * 2
                  }}
                >
                  <motion.img 
                    src={company.logo}
                    alt={company.name}
                    className="w-20 h-20 object-contain filter brightness-110 contrast-110 transition-all duration-300"
                    whileHover={{
                      scale: 1.3,
                      rotate: [0, -5, 5, 0],
                      filter: "brightness(1.3) contrast(1.2) drop-shadow(0 0 25px rgba(59,130,246,0.8))",
                      transition: { type: "spring", stiffness: 400, damping: 15, rotate: { duration: 0.6 } }
                    }}
                  />
                </motion.div>

                {/* Company Name */}
                <motion.p 
                  className="text-center mt-6 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                >
                  {company.name}
                </motion.p>
              </div>

              {/* Corner Indicator */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 shadow-xl"
                initial={false}
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 border border-white/20 relative overflow-hidden group luxury-glass"
            whileHover={{
              scale: 1.05,
              background: [
                "linear-gradient(to right, #06b6d4, #3b82f6)",
                "linear-gradient(to right, #3b82f6, #8b5cf6)",
                "linear-gradient(to right, #06b6d4, #3b82f6)"
              ],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">Join the Innovators</span>
            <motion.div
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Companies;
