import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  HelpCircle,
  LogOut,
  X,
  School
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onClose: () => void;
}

export default function Sidebar({ currentPage, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'New Request', icon: FileText, path: '/services' },
    { name: 'My Projects', icon: FolderOpen, path: '/projects' },
    { name: 'Support Tickets', icon: MessageSquare, path: '/tickets' },
    { name: 'Help & Resources', icon: HelpCircle, path: '/help' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white shadow-xl ring-1 ring-gray-200">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-x-3">
          <School className="h-8 w-8 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">Portal</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
        >
          <span className="sr-only">Close sidebar</span>
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto bg-white px-3 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={onClose}
            >
              <item.icon className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                currentPage === item.path.substring(1)
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-900'
              }`} />
              {item.name}
              {currentPage === item.path.substring(1) && (
                <span className="absolute inset-y-0 left-0 w-1 rounded-r-lg bg-blue-600" />
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* User Profile & Logout */}
      <div className="mt-auto border-t border-gray-200 bg-white px-3 py-4">
        <div className="flex items-center gap-x-4 px-2 py-3 rounded-lg hover:bg-gray-50">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">JD</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">John Doe</p>
            <p className="truncate text-xs text-gray-500">Science Teacher</p>
          </div>
          <button 
            onClick={handleLogout}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}