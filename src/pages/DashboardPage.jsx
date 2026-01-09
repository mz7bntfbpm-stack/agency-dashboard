import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, ShoppingCart, TrendingUp, Target, Upload, BarChart3, FileText, Upload as UploadIcon, Settings } from 'lucide-react'

const KPICard = ({ title, value, change, icon: Icon, format = 'number', color = 'blue' }) => {
  const colors = {
    blue: { bg: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', text: 'text-blue-400', icon: 'bg-blue-500' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30', text: 'text-emerald-400', icon: 'bg-emerald-500' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', text: 'text-purple-400', icon: 'bg-purple-500' },
    amber: { bg: 'from-amber-500/20 to-amber-600/10 border-amber-500/30', text: 'text-amber-400', icon: 'bg-amber-500' },
    green: { bg: 'from-green-500/20 to-green-600/10 border-green-500/30', text: 'text-green-400', icon: 'bg-green-500' },
  }
  const c = colors[color] || colors.blue

  const formatValue = (val, fmt) => {
    if (fmt === 'currency') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(val)
    }
    if (fmt === 'percentage') {
      return `${val.toFixed(1)}%`
    }
    return new Intl.NumberFormat('de-DE').format(val)
  }

  const trendColor = change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-slate-400'
  const trendIcon = change > 0 ? '↑' : change < 0 ? '↓' : '→'

  return (
    <div className={`bg-gradient-to-br ${c.bg} border rounded-xl p-5 hover:transform hover:-translate-y-1 transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{formatValue(value, format)}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <span>{trendIcon}</span>
              <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
              <span className="text-xs text-slate-500">vs prev</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-dark-800/50 ${c.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

const DateRangeSelector = ({ selectedDays, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const presets = [
    { label: 'Today', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ]

  const getSelectedLabel = () => {
    const preset = presets.find(p => p.days === selectedDays)
    return preset ? preset.label : `${selectedDays} days`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white hover:border-blue-500 transition-colors"
      >
        <span>{getSelectedLabel()}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {presets.map((preset) => (
              <button
                key={preset.days}
                onClick={() => {
                  onChange(preset.days)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDays === preset.days ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('de-DE').format(value)
}

export default function DashboardPage({ data }) {
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState(30)

  // Ensure data exists
  const safeData = data || { clients: [], campaigns: [], dailyMetrics: {} }

  // Calculate metrics
  const metrics = useMemo(() => {
    let totalSpend = 0, totalConversions = 0, totalValue = 0, totalClicks = 0, totalImpressions = 0
    
    if (safeData.dailyMetrics && typeof safeData.dailyMetrics === 'object') {
      Object.values(safeData.dailyMetrics).forEach((campaignMetrics) => {
        if (Array.isArray(campaignMetrics)) {
          const recent = campaignMetrics.slice(-selectedDays)
          recent.forEach(m => {
            if (m) {
              totalSpend += m.spend || 0
              totalConversions += m.conversions || 0
              totalValue += m.conversionValue || 0
              totalClicks += m.clicks || 0
              totalImpressions += m.impressions || 0
            }
          })
        }
      })
    }

    return {
      totalSpend: Math.round(totalSpend),
      totalConversions,
      totalValue: Math.round(totalValue),
      roas: totalSpend > 0 ? Math.round(totalValue / totalSpend * 100) / 100 : 0,
      cpa: totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0,
      ctr: totalImpressions > 0 ? Math.round(totalClicks / totalImpressions * 10000) / 100 : 0,
      totalClicks,
      totalImpressions
    }
  }, [safeData.dailyMetrics, selectedDays])

  // Client performance
  const clientPerformance = useMemo(() => {
    if (!safeData.clients || !Array.isArray(safeData.clients)) return []
    
    return safeData.clients.map(client => {
      const clientCampaigns = (safeData.campaigns || []).filter(c => c.clientId === client.id)
      let spend = 0, conversions = 0, value = 0
      
      clientCampaigns.forEach(campaign => {
        const campaignMetrics = safeData.dailyMetrics?.[campaign.id]
        if (Array.isArray(campaignMetrics)) {
          campaignMetrics.slice(-selectedDays).forEach(m => {
            if (m) {
              spend += m.spend || 0
              conversions += m.conversions || 0
              value += m.conversionValue || 0
            }
          })
        }
      })

      return {
        ...client,
        totalSpend: Math.round(spend),
        totalConversions: conversions,
        roas: spend > 0 ? Math.round(value / spend * 100) / 100 : 0,
        campaignCount: clientCampaigns.length
      }
    })
  }, [safeData.clients, safeData.campaigns, safeData.dailyMetrics, selectedDays])

  // Platform distribution
  const platformData = useMemo(() => {
    const platforms = {}
    if (safeData.campaigns && Array.isArray(safeData.campaigns)) {
      safeData.campaigns.forEach(campaign => {
        const campaignMetrics = safeData.dailyMetrics?.[campaign.id]
        if (Array.isArray(campaignMetrics)) {
          campaignMetrics.slice(-selectedDays).forEach(m => {
            if (m) {
              const platform = campaign.platform || 'unknown'
              platforms[platform] = (platforms[platform] || 0) + (m.spend || 0)
            }
          })
        }
      })
    }
    return Object.entries(platforms).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value)
    }))
  }, [safeData.campaigns, safeData.dailyMetrics, selectedDays])

  // Platform colors
  const platformColors = {
    Google: '#4285f4',
    Facebook: '#1877f2',
    Instagram: '#e4405f',
    Linkedin: '#0a66c2',
    Unknown: '#64748b'
  }

  // Calculate previous period for trends
  const previousMetrics = useMemo(() => ({
    spend: metrics.totalSpend * 0.85,
    conversions: metrics.totalConversions * 0.9,
    roas: metrics.roas * 0.95,
    cpa: metrics.cpa * 1.1
  }), [metrics])

  const getChange = (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Campaign counts
  const campaignCounts = useMemo(() => {
    if (!safeData.campaigns || !Array.isArray(safeData.campaigns)) return { total: 0, active: 0, paused: 0 }
    return {
      total: safeData.campaigns.length,
      active: safeData.campaigns.filter(c => c.status === 'active').length,
      paused: safeData.campaigns.filter(c => c.status === 'paused').length
    }
  }, [safeData.campaigns])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Track your marketing performance across all channels</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector selectedDays={selectedDays} onChange={setSelectedDays} />
          <button 
            onClick={() => navigate('/import')}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white hover:border-blue-500 transition-colors"
          >
            <UploadIcon className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Spend" value={metrics.totalSpend} change={getChange(metrics.totalSpend, previousMetrics.spend)} icon={DollarSign} format="currency" color="blue" />
        <KPICard title="Conversions" value={metrics.totalConversions} change={getChange(metrics.totalConversions, previousMetrics.conversions)} icon={ShoppingCart} format="number" color="emerald" />
        <KPICard title="ROAS" value={metrics.roas} change={getChange(metrics.roas, previousMetrics.roas)} icon={TrendingUp} format="percentage" color="purple" suffix="x" />
        <KPICard title="CPA" value={metrics.cpa} change={getChange(metrics.cpa, previousMetrics.cpa)} icon={Target} format="currency" color="amber" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Performance Bar Chart */}
        <div className="lg:col-span-2 bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Client</h3>
          <div className="space-y-3">
            {clientPerformance.map((client) => (
              <div 
                key={client.id}
                onClick={() => navigate(`/client/${client.id}`)}
                className="flex items-center gap-4 p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {client.logo || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-sm text-slate-400">{client.campaignCount} campaigns</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{formatCurrency(client.totalSpend)}</p>
                  <p className={`text-sm ${client.roas >= 3 ? 'text-emerald-400' : client.roas >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
                    ROAS: {client.roas}x
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Ad Spend by Platform</h3>
          {platformData.length > 0 ? (
            <>
              <div className="space-y-3">
                {platformData.map((platform, i) => {
                  const total = platformData.reduce((s, p) => s + p.value, 0)
                  const percent = total > 0 ? (platform.value / total * 100).toFixed(1) : 0
                  const color = platformColors[platform.name] || '#64748b'
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{platform.name}</span>
                        <span className="text-white">{percent}%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-400">Total Spend</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(platformData.reduce((s, p) => s + p.value, 0))}</p>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 py-8">No data available</div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Clients */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Clients</h3>
          <div className="space-y-2">
            {[...clientPerformance].sort((a, b) => b.roas - a.roas).slice(0, 4).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {client.logo || '?'}
                  </div>
                  <span className="text-white text-sm">{client.name}</span>
                </div>
                <span className="text-emerald-400 font-medium">{client.roas}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Summary */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Campaign Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Campaigns</span>
              <span className="text-white font-bold">{campaignCounts.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active</span>
              <span className="text-emerald-400 font-bold">{campaignCounts.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Paused</span>
              <span className="text-amber-400 font-bold">{campaignCounts.paused}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg. CTR</span>
              <span className="text-white font-bold">{metrics.ctr.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Conversions</span>
              <span className="text-white font-bold">{formatNumber(metrics.totalConversions)}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Revenue</span>
              <span className="text-white font-bold">{formatCurrency(metrics.totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg. Order Value</span>
              <span className="text-white font-bold">{formatCurrency(metrics.totalValue / (metrics.totalConversions || 1))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Click Volume</span>
              <span className="text-white font-bold">{formatNumber(metrics.totalClicks)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Impressions</span>
              <span className="text-white font-bold">{formatNumber(metrics.totalImpressions)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
