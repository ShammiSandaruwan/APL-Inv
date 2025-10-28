// src/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import { FaTachometerAlt, FaBuilding, FaBoxOpen, FaSignOutAlt, FaTags, FaUsers, FaChartBar, FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth'; // Get user info
import Header from './Header';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const baseLink = "flex items-center justify-between text-neutral-500 rounded-lg hover:bg-primary-light hover:text-primary transition-all duration-200";
  const linkStyles = `${baseLink} py-3 px-4`;
  const collapsedLinkStyles = `${baseLink} h-12 w-12 justify-center`;
  const activeLinkStyles = "bg-gradient-to-r from-primary to-blue-400 text-white font-semibold shadow-lg shadow-primary/30";

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ease-in-out bg-card border-r border-border flex flex-col ${isCollapsed ? 'w-24' : 'w-72'}`}>
        <div className="p-6 flex items-center">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <img src={logo} alt="Company Logo" className="w-8 h-8" />
          </div>
          {!isCollapsed && <span className="ml-4 text-xl font-bold">Your App</span>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-neutral-400 hover:text-primary ml-auto">
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {[
            { to: "/", icon: FaTachometerAlt, label: "Dashboard" },
            { to: "/estates", icon: FaBuilding, label: "Estates", badge: 15 },
            { to: "/buildings", icon: FaBuilding, label: "Buildings" },
            { to: "/items", icon: FaBoxOpen, label: "Items", badge: 248 },
            { to: "/categories", icon: FaTags, label: "Categories" },
            { to: "/users", icon: FaUsers, label: "Users" },
            { to: "/reports", icon: FaChartBar, label: "Reports" },
            { to: "/audit-logs", icon: FaHistory, label: "Audit Logs" },
          ].map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => `${isCollapsed ? collapsedLinkStyles : linkStyles} ${isActive ? activeLinkStyles : ''}`}>
              <div className="flex items-center">
                <link.icon className={`text-xl ${!isCollapsed ? 'mr-4' : ''}`} />
                {!isCollapsed && <span>{link.label}</span>}
              </div>
              {!isCollapsed && link.badge && (
                <span className="text-xs font-bold bg-secondary-light text-secondary rounded-full px-2 py-0.5">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="User" />
            {!isCollapsed && (
              <div className="ml-4">
                <p className="text-sm font-semibold text-text-primary">{profile?.full_name || 'Admin User'}</p>
                <p className="text-xs text-text-secondary">{profile?.role || 'Super Admin'}</p>
              </div>
            )}
            <Button onClick={handleLogout} variant="secondary" size="sm" className="ml-auto">
              <FaSignOutAlt />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
