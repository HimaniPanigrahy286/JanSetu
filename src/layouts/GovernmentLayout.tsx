import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Table,
  MapPin,
  Award,
  FolderKanban,
  Activity,
  Database,
  Bell,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { authService } from '../services/authService';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import NotificationDrawer from '../components/common/NotificationDrawer';
import type { AppNotification } from '../types';

const navItems = [
  {
    to: '/government/overview',
    label: 'Overview',
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: '/government/requests',
    label: 'All Citizen Requests',
    icon: <Table size={18} />,
  },
  {
    to: '/government/hotspots',
    label: 'Demand Hotspots',
    icon: <MapPin size={18} />,
  },
  {
    to: '/government/regions',
    label: 'Region Analysis',
    icon: <Globe size={18} />,
  },
  {
    to: '/government/recommendations',
    label: 'Priority Ranking',
    icon: <Award size={18} />,
  },
  {
    to: '/government/projects',
    label: 'Projects Pipeline',
    icon: <FolderKanban size={18} />,
  },
  {
    to: '/government/impact',
    label: 'Impact Dashboard',
    icon: <Activity size={18} />,
  },
  {
    to: '/government/datasources',
    label: 'Data Sources',
    icon: <Database size={18} />,
  },
];

export default function GovernmentLayout() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {
    id: 'u2',
    name: 'Rajiv Mehta',
    email: 'official@demo.com',
    role: 'official',
    location: 'Bhubaneswar, Odisha',
    language: 'English',
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/government/requests?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex font-body bg-gray-100 text-black">
      {/* Neo-Brutalist Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-brand-charcoal text-white flex flex-col transition-all duration-300 shrink-0 h-screen sticky top-0 border-r-2 border-black z-30 select-none`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-18 flex items-center px-4 border-b-2 border-black bg-brand-yellow text-black">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer overflow-hidden">
            <div className="w-9 h-9 bg-black flex items-center justify-center border-2 border-black shrink-0 shadow-brutal-sm">
              <svg className="w-5 h-5 fill-brand-yellow" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col leading-none">
                <span className="font-heading font-extrabold text-base tracking-tight text-black">JANSETU</span>
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-black/75 mt-0.5">
                  MP Intelligence
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto w-7 h-7 bg-white border-2 border-black rounded-lg flex items-center justify-center text-black font-extrabold shadow-brutal-sm hover:bg-black hover:text-white transition-colors cursor-pointer shrink-0"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin space-y-1.5 px-3">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-extrabold border-2 ${
                  isActive
                    ? 'bg-brand-yellow text-black border-black shadow-brutal-sm'
                    : 'text-brand-sage border-transparent hover:bg-white/10 hover:text-white hover:border-white/20'
                } ${!sidebarOpen ? 'justify-center px-0' : ''}`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Official User Profile Footer */}
        <div className="border-t-2 border-black/40 p-3 space-y-2 bg-black/40">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 p-2 bg-white/10 border border-white/20 rounded-xl">
              <div className="w-8 h-8 bg-brand-yellow text-black border border-black rounded-lg flex items-center justify-center font-heading font-extrabold text-sm shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="text-white font-extrabold text-xs truncate">{user.name}</p>
                <p className="text-brand-yellow text-[10px] font-bold truncate">Divya Prasad / MP Admin</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sign Out' : undefined}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl border border-red-500 transition-all text-xs font-extrabold cursor-pointer ${
              !sidebarOpen ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut size={14} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Intelligence Header Bar (inspired by reference dashboard) */}
        <header className="h-18 bg-white border-b-2 border-black px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Global Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Search citizen complaints, districts, keywords..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black"
            />
          </form>

          {/* Right Intelligence Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Live Telemetry Beacon */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-brand-yellow/30 border-2 border-black rounded-xl text-xs font-extrabold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>GIS Live Telemetry</span>
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center hover:bg-brand-yellow transition-colors shadow-brutal-sm cursor-pointer"
              title="Official Alerts"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white border-2 border-black rounded-full text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Official Profile Badge (Reference screenshot match: Divya Prasad / Admin) */}
            <div className="flex items-center gap-2.5 pl-2 border-l-2 border-black/20">
              <div className="w-9 h-9 bg-brand-yellow border-2 border-black rounded-xl flex items-center justify-center font-heading font-extrabold text-sm shadow-brutal-sm">
                DP
              </div>
              <div className="hidden md:block leading-none text-left">
                <p className="font-heading font-extrabold text-xs">Divya Prasad</p>
                <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider mt-0.5">MP Official Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Notifications Drawer */}
        <NotificationDrawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onNotificationClick={notif => {
            setNotifications(prev => prev.map(n => (n.id === notif.id ? { ...n, read: true } : n)));
            if (notif.link) {
              setNotificationsOpen(false);
              navigate(notif.link);
            }
          }}
        />

        {/* Dashboard Page Route Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
