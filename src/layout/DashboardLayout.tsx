// src/layout/DashboardLayout.tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import { FaTachometerAlt, FaBuilding, FaBoxOpen, FaSignOutAlt, FaTags, FaUsers, FaChartBar, FaHistory } from 'react-icons/fa';

const DashboardLayout: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const linkStyles = "flex items-center px-4 py-2 text-scorpion rounded-md hover:bg-gin transition-colors duration-200 border-l-4 border-transparent";
  const activeLinkStyles = "bg-gin text-salem font-bold border-salem";

  return (
    <div className="flex h-screen bg-gin">
      <aside className="w-64 flex-shrink-0 bg-white shadow-md flex flex-col">
        <div className="p-4">
          <img src={logo} alt="Company Logo" className="w-24 mx-auto" />
        </div>
        <nav className="p-2 flex-1">
          <NavLink to="/" end className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/estates" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaBuilding className="mr-3" />
            Estates
          </NavLink>
          <NavLink to="/buildings" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaBuilding className="mr-3" />
            Buildings
          </NavLink>
          <NavLink to="/items" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaBoxOpen className="mr-3" />
            Items
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaTags className="mr-3" />
            Categories
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaUsers className="mr-3" />
            Users
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaChartBar className="mr-3" />
            Reports
          </NavLink>
          <NavLink to="/audit-logs" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            <FaHistory className="mr-3" />
            Audit Logs
          </NavLink>
        </nav>
        <div className="p-4">
          <Button onClick={handleLogout} variant="secondary" className="w-full flex items-center justify-center">
            <FaSignOutAlt className="mr-2" />
            Logout
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
