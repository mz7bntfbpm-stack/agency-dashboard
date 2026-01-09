import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Moon, 
  Sun,
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react'

const Header = ({ toggleSidebar, isAdmin, toggleAdminMode, sidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifications = [
    { id: 1, title: 'Campaign Alert', message: 'TechCorp Q4 campaign reached budget limit', time: '2h ago', type: 'warning' },
    { id: 2, title: 'New Conversion', message: 'Fashion Forward received 50 conversions today', time: '4h ago', type: 'success' },
    { id: 3, title: 'Report Ready', message: 'Monthly performance report is ready', time: '1d ago', type: 'info' },
  ]

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-sm border-b border-dark-700 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search campaigns, clients..."
            className="w-80 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Admin Toggle */}
        <button
          onClick={toggleAdminMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
            isAdmin
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-dark-700 text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">{isAdmin ? 'Admin Mode' : 'User Mode'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 animate-fadeIn">
              <div className="p-3 border-b border-dark-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="p-3 border-b border-dark-700 hover:bg-dark-700 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                        notification.type === 'warning' ? 'bg-amber-500' :
                        notification.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2">
                <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 animate-fadeIn">
              <div className="p-3 border-b border-dark-700">
                <p className="font-medium text-white">John Doe</p>
                <p className="text-sm text-slate-400">Account Manager</p>
              </div>
              <div className="p-2">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-lg">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        ></div>
      )}
    </header>
  )
}

export default Header
