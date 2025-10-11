import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ bgColor }) => {
  const { isEducator, navigate } = useContext(AppContext)
  const { user } = useUser()

  // Scroll animation states
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at top
      if (currentScrollY === 0) {
        setIsNavbarVisible(true);
        return;
      }

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!isEducator || !user) return null;

  return (
    <>
      {/* Educator Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-md border-b transition-all duration-300 ${
          bgColor || 'bg-gradient-to-b from-gray-900/95 via-blue-900/90 to-indigo-900/90 border-white/10'
        }`}
        style={{
          transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isNavbarVisible ? 1 : 0
        }}
      >
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/educator')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img 
              src='/logo.jpg' 
              alt="Website Logo" 
              className="w-20 h-16 rounded-xl transition-transform group-hover:scale-105"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-30 -z-10"></div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-6">
            {/* Welcome Message */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border border-amber-400/30 bg-amber-500/10`}>
                <span className="text-amber-300 text-lg">👋</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">Welcome back!</span>
                <span className="text-cyan-300 text-xs">{user.fullName}</span>
              </div>
            </div>
            
            <div className={`h-6 w-px bg-white/20`}></div>
            
            {/* Quick Links */}
            <Link 
              to="/educator" 
              className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              🏠 Dashboard
            </Link>
            
            <Link 
              to="/educator/my-courses" 
              className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              📚 My Courses
            </Link>
          </div>
          
          {/* User Profile */}
          <div className={`p-1.5 rounded-xl border border-white/10 bg-white/5`}>
            <UserButton 
              appearance={{
                elements: {
                  rootBox: "w-8 h-8",
                  userButtonAvatarBox: "w-8 h-8 rounded-lg",
                }
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden flex items-center gap-3'>
          <div className="flex items-center gap-2 text-xs">
            {/* Welcome Badge */}
            <div className={`p-2 rounded-lg border border-amber-400/30 bg-amber-500/10`}>
              <span className="text-amber-300">👋</span>
            </div>
            
            {/* Quick Links */}
            <Link 
              to="/educator" 
              className={`p-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors`}
            >
              🏠
            </Link>
            
            <Link 
              to="/educator/my-courses" 
              className={`p-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors`}
            >
              📚
            </Link>
          </div>
          
          {/* User Profile */}
          <div className={`p-1 rounded-lg border border-white/10 bg-white/5`}>
            <UserButton 
              appearance={{
                elements: {
                  rootBox: "w-8 h-8",
                  userButtonAvatarBox: "w-8 h-8 rounded-lg",
                }
              }}
            />
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;