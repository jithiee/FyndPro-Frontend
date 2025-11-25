
import React, { useState } from 'react';
import DashboardSectionUser from './DashboardSectionUser';
import UserProfile from './UserProfile';
import SidebarUser from './SidebarUser';

const UserDash = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardSectionUser />;
      case 'profile': return <UserProfile />;
      // case 'bookingview': return <Booking />;
      default: return <DashboardSectionUser />;
    }
  };


  return (
    <div className="flex h-screen bg-gray-50">
 
      <SidebarUser 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 overflow-auto md:ml-64 p-6">
        {renderActiveTab()}
      </div>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDash;




















