import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, DollarSign, Target, TrendingUp, ShoppingCart, Eye, MousePointer, ExternalLink } from 'lucide-react'

const formatCurrency = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value)
const formatNumber = (value) => new Intl.NumberFormat('de-DE').format(value)
const formatPercent = (value) => `${value.toFixed(2)}%`

const KPICard = ({ title, value, icon: Icon, format = 'number', color = 'blue' }) => {
  const colors = {
    blue: { bg: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', text: 'text-blue-400' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30', text: 'text-emerald-400' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', text: 'text-purple-400' },
    green: { bg: 'from-green-500/20 to-green-600/10 border-green-500/30', text: 'text-green-400' },
  }
  const c = colors[color] || colors.blue

  const formatValue = (val, fmt) => {
    if (fmt === 'currency') return formatCurrency(val)
    if (fmt === 'percentage') return formatPercent(val)
    return formatNumber(val)
  }

  return (
    <div className={`bg-gradient-to-br ${c.bg} border rounded-xl p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{formatValue(value, format)}</p>
        </div>
        {Icon && <div className={`p-3 rounded-lg bg-dark-800/50 ${c.text}`}><Icon className="w-5 h-5" /></div>}
      </div>
    </div>
  )
}

const DateRangeSelector = ({ selectedDays, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ]

  const getLabel = () => {
    const p = presets.find(x => x.days === selectedDays)
    return p ? p.label : `${selectedDays} days`
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white">
        <span>{getLabel()}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {presets.map(p => (
              <button key={p.days} onClick={() => { onChange(p.days); setIsOpen(false) }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedDays === p.days ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ClientDetailPage({ data, isAdmin }) {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState(30)

  const safeData = data || { clients: [], campaigns: [], dailyMetrics: {} }
  const client = (safeData.clients || []).find(c => c && c.id === clientId)
  const clientCampaigns = (safeData.campaigns || []).filter(c => c && c.clientId === clientId)

  // Calculate client metrics
  const metrics = useMemo(() => {
    let spend = 0, conversions = 0, value = 0, clicks = 0, impressions = 0
    clientCampaigns.forEach(campaign => {
      const cm = safeData.dailyMetrics?.[campaign.id]
      if (Array.isArray(cm)) {
        cm.slice(-selectedDays).forEach(m => {
          if (m) {
            spend += m.spend || 0
            conversions += m.conversions || 0
            value += m.conversionValue || 0
            clicks += m.clicks || 0
            impressions += m.impressions || 0
          }
        })
      }
    })
    return { spend, conversions, value, clicks, impressions, roas: spend > 0 ? value / spend : 0, cpa: conversions > 0 ? spend / conversions : 0, ctr: impressions > 0 ? clicks / impressions * 100 : 0 }
  }, [clientCampaigns, safeData.dailyMetrics, selectedDays])

  // Campaign details
  const campaignDetails = useMemo(() => {
    return clientCampaigns.map(campaign => {
      let spend = 0, conversions = 0, value = 0, clicks = 0, impressions = 0
      const cm = safeData.dailyMetrics?.[campaign.id]
      if (Array.isArray(cm)) {
        cm.slice(-selectedDays).forEach(m => {
          if (m) {
            spend += m.spend || 0
            conversions += m.conversions || 0
            value += m.conversionValue || 0
            clicks += m.clicks || 0
            impressions += m.impressions || 0
          }
        })
      }
      return { ...campaign, spend, conversions, value, clicks, impressions, roas: spend > 0 ? value / spend : 0 }
    })
  }, [clientCampaigns, safeData.dailyMetrics, selectedDays])

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Client not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">Return to Dashboard</Link>
        </div>
      </div>
    )
  }

  const activeCount = clientCampaigns.filter(c => c.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg bg-dark-700 text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">{client.logo || '?'}</div>
        <div>
          <h1 className="text-2xl font-bold text-white">{client.name}</h1>
          <p className="text-slate-400">{client.industry} • {client.status}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Spend" value={metrics.spend} icon={DollarSign} format="currency" color="blue" />
        <KPICard title="Conversions" value={metrics.conversions} icon={Target} format="number" color="emerald" />
        <KPICard title="ROAS" value={metrics.roas} icon={TrendingUp} format="percentage" color="purple" suffix="x" />
        <KPICard title="Revenue" value={metrics.value} icon={DollarSign} format="currency" color="green" />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Client Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-dark-700"><span className="text-slate-400">Industry</span><span className="text-white">{client.industry}</span></div>
            <div className="flex justify-between py-2 border-b border-dark-700"><span className="text-slate-400">Active Campaigns</span><span className="text-white">{activeCount}</span></div>
            <div className="flex justify-between py-2 border-b border-dark-700"><span className="text-slate-400">Total Budget</span><span className="text-white">{formatCurrency(clientCampaigns.reduce((s, c) => s + (c.budget || 0), 0))}</span></div>
            <div className="flex justify-between py-2"><span className="text-slate-400">Status</span><span className={`px-2 py-1 text-xs rounded-full ${client.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{client.status}</span></div>
          </div>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-slate-400">Avg. CTR</span><span className="text-white">{metrics.ctr.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Total Clicks</span><span className="text-white">{formatNumber(metrics.clicks)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Total Impressions</span><span className="text-white">{formatNumber(metrics.impressions)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">CPA</span><span className="text-white">{formatCurrency(metrics.cpa)}</span></div>
          </div>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/reports')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 text-slate-400 hover:text-white">
              <ExternalLink className="w-5 h-5" /><span>Schedule Report</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 text-slate-400 hover:text-white">
              <ShoppingCart className="w-5 h-5" /><span>View Invoices</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex justify-end">
        <DateRangeSelector selectedDays={selectedDays} onChange={setSelectedDays} />
      </div>

      {/* Campaigns Table */}
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-dark-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Campaigns ({campaignDetails.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-400">Campaign</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-400">Platform</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-400">Status</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">Spend</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">Conv.</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">ROAS</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">CTR</th>
              </tr>
            </thead>
            <tbody>
              {campaignDetails.map(campaign => (
                <tr key={campaign.id} onClick={() => navigate(`/campaign/${campaign.id}`)} className="cursor-pointer hover:bg-dark-700/50 border-b border-dark-700">
                  <td className="px-4 py-3 text-white font-medium">{campaign.name}</td>
                  <td className="px-4 py-3 text-slate-300 capitalize">{campaign.platform}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{campaign.status}</span></td>
                  <td className="px-4 py-3 text-right text-white">{formatCurrency(campaign.spend)}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{campaign.conversions}</td>
                  <td className="px-4 py-3 text-right"><span className={campaign.roas >= 3 ? 'text-emerald-400' : campaign.roas >= 2 ? 'text-amber-400' : 'text-red-400'}>{campaign.roas.toFixed(2)}x</span></td>
                  <td className="px-4 py-3 text-right text-slate-300">{((campaign.clicks / (campaign.impressions || 1)) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
