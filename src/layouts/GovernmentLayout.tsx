import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, MapPin, Map, Sparkles,
  FolderKanban, TrendingUp, Database, LogOut, Building2,
  Search, Bell, ChevronDown, Globe, Menu, X
} from 'lucide-react';
import { authService } from '../services/authService';

const navItems = [
  { to: '/government/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/government/requests', icon: FileText, label: 'Requests' },
  { to: '/government/hotspots', icon: MapPin, label: 'Demand Hotspots' },
  { to: '/government/regions', icon: Map, label: 'Regions' },
  { to: '/government/recommendations', icon: Sparkles, label: 'AI Recommendations' },
  { to: '/government/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/government/impact', icon: TrendingUp, label: 'Impact' },
  { to: '/government/datasources', icon: Database, label: 'Data Sources' },
];

export default function GovernmentLayout() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-slate-900 flex flex-col transition-all duration-300 shrink-0 h-screen sticky top-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700/50">
          <div className="bg-blue-500 rounded-lg p-2 shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">NexGen Gov</p>
              <p className="text-blue-400 text-xs">Official Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg mb-0.5 transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-slate-700/50 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-slate-400 text-xs truncate">Gov. Official</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors" title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="flex justify-center w-full text-slate-400 hover:text-red-400 p-1.5 rounded transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search regions, requests, projects..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Country Selector */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-200 transition-colors">
              <Globe size={15} className="text-slate-500" />
              <span className="text-sm text-slate-700 font-medium">India</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Region Selector */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-200 transition-colors">
              <MapPin size={15} className="text-slate-500" />
              <span className="text-sm text-slate-700 font-medium">All Regions</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white text-xs font-bold">{user?.name.charAt(0)}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
