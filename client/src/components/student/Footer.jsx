import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-blue-900/95 to-indigo-900 border-t border-white/10">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src='/logo.jpg' 
                  alt="Website Logo" 
                  className="w-12 h-10 rounded-lg"
                />
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Aparaitech
                </span>
              </div>
              <p className="text-gray-300/90 text-xs mb-3">
                Transform your learning journey with industry-leading courses.
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="p-1.5 bg-white/5 border border-white/10 rounded text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
              <ul className="space-y-1">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'All Courses', path: '/course-list' },
                  { name: 'My Enrollments', path: '/my-enrollments' },
                  { name: 'Educator Dashboard', path: '/educator' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-xs block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-sm mb-3">Support</h3>
              <ul className="space-y-1">
                {[
                  'Help Center',
                  'Privacy Policy',
                  'Terms of Service',
                  'Contact Us'
                ].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-xs block py-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-sm mb-3">Newsletter</h3>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-colors duration-200"
                />
                <button className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded text-xs transition-opacity duration-200 hover:opacity-90">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-white/10 bg-black/20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
              <p className="text-gray-400 text-xs">
                © {currentYear} GreatStack. All rights reserved.
              </p>
              <div className="flex items-center space-x-3 text-xs">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;