import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Bell, X, CheckCircle, MessageSquare, AlertTriangle, Settings, School } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  icon?: React.ReactNode;
}

export default function UserLayout() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const location = useLocation();
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  const [notifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Grade Update Completed',
      message: 'Your grade update request for Class 10B has been processed successfully.',
      type: 'success',
      timestamp: '2 minutes ago',
      read: false,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: '2',
      title: 'New Message from Admin',
      message: 'Admin has responded to your attendance record query. Please review their response.',
      type: 'info',
      timestamp: '10 minutes ago',
      read: false,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      id: '3',
      title: 'Document Required',
      message: 'Action required: Please upload the missing student ID for registration request #1234.',
      type: 'warning',
      timestamp: '1 hour ago',
      read: true,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM EST.',
      type: 'info',
      timestamp: '2 hours ago',
      read: true,
      icon: <Settings className="h-5 w-5 text-gray-500" />
    }
  ]);

  // Close notifications when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          currentPage={location.pathname.split('/')[1] || 'dashboard'}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:left-64 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-x-2 lg:hidden">
            <School className="h-8 w-8 text-blue-600 shrink-0" />
            <span className="text-lg font-semibold text-gray-900">Portal</span>
          </div>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>

            {/* Notifications */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                          <p className="text-sm text-gray-500">You have {unreadCount} unread messages</p>
                        </div>
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => setShowNotifications(false)}
                        >
                          <span className="sr-only">Close notifications</span>
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-4 divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`group relative py-4 transition-colors duration-200 hover:bg-gray-50 ${
                              notification.read ? 'opacity-75' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {notification.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${
                                    notification.read ? 'text-gray-900' : 'text-blue-600'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <div className="ml-2 flex flex-shrink-0">
                                    <p className="text-xs text-gray-500">{notification.timestamp}</p>
                                  </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                  {notification.message}
                                </p>
                                {!notification.read && (
                                  <div className="mt-2 flex items-center space-x-2">
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-500">
                                      Mark as read
                                    </button>
                                    <span className="text-gray-300">•</span>
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-500">
                                      View details
                                    </button>
                                  </div>
                                )}
                              </div>
                              {!notification.read && (
                                <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-600"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <button
                          type="button"
                          className="block w-full rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-screen bg-gray-50 pt-16">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}