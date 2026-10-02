import React from 'react';
import { FiMenu } from 'react-icons/fi';

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
        >
          <FiMenu size={22} />
        </button>
        <h2 className="header-title">Student Management System</h2>
      </div>
    </header>
  );
}