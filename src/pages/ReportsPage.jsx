import { useState } from 'react'
import { FileText, Download, Mail, Calendar, CheckCircle, Loader2 } from 'lucide-react'

const formatCurrency = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value)
const formatNumber = (value) => new Intl.NumberFormat('de-DE').format(value)

export default function ReportsPage({ data }) {
  const [generating, setGenerating] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState('')
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly')
  const [scheduled, setScheduled] = useState(false)

  const safeData = data || { campaigns: [], clients: [] }
  
  // Calculate totals
  const totals = safeData.campaigns.reduce((acc, campaign) => {
    acc.budget += campaign.budget || 0
    return acc
  }, { budget: 0 })

  const reportTypes = [
    { id: 'performance', name: 'Performance Report', desc: 'Complete overview of campaign metrics' },
    { id: 'financial', name: 'Financial Report', desc: 'Spend, revenue, and ROI breakdown' },
    { id: 'executive', name: 'Executive Summary', desc: 'High-level KPIs for stakeholders' },
    { id: 'detailed', name: 'Detailed Analysis', desc: 'In-depth metrics and trends' },
  ]

  const handleGenerateReport = async () => {
    setGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 mt-1">Generate and schedule automated reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map(type => (
                <button key={type.id} className="p-4 rounded-lg border bg-dark-700/30 border-dark-600 hover:border-blue-500 text-left transition-colors">
                  <p className="font-medium text-white">{type.name}</p>
                  <p className="text-sm text-slate-400 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Report */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generate Report</h3>
              <span className="text-sm text-slate-400">PDF format</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleGenerateReport} disabled={generating} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                {generating ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <><Download className="w-5 h-5" />Download Report</>}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-dark-700 border border-dark-600 hover:border-blue-500 text-white rounded-lg font-medium transition-colors">
                <Mail className="w-5 h-5" />Email Report
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Preview */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Report Preview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-400">Total Spend</span><span className="text-white font-medium">{formatCurrency(totals.budget * 30)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Est. Conversions</span><span className="text-white font-medium">{formatNumber(Math.round(totals.budget * 30 * 0.1))}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Est. ROAS</span><span className="text-emerald-400 font-medium">3.2x</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Active Campaigns</span><span className="text-white font-medium">{safeData.campaigns.filter(c => c.status === 'active').length}</span></div>
            </div>
          </div>

          {/* Schedule Report */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Schedule Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Recipients</label>
                <input type="text" value={emailRecipients} onChange={(e) => setEmailRecipients(e.target.value)} placeholder="email@example.com, ..." className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['daily', 'weekly', 'monthly'].map(freq => (
                    <button key={freq} onClick={() => setScheduleFrequency(freq)} className={`px-3 py-2 rounded-lg text-sm capitalize ${scheduleFrequency === freq ? 'bg-blue-500 text-white' : 'bg-dark-700 text-slate-400'}`}>{freq}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleScheduleReport} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                {scheduled ? <><CheckCircle className="w-5 h-5" />Scheduled!</> : <><Calendar className="w-5 h-5" />Schedule Report</>}
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
            <div className="space-y-2">
              {[
                { name: 'Monthly Performance - Dec 2024', date: 'Dec 31, 2024' },
                { name: 'Q4 Executive Summary', date: 'Dec 28, 2024' },
                { name: 'Weekly Report - Week 52', date: 'Dec 27, 2024' },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{report.name}</p>
                      <p className="text-xs text-slate-500">{report.date}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
