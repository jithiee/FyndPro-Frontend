import React, { useState } from 'react';
import {
  FiHome, FiUser, FiPlus, FiImage, FiStar,
  FiCalendar, FiDollarSign, FiBell, FiSettings,
  FiMenu, FiX, FiLogOut, FiChevronRight, FiAward
} from 'react-icons/fi';
import logo from "../assets/plogo.png"
import { Link } from 'react-router-dom';





const SidebarUser = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', tab: 'dashboard' },
    { icon: <FiUser />, label: 'Profile', tab: 'profile' },
    { icon: <FiCalendar />, label: 'Bookings', tab: 'bookingview' },
    { icon: <FiBell />, label: 'Notifications', tab: 'notifications' },
    
  ];

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-700 p-2 rounded-lg shadow-md text-white hover:bg-indigo-600 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-indigo-900 to-indigo-800 text-white w-64 z-40 shadow-xl flex flex-col`}>
        {/* Logo section */}
        <div className="flex items-center justify-center h-20 px-4 border-b border-indigo-700">
          <div className="flex items-center space-x-2">
            <Link to='/'>
           <img src={logo} alt="logo" className="w-56 h-auto" loading="lazy" />
            </Link>
          </div>
        </div>
        
        {/* Navigation items */}
        <nav className="mt-6 flex-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                setMobileOpen(false);
              }}
              onMouseEnter={() => setHoveredItem(item.tab)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center w-full px-4 py-3 text-left rounded-lg mb-1 transition-all duration-200 ${
                activeTab === item.tab 
                  ? 'bg-white text-indigo-800 shadow-lg' 
                  : 'hover:bg-indigo-700 text-indigo-100'
              }`}
            >
              <span className={`mr-3 transition-transform duration-200 ${
                (activeTab === item.tab || hoveredItem === item.tab) ? 'scale-110' : ''
              }`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activeTab === item.tab && (
                <FiChevronRight className="ml-auto text-indigo-600" />
              )}
            </button>
          ))}
        </nav>
        
        {/* User profile section */}
        <div className="p-4 border-t border-indigo-700 bg-indigo-800 bg-opacity-50 ">
       
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-left rounded-lg bg-indigo-900 bg-opacity-50 hover:bg-opacity-70 text-indigo-100 transition-colors duration-200"
          >
            <FiLogOut className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarUser;