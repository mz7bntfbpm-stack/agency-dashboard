import { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Save,
  Loader2
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@agency.com',
    role: 'Account Manager',
    timezone: 'Europe/Berlin',
    currency: 'EUR'
  })

  const [notifications, setNotifications] = useState({
    emailReports: true,
    campaignAlerts: true,
    budgetWarnings: true,
    weeklyDigest: false,
    pushNotifications: true
  })

  const [apiKeys, setApiKeys] = useState({
    googleAds: '',
    facebookAds: '',
    ga4: ''
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-dark-800/50 border border-dark-700 rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white hover:border-blue-500 transition-colors">
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                    <select
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>Admin</option>
                      <option>Account Manager</option>
                      <option>Analyst</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailReports', label: 'Email Reports', description: 'Receive scheduled reports via email' },
                  { key: 'campaignAlerts', label: 'Campaign Alerts', description: 'Get notified when campaigns need attention' },
                  { key: 'budgetWarnings', label: 'Budget Warnings', description: 'Alerts when campaigns approach budget limits' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of performance every Monday' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser notifications for important events' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key] ? 'bg-blue-500' : 'bg-dark-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">API Integrations</h2>
              
              <div className="space-y-6">
                {[
                  { key: 'googleAds', label: 'Google Ads API', description: 'Connect to fetch Google Ads performance data', icon: '🔍' },
                  { key: 'facebookAds', label: 'Facebook Marketing API', description: 'Import Facebook and Instagram ad metrics', icon: '📘' },
                  { key: 'ga4', label: 'Google Analytics 4', description: 'Sync GA4 audience and conversion data', icon: '📊' },
                ].map((integration) => (
                  <div key={integration.key} className="p-4 bg-dark-700/30 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium text-white">{integration.label}</p>
                        <p className="text-sm text-slate-400">{integration.description}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          Connected
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">API Key / Token</label>
                      <input
                        type="password"
                        value={apiKeys[integration.key]}
                        onChange={(e) => setApiKeys({ ...apiKeys, [integration.key]: e.target.value })}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Appearance</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Dark', color: '#0f172a' },
                      { id: 'light', label: 'Light', color: '#f8fafc' },
                      { id: 'system', label: 'System', color: 'linear-gradient(135deg, #0f172a 50%, #f8fafc 50%)' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        className="p-4 rounded-lg border-2 border-dark-600 hover:border-blue-500 transition-colors text-center"
                      >
                        <div 
                          className="w-full h-12 rounded-lg mb-2"
                          style={{ background: theme.color }}
                        ></div>
                        <span className="text-sm text-white">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Dashboard Layout</label>
                  <select className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option>Compact</option>
                    <option>Comfortable</option>
                    <option>Spacious</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Default Date Range</label>
                  <select className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 14 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Security</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-dark-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-dark-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-white">Change Password</p>
                      <p className="text-sm text-slate-400">Update your account password</p>
                    </div>
                    <button className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg text-sm font-medium transition-colors">
                      Change
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-dark-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Active Sessions</p>
                      <p className="text-sm text-slate-400">Manage your logged-in devices</p>
                    </div>
                    <button className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg text-sm font-medium transition-colors">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && (
              <span className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                Settings saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
