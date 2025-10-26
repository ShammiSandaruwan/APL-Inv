// src/layout/DashboardLayout.tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/Button';
import logo from '../assets/logo.png';

const DashboardLayout: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const linkStyles = "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gin";
  const activeLinkStyles = "bg-salem text-white";

  return (
    <div className="flex h-screen bg-gin">
      <aside className="w-64 flex-shrink-0 bg-white shadow-md">
        <div className="p-4">
          <img src={logo} alt="Company Logo" className="w-24 mx-auto" />
        </div>
        <nav className="p-2">
          <NavLink to="/" end className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/estates" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            Estates
          </NavLink>
          <NavLink to="/buildings" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            Buildings
          </NavLink>
          <NavLink to="/items" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
            Items
          </NavLink>
        </nav>
        <div className="p-4 absolute bottom-0 w-64">
          <Button onClick={handleLogout} variant="secondary" className="w-full">
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
