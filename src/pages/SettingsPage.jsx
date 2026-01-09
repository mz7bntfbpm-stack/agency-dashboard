import { useState } from 'react';
import { 
  Building2, 
  Bell, 
  RefreshCw, 
  Globe, 
  Shield, 
  Download,
  Save,
  Check
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('agency');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'agency', label: 'Agency', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Sync', icon: RefreshCw },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your agency dashboard preferences and configurations</p>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="flex border-b border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'agency' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Agency Name</label>
                  <input
                    type="text"
                    defaultValue="Digital Marketing Agency"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                  <input
                    type="email"
                    defaultValue="agency@example.com"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                  <select className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Eastern Time (ET)</option>
                    <option>Pacific Time (PT)</option>
                    <option>Central European Time (CET)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                <textarea
                  rows={3}
                  defaultValue="123 Marketing Street, Suite 100, New York, NY 10001"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" defaultChecked className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                <label htmlFor="active" className="text-sm text-slate-300">Agency is active and accepting new clients</label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                {[
                  { label: 'Campaign performance alerts', desc: 'Get notified when campaigns exceed thresholds', checked: true },
                  { label: 'Budget warnings', desc: 'Alert when campaigns approach budget limits', checked: true },
                  { label: 'Weekly reports', desc: 'Receive weekly performance summaries', checked: true },
                  { label: 'New client onboarding', desc: 'Notifications for new client setups', checked: false },
                  { label: 'System updates', desc: 'Important platform announcements', checked: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-slate-900/30 rounded-lg">
                    <input type="checkbox" defaultChecked={item.checked} className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Alert Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Budget Alert (%)</label>
                    <input
                      type="number"
                      defaultValue={80}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Alert when spending reaches this percentage of budget</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">ROAS Alert Threshold</label>
                    <input
                      type="number"
                      defaultValue={2}
                      step="0.1"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Alert when ROAS drops below this value</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="text-blue-400" size={24} />
                    <h3 className="text-lg font-medium text-white">Data Refresh</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Auto-refresh Interval</label>
                      <select className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Every 15 minutes</option>
                        <option>Every 30 minutes</option>
                        <option>Every hour</option>
                        <option>Every 6 hours</option>
                        <option>Daily</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                      <label className="text-sm text-slate-300">Enable real-time updates for active campaigns</label>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-medium text-white">Data Export</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Default Export Format</label>
                      <select className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>CSV</option>
                        <option>Excel (.xlsx)</option>
                        <option>PDF</option>
                        <option>JSON</option>
                      </select>
                    </div>
                    <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Download size={18} />
                      Export All Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/30 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-4">Data Retention</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Raw Data (days)</label>
                    <input
                      type="number"
                      defaultValue={90}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Aggregated Data (months)</label>
                    <input
                      type="number"
                      defaultValue={24}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Report Archive (months)</label>
                    <input
                      type="number"
                      defaultValue={12}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Google Ads', status: 'connected', icon: '🔵' },
                  { name: 'Facebook Ads', status: 'connected', icon: '🔷' },
                  { name: 'Google Analytics 4', status: 'connected', icon: '🟢' },
                  { name: 'LinkedIn Ads', status: 'disconnected', icon: '🔵' },
                  { name: 'TikTok Ads', status: 'disconnected', icon: '⚫' },
                  { name: 'Google Looker Studio', status: 'connected', icon: '🟡' },
                ].map((integration, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        integration.status === 'connected' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-600/50 text-slate-400'
                      }`}>
                        {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-white mb-2">{integration.name}</h4>
                    <button className={`w-full py-2 text-sm rounded-lg transition-colors ${
                      integration.status === 'connected'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                    }`}>
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900/30 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-4">API Access</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-400"
                      />
                      <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                    <label className="text-sm text-slate-300">Enable API access for custom integrations</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900/30 rounded-xl">
                  <h3 className="text-lg font-medium text-white mb-4">Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-400">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Session Timeout</p>
                        <p className="text-xs text-slate-400">Auto logout after inactivity</p>
                      </div>
                      <select className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>8 hours</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/30 rounded-xl">
                  <h3 className="text-lg font-medium text-white mb-4">Access Control</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                      <label className="text-sm text-slate-300">Require strong passwords</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                      <label className="text-sm text-slate-300">Force password reset every 90 days</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500" />
                      <label className="text-sm text-slate-300">Allow single sign-on (SSO)</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/30 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-4">Audit Log</h3>
                <p className="text-sm text-slate-400 mb-4">Recent activity and security events</p>
                <div className="space-y-2">
                  {[
                    { action: 'User login', user: 'john@agency.com', time: '2 minutes ago', ip: '192.168.1.1' },
                    { action: 'API key generated', user: 'admin@agency.com', time: '1 hour ago', ip: '192.168.1.1' },
                    { action: 'Settings updated', user: 'sarah@agency.com', time: '3 hours ago', ip: '192.168.1.45' },
                    { action: 'Failed login attempt', user: 'unknown', time: '5 hours ago', ip: '45.33.32.156' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{log.action}</p>
                        <p className="text-xs text-slate-400">{log.user} • {log.ip}</p>
                      </div>
                      <span className="text-xs text-slate-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
