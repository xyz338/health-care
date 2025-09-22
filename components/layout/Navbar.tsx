import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-teal-600 font-semibold' : 'text-gray-600 hover:bg-slate-200 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 tracking-wider">
              Health<span className="text-teal-600">Care</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
                {isAuthenticated && user?.role === Role.Patient && <NavLink to="/appointments" className={navLinkClasses}>My Appointments</NavLink>}
                {isAuthenticated && user?.role === Role.Doctor && <NavLink to="/doctor-dashboard" className={navLinkClasses}>Dashboard</NavLink>}
                {isAuthenticated && user?.role === Role.Admin && <NavLink to="/admin-dashboard" className={navLinkClasses}>Admin Panel</NavLink>}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm hidden sm:block">Welcome, {user?.name}</span>
                <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;