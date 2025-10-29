// src/layout/Header.tsx
import React from 'react';
import { Burger } from '@mantine/core';
import { FaSearch, FaBell } from 'react-icons/fa';

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <header className="bg-card border-b border-border p-6 flex items-center justify-between">
      <Burger
        opened={isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
        size="sm"
        hiddenFrom="sm"
      />
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full bg-background border border-border rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-6">
        <button className="relative text-neutral-500 hover:text-primary transition-colors">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-danger border-2 border-card"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
