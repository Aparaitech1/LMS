import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const isCoursesListPage = location.pathname.includes('/course-list');

  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext)
  const { openSignIn } = useClerk()
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

  const becomeEducator = async () => {
  try {
    if (isEducator) {
      navigate('/educator');
      return;
    }

    const token = await getToken();
    const { data } = await axios.get(`${backendUrl}/api/educator/update-role`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (data.success) {
      toast.success(data.message);
      setIsEducator(true);
      navigate('/educator'); // ✅ Redirect immediately after success
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <>
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-md border-b transition-all duration-300 ${
          isCoursesListPage 
            ? 'bg-white/95 border-gray-200 shadow-sm' 
            : 'bg-gradient-to-b from-gray-900/95 via-blue-900/90 to-indigo-900/90 border-white/10'
        }`}
        style={{
          transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isNavbarVisible ? 1 : 0
        }}
      >
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img 
              src='/logo.jpg' 
              alt="Website Logo" 
              className="w-20 h-16 rounded-xl transition-transform group-hover:scale-105"
            />
            {!isCoursesListPage && (
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-30 -z-10"></div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-6">
            {user && (
              <>
                <button 
                  onClick={becomeEducator}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border ${
                    isCoursesListPage
                      ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:shadow-md'
                      : 'border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50'
                  }`}
                >
                  {isEducator ? '🎓 Educator Dashboard' : '👨‍🏫 Become Educator'}
                </button>
                
                <div className={`h-6 w-px ${
                  isCoursesListPage ? 'bg-gray-300' : 'bg-white/20'
                }`}></div>
                
                <Link 
                  to='/my-enrollments' 
                  className={`font-medium transition-colors duration-200 ${
                    isCoursesListPage
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📚 My Enrollments
                </Link>
              </>
            )}
          </div>
          
          {user ? (
            <div className={`p-1.5 rounded-xl border ${
              isCoursesListPage 
                ? 'border-gray-200 bg-white' 
                : 'border-white/10 bg-white/5'
            }`}>
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: "w-8 h-8",
                    userButtonAvatarBox: "w-8 h-8 rounded-lg",
                  }
                }}
              />
            </div>
          ) : (
            <button 
              onClick={() => openSignIn()} 
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                isCoursesListPage
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl'
              }`}
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden flex items-center gap-3'>
          <div className="flex items-center gap-2 text-xs">
            {user && (
              <>
                <button 
                  onClick={becomeEducator}
                  className={`px-3 py-1.5 rounded-lg font-medium border ${
                    isCoursesListPage
                      ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  {isEducator ? '🎓' : '👨‍🏫'}
                </button>
                
                <Link 
                  to='/my-enrollments' 
                  className={`p-1.5 rounded-lg transition-colors ${
                    isCoursesListPage
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  📚
                </Link>
              </>
            )}
          </div>
          
          {user ? (
            <div className={`p-1 rounded-lg border ${
              isCoursesListPage 
                ? 'border-gray-200 bg-white' 
                : 'border-white/10 bg-white/5'
            }`}>
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: "w-8 h-8",
                    userButtonAvatarBox: "w-8 h-8 rounded-lg",
                  }
                }}
              />
            </div>
          ) : (
            <button 
              onClick={() => openSignIn()} 
              className={`p-2 rounded-lg transition-colors ${
                isCoursesListPage
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              <img src={assets.user_icon} alt="User" className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;