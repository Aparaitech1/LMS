import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const SideBar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className="relative md:w-64 w-20 min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                                linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="relative z-10 h-full backdrop-blur-md border-r border-cyan-500/20 py-6 flex flex-col">
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-2 px-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                end={item.path === '/educator'}
                className={({ isActive }) =>
                  `group flex items-center md:flex-row flex-col md:justify-start justify-center md:px-4 px-2 py-3 gap-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30'
                      : 'hover:bg-white/10 border border-transparent hover:border-cyan-400/20'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-cyan-400 rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Icon Container */}
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500'
                        : 'bg-white/10 group-hover:bg-cyan-400/20'
                    }`}>
                      <img
                        src={item.icon}
                        alt={item.name}
                        className={`w-4 h-4 transition-all duration-200 ${
                          isActive ? 'filter brightness-0 invert' : 'filter brightness-0 invert opacity-70 group-hover:opacity-100'
                        }`}
                      />
                    </div>

                    {/* Text */}
                    <span
                      className={`md:block hidden font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-300 group-hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;