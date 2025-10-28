// src/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import { FaTachometerAlt, FaBuilding, FaBoxOpen, FaSignOutAlt, FaTags, FaUsers, FaChartBar, FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const linkStyles = "flex items-center px-4 py-2 text-scorpion rounded-md hover:bg-gin transition-colors duration-200 border-l-4 border-transparent";
  const activeLinkStyles = "bg-gin text-salem font-bold border-salem";

  return (
    <div className="flex h-screen bg-gin">
      <aside className={`transition-all duration-300 bg-white shadow-md flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex justify-between items-center">
          {!isCollapsed && <img src={logo} alt="Company Logo" className="w-24 mx-auto transition-opacity duration-300" />}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-scorpion hover:text-salem">
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        <nav className="p-2 flex-1">
          <NavLink to="/" end className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaTachometerAlt className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Dashboard'}
          </NavLink>
          <NavLink to="/estates" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaBuilding className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Estates'}
          </NavLink>
          <NavLink to="/buildings" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaBuilding className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Buildings'}
          </NavLink>
          <NavLink to="/items" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaBoxOpen className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Items'}
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaTags className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Categories'}
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaUsers className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Users'}
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaChartBar className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Reports'}
          </NavLink>
          <NavLink to="/audit-logs" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''} ${isCollapsed ? 'justify-center' : ''}`}>
            <FaHistory className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Audit Logs'}
          </NavLink>
        </nav>
        <div className="p-4">
          <Button onClick={handleLogout} variant="secondary" className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <FaSignOutAlt className={isCollapsed ? '' : 'mr-2'} />
            {!isCollapsed && 'Logout'}
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
