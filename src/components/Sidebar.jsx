import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Upload, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/import', icon: Upload, label: 'Import Data' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-dark-800 border-r border-dark-700 transition-all duration-300 z-50 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="animate-fadeIn">
              <h1 className="font-bold text-lg text-white">AgencyMetrics</h1>
              <p className="text-xs text-slate-400">Analytics Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-dark-700'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="font-medium animate-fadeIn">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
        >
          {isOpen ? (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Quick Stats (when expanded) */}
      {isOpen && (
        <div className="px-4 pb-4 animate-fadeIn">
          <div className="bg-dark-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Quick Stats</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Active Campaigns</span>
                <span className="text-white font-medium">9</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Clients</span>
                <span className="text-white font-medium">5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
