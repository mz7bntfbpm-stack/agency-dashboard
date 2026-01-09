import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    amber: { bg: 'from-amber-500/20 to-amber-600/10 border-amber-500/30', text: 'text-amber-400' },
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

const platformColors = {
  google: '#4285f4',
  facebook: '#1877f2',
  instagram: '#e4405f',
  linkedin: '#0a66c2',
  twitter: '#1da1f2'
}

export default function CampaignDetailPage({ data, isAdmin }) {
  const { campaignId } = useParams()
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState(30)

  const safeData = data || { campaigns: [], dailyMetrics: {} }
  const campaign = (safeData.campaigns || []).find(c => c && c.id === campaignId)
  
  // Calculate campaign metrics
  const metrics = useMemo(() => {
    if (!campaign) return null
    const dailyMetrics = safeData.dailyMetrics?.[campaignId] || []
    const recentMetrics = dailyMetrics.slice(-selectedDays)
    
    let spend = 0, conversions = 0, value = 0, clicks = 0, impressions = 0
    recentMetrics.forEach(m => {
      if (m) {
        spend += m.spend || 0
        conversions += m.conversions || 0
        value += m.conversionValue || 0
        clicks += m.clicks || 0
        impressions += m.impressions || 0
      }
    })

    return {
      spend: Math.round(spend),
      conversions,
      value: Math.round(value),
      clicks,
      impressions,
      roas: spend > 0 ? value / spend : 0,
      cpa: conversions > 0 ? spend / conversions : 0,
      ctr: impressions > 0 ? clicks / impressions * 100 : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      dailyData: recentMetrics
    }
  }, [campaign, campaignId, safeData.dailyMetrics, selectedDays])

  if (!campaign || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Campaign not found</h2>
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300 mt-2 inline-block">Go Back</button>
        </div>
      </div>
    )
  }

  const platformColor = platformColors[campaign.platform] || '#64748b'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-dark-700 text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${platformColor}20` }}>
          <span style={{ color: platformColor }}>
            {campaign.platform === 'google' ? '🔍' : campaign.platform === 'facebook' ? '📘' : campaign.platform === 'instagram' ? '📷' : '📊'}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{campaign.status}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 capitalize">{campaign.platform} Ads</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Budget: {formatCurrency(campaign.budget)}/day</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Spend" value={metrics.spend} icon={DollarSign} format="currency" color="blue" />
        <KPICard title="Conversions" value={metrics.conversions} icon={Target} format="number" color="emerald" />
        <KPICard title="ROAS" value={metrics.roas} icon={TrendingUp} format="percentage" color="purple" suffix="x" />
        <KPICard title="Revenue" value={metrics.value} icon={DollarSign} format="currency" color="green" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-400">Impressions</span></div>
          <p className="text-xl font-bold text-white">{formatNumber(metrics.impressions)}</p>
        </div>
        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><MousePointer className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-400">Clicks</span></div>
          <p className="text-xl font-bold text-white">{formatNumber(metrics.clicks)}</p>
        </div>
        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><span className="text-sm text-slate-400">CTR</span></div>
          <p className="text-xl font-bold text-white">{metrics.ctr.toFixed(2)}%</p>
        </div>
        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><span className="text-sm text-slate-400">CPC</span></div>
          <p className="text-xl font-bold text-white">{formatCurrency(metrics.cpc)}</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Utilization */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Budget Utilization</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Daily Avg Spend</span>
                <span className="text-white">{formatCurrency(metrics.spend / selectedDays)}</span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${Math.min(100, (metrics.spend / selectedDays) / campaign.budget * 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">{((metrics.spend / selectedDays) / campaign.budget * 100).toFixed(0)}% of daily budget</p>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Budget (period)</span>
              <span className="text-white font-medium">{formatCurrency(campaign.budget * selectedDays)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Actual Spend</span>
              <span className="text-white font-medium">{formatCurrency(metrics.spend)}</span>
            </div>
          </div>
        </div>

        {/* ROAS Progress */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">ROAS Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Current ROAS</span>
                <span className={`font-bold ${metrics.roas >= 3 ? 'text-emerald-400' : metrics.roas >= 2 ? 'text-amber-400' : 'text-red-400'}`}>{metrics.roas.toFixed(2)}x</span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${metrics.roas >= 3 ? 'bg-emerald-500' : metrics.roas >= 2 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, metrics.roas / 5 * 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Target: 4.0x</p>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Revenue</span>
              <span className="text-white font-medium">{formatCurrency(metrics.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Revenue per €1 Spent</span>
              <span className="text-white font-medium">{metrics.roas.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex justify-end">
        <DateRangeSelector selectedDays={selectedDays} onChange={setSelectedDays} />
      </div>

      {/* Daily Performance Table */}
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white">Daily Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-400">Date</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">Spend</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">Impr.</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">Clicks</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">Conv.</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">CTR</th>
              </tr>
            </thead>
            <tbody>
              {metrics.dailyData.slice(-14).reverse().map((m, i) => (
                <tr key={i} className="border-b border-dark-700 hover:bg-dark-700/30">
                  <td className="px-4 py-3 text-white">{m.date}</td>
                  <td className="px-4 py-3 text-right text-white">{formatCurrency(m.spend)}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{formatNumber(m.impressions)}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{m.clicks}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{m.conversions}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{m.ctr.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
