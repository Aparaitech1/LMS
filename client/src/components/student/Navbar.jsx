import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const isCoursesListPage = location.pathname.includes('/course-list');
  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

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

  return (
    <nav className={`
      relative flex items-center justify-between px-6 sm:px-12 md:px-20 lg:px-28 
      py-5 backdrop-blur-xl border-b border-white/20
      bg-gradient-to-r from-slate-900/95 via-purple-900/90 to-blue-900/95
      shadow-2xl shadow-purple-500/10
      ${isCoursesListPage ? 'bg-white/5' : 'bg-gradient-to-r from-slate-900/95 via-cyan-900/90 to-blue-900/95'}
      transition-all duration-500 ease-out
    `}>
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
      
      {/* Logo Section */}
      <div 
        onClick={() => navigate('/')}
        className="relative group cursor-pointer z-10"
      >
        <img 
          src={assets.logo} 
          alt="Logo" 
          className="w-32 lg:w-36 transition-all duration-300 group-hover:scale-105 filter brightness-125 drop-shadow-lg" 
        />
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-white/90 z-10">
        {/* User Links */}
        <div className="flex items-center gap-6">
          {user && (
            <>
              <button 
                onClick={becomeEducator}
                className="relative group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 
                         text-white px-6 py-2.5 rounded-full font-medium text-sm tracking-wide
                         shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40
                         transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">
                  {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
              
              <div className="w-px h-6 bg-white/30"></div>
              
              <Link 
                to='/my-enrollments'
                className="relative text-white/80 hover:text-white font-medium text-sm tracking-wide
                         transition-all duration-300 group"
              >
                My Enrollments
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 
                              group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            </>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: "relative z-10",
                    userButtonAvatarBox: "w-10 h-10 ring-2 ring-white/20 ring-offset-2 ring-offset-slate-900"
                  }
                }}
              />
            </div>
          ) : (
            <button 
              onClick={() => openSignIn()}
              className="relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
                       text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wide
                       shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                       transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create Account
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className='md:hidden flex items-center gap-4 text-white/90 z-10'>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <button 
                onClick={becomeEducator}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full 
                         font-medium text-xs shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105"
              >
                {isEducator ? 'Dashboard' : 'Educator'}
              </button>
              
              <Link 
                to='/my-enrollments'
                className="text-white/80 hover:text-white transition-colors duration-200 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </Link>
            </>
          )}
        </div>
        
        {user ? (
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 ring-2 ring-white/20"
              }
            }}
          />
        ) : (
          <button 
            onClick={() => openSignIn()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-full 
                     shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;