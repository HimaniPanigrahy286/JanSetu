import { Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';
import type { AppNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: AppNotification) => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert size={16} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-orange-600" />;
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white h-full border-l-2 border-black flex flex-col shadow-brutal-xl animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-brand-yellow p-4 md:p-5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black border-2 border-black rounded-lg flex items-center justify-center text-brand-yellow">
              <Bell size={16} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base leading-none">NOTIFICATIONS</h3>
              <p className="text-[11px] font-bold text-black/60 mt-0.5">
                {notifications.filter(n => !n.read).length} Unread Updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center font-extrabold hover:bg-black hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && onMarkAllAsRead && (
          <div className="px-5 py-2.5 bg-gray-50 border-b border-black/10 flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-black/60">Recent Feed</span>
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-extrabold text-black hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="text-4xl">🔔</div>
              <p className="font-heading font-extrabold text-base">No New Notifications</p>
              <p className="text-xs font-medium text-black/60">You are all caught up with government actions and updates.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => onNotificationClick && onNotificationClick(n)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  !n.read
                    ? 'bg-brand-yellow/20 border-black shadow-brutal-sm'
                    : 'bg-white border-black/20 hover:border-black'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-brutal-sm">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="font-bold text-xs text-black truncate">{n.title}</p>
                      <span className="text-[10px] font-mono font-bold text-black/50 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs font-medium text-black/80 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-gray-50 border-t-2 border-black flex justify-end">
          <button onClick={onClose} className="btn-brutal-secondary w-full py-2.5 text-xs font-extrabold rounded-xl">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
