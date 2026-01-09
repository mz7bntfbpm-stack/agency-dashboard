import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Calendar, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  FileBarChart,
  Users,
  TrendingUp
} from 'lucide-react'
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters'

const Reports = ({ data }) => {
  const [generating, setGenerating] = useState(false)
  const [reportType, setReportType] = useState('performance')
  const [selectedClient, setSelectedClient] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [emailRecipients, setEmailRecipients] = useState('')
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly')
  const [scheduled, setScheduled] = useState(false)

  const reportTypes = [
    { id: 'performance', name: 'Performance Report', description: 'Complete overview of campaign metrics' },
    { id: 'financial', name: 'Financial Report', description: 'Spend, revenue, and ROI breakdown' },
    { id: 'executive', name: 'Executive Summary', description: 'High-level KPIs for stakeholders' },
    { id: 'detailed', name: 'Detailed Analysis', description: 'In-depth metrics and trends' },
  ]

  const clients = [
    { id: 'all', name: 'All Clients' },
    ...data.clients
  ]

  const handleGenerateReport = async () => {
    setGenerating(true)
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setGenerating(false)
    alert('Report generated successfully! Download started.')
  }

  const handleScheduleReport = () => {
    if (!emailRecipients.trim()) {
      alert('Please enter at least one email recipient')
      return
    }
    
    setScheduled(true)
    setTimeout(() => setScheduled(false), 3000)
  }

  // Sample report preview data
  const reportPreview = {
    totalSpend: data.campaigns.reduce((sum, c) => sum + c.budget * 30, 0),
    totalConversions: 1247,
    avgRoas: 3.2,
    topCampaign: 'Q4 SaaS Lead Gen',
    period: `${formatDate(new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString())} - ${formatDate(new Date().toISOString())}`
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 mt-1">Generate and schedule automated reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    reportType === type.id
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-dark-700/30 border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      reportType === type.id ? 'bg-blue-500' : 'bg-dark-600'
                    }`}>
                      <FileBarChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${reportType === type.id ? 'text-blue-400' : 'text-white'}`}>
                        {type.name}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Settings */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Report Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Report */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generate Report</h3>
              <span className="text-sm text-slate-400">PDF format</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Report
                  </>
                )}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-dark-700 border border-dark-600 hover:border-blue-500 text-white rounded-lg font-medium transition-colors">
                <Mail className="w-5 h-5" />
                Email Report
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Preview */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Report Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Period</span>
                <span className="text-white">{reportPreview.period}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Spend</span>
                <span className="text-white font-medium">{formatCurrency(reportPreview.totalSpend)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Conversions</span>
                <span className="text-white font-medium">{formatNumber(reportPreview.totalConversions)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Avg. ROAS</span>
                <span className="text-emerald-400 font-medium">{reportPreview.avgRoas}x</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Top Campaign</span>
                <span className="text-white font-medium truncate max-w-[120px]">{reportPreview.topCampaign}</span>
              </div>
            </div>
          </div>

          {/* Schedule Report */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Schedule Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Email Recipients
                </label>
                <input
                  type="text"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="email@example.com, ..."
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setScheduleFrequency(freq)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        scheduleFrequency === freq
                          ? 'bg-blue-500 text-white'
                          : 'bg-dark-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleScheduleReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                {scheduled ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Scheduled!
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Schedule Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {[
                { name: 'Monthly Performance - Dec 2024', date: 'Dec 31, 2024', status: 'completed' },
                { name: 'Q4 Executive Summary', date: 'Dec 28, 2024', status: 'completed' },
                { name: 'Weekly Report - Week 52', date: 'Dec 27, 2024', status: 'completed' },
              ].map((report, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{report.name}</p>
                      <p className="text-xs text-slate-500">{report.date}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 hover:text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
