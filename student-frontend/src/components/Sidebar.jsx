import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBook, FiCheckSquare, FiAward, FiX } from 'react-icons/fi';

export default function Sidebar({ onClose }) {
  return (
    <aside className="sidebar">
      {/* Brand Header with Mobile Close (X) Button */}
      <div className="brand">
        <h2>Menu</h2>
        <button 
          className="sidebar-close-btn" 
          onClick={onClose} 
          aria-label="Close Navigation Menu"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Navigation Links (Auto-closes drawer on mobile when clicked) */}
      <nav className="nav-menu">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/students" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <FiUsers className="nav-icon" />
          <span>Students</span>
        </NavLink>

        <NavLink 
          to="/courses" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <FiBook className="nav-icon" />
          <span>Courses</span>
        </NavLink>

        <NavLink 
          to="/attendance" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <FiCheckSquare className="nav-icon" />
          <span>Attendance</span>
        </NavLink>

        <NavLink 
          to="/marks" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <FiAward className="nav-icon" />
          <span>Marks</span>
        </NavLink>
      </nav>
    </aside>
  );
}