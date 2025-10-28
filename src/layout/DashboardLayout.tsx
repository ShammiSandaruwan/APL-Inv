// src/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import { FaTachometerAlt, FaBuilding, FaBoxOpen, FaSignOutAlt, FaTags, FaUsers, FaChartBar, FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth'; // Get user info

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const baseLink = "flex items-center text-text-secondary rounded-lg hover:bg-primary-light hover:text-primary transition-all duration-200";
  const linkStyles = `${baseLink} py-2.5 px-4`;
  const collapsedLinkStyles = `${baseLink} h-10 w-10 justify-center`;
  const activeLinkStyles = "bg-primary-light text-primary font-semibold";

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ease-in-out bg-card border-r border-border flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <img src={logo} alt="Company Logo" className="w-32 transition-opacity duration-300" />}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-text-secondary hover:text-primary">
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { to: "/", icon: FaTachometerAlt, label: "Dashboard" },
            { to: "/estates", icon: FaBuilding, label: "Estates" },
            { to: "/buildings", icon: FaBuilding, label: "Buildings" },
            { to: "/items", icon: FaBoxOpen, label: "Items" },
            { to: "/categories", icon: FaTags, label: "Categories" },
            { to: "/users", icon: FaUsers, label: "Users" },
            { to: "/reports", icon: FaChartBar, label: "Reports" },
            { to: "/audit-logs", icon: FaHistory, label: "Audit Logs" },
          ].map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => `${isCollapsed ? collapsedLinkStyles : linkStyles} ${isActive ? activeLinkStyles : ''}`}>
              <link.icon className={`text-lg ${!isCollapsed ? 'mr-4' : ''}`} />
              {!isCollapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className={`flex items-center ${isCollapsed ? 'flex-col' : ''}`}>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{profile?.full_name}</p>
                <p className="text-xs text-text-secondary">{profile?.role}</p>
              </div>
            )}
            <Button onClick={handleLogout} variant="secondary" size="sm" className={`mt-2 ${isCollapsed ? '' : 'ml-2'}`}>
              <FaSignOutAlt />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
