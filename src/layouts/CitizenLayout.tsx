import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Send, Mic, List, User, LogOut,
  Building2, Menu, X, Bell, ChevronRight
} from 'lucide-react';
import { authService } from '../services/authService';

const navItems = [
  { to: '/citizen/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/citizen/submit', icon: Send, label: 'Submit Request' },
  { to: '/citizen/voice', icon: Mic, label: 'Voice Request' },
  { to: '/citizen/requests', icon: List, label: 'My Requests' },
  { to: '/citizen/profile', icon: User, label: 'Profile' },
];

export default function CitizenLayout() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">NexGen Gov</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-down mobile menu */}
      {menuOpen && (
        <div className="bg-white border-b border-slate-200 shadow-lg z-30 fixed top-14 left-0 right-0">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg mt-2 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-lg">
        <div className="max-w-md mx-auto flex">
          {navItems.slice(0, 4).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-50' : ''}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="mt-0.5 font-medium leading-none">{item.label.split(' ')[0]}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center py-2 text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            <div className="p-1.5 rounded-lg">
              <LogOut size={20} />
            </div>
            <span className="mt-0.5 font-medium leading-none">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
