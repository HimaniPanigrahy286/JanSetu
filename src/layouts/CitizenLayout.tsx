import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const navItems = [
  {
    to: '/citizen/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/citizen/submit',
    label: 'Submit Request',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    to: '/citizen/voice',
    label: 'Voice Input',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  },
  {
    to: '/citizen/requests',
    label: 'My Requests',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: '/citizen/profile',
    label: 'My Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
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
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Top Nav */}
      <header className="bg-brand-yellow border-b-2 border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black">
              <svg className="w-5 h-5 fill-brand-yellow" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-base tracking-tight">JANSETU</span>
              <span className="text-[9px] font-bold tracking-wider uppercase text-black/70">Citizen Portal</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-black text-white border-black shadow-brutal-sm'
                      : 'bg-transparent text-black border-transparent hover:border-black hover:bg-white/50'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: user & logout */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black rounded-lg shadow-brutal-sm">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-brand-yellow text-xs font-extrabold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-bold">{user.name.split(' ')[0]}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="btn-brutal-primary px-3 py-2 text-xs font-bold rounded-lg"
            >
              Sign Out
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 border-2 border-black rounded-lg bg-white/50 font-bold"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-yellow border-b-2 border-black z-30 fixed top-16 left-0 right-0">
          <div className="px-4 py-3 space-y-1">
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b-2 border-black/20 mb-2">
                <div className="w-10 h-10 bg-black border-2 border-black rounded-full flex items-center justify-center text-brand-yellow text-lg font-extrabold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-black/60">{user.location}</p>
                </div>
              </div>
            )}
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg font-bold text-sm border-2 ${
                    isActive ? 'bg-black text-white border-black' : 'bg-white/50 border-transparent hover:border-black'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
