import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/educator/SideBar';
import Navbar from '../../components/educator/Navbar';
import Footer from '../../components/educator/Footer';

const Educator = () => {
  return (
    // Use h-screen to fix layout height to viewport
    <div className="flex flex-col h-screen bg-white text-default overflow-hidden">
      {/* Fixed Navbar (space already handled by Navbar component) */}
      <Navbar />

      {/* Body section (fills remaining space below navbar) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content + Footer */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>

          {/* Footer stays at bottom */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Educator;
