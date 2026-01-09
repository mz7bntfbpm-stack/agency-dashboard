import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  Wallet,
  Percent,
  DollarSign
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import KPICard from '../components/KPICard'
import DateRangeSelector from '../components/DateRangeSelector'
import EditCampaignModal from '../components/EditCampaignModal'
import { useCampaignDetail } from '../hooks/useDashboard'
import { formatCurrency, formatNumber, formatPercentage, getPlatformColor, getStatusBadgeClass } from '../utils/formatters'
import { format, subDays } from 'date-fns'

const CampaignDetail = ({ data, isAdmin }) => {
  const { campaignId } = useParams()
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState(30)
  const [editingCampaign, setEditingCampaign] = useState(false)

  const { campaign, metrics } = useCampaignDetail(campaignId, data, selectedDays)

  if (!campaign || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Campaign not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const spendChartData = metrics.dailyMetrics.map(m => ({
    date: m.date,
    spend: m.spend,
    conversions: m.conversions
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{format(new Date(label), 'MMM d, yyyy')}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.name === 'Spend' ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }

  const handleSaveCampaign = (updatedCampaign) => {
    console.log('Updated campaign:', updatedCampaign)
    const campaignIndex = data.campaigns.findIndex(c => c.id === updatedCampaign.id)
    if (campaignIndex !== -1) {
      data.campaigns[campaignIndex] = updatedCampaign
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-dark-700 text-slate-400 hover:text-white hover:bg-dark-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${getPlatformColor(campaign.platform)}20` }}
            >
              <span className="text-2xl" style={{ color: getPlatformColor(campaign.platform) }}>
                {campaign.platform === 'google' ? '🔍' : 
                 campaign.platform === 'facebook' ? '📘' : 
                 campaign.platform === 'instagram' ? '📷' : '📊'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                  {campaign.status}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 capitalize">{campaign.platform} Ads</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Daily Budget: {formatCurrency(campaign.budget)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector 
            selectedDays={selectedDays} 
            onChange={setSelectedDays}
          />
          {isAdmin && (
            <button 
              onClick={() => setEditingCampaign(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Campaign
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Total Spend</span>
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(metrics.totalSpend)}</p>
          <p className="text-sm text-slate-500 mt-1">
            {formatCurrency(metrics.totalSpend / selectedDays)}/day avg
          </p>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Conversions</span>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(metrics.totalConversions)}</p>
          <p className="text-sm text-slate-500 mt-1">
            {formatCurrency(metrics.cpa)} cost per conversion
          </p>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">ROAS</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{metrics.roas}x</p>
          <p className={`text-sm mt-1 ${
            metrics.roas >= 3 ? 'text-emerald-400' : 
            metrics.roas >= 2 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {metrics.roas >= 3 ? 'Excellent' : metrics.roas >= 2 ? 'Good' : 'Needs optimization'}
          </p>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Revenue</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(metrics.totalConversionValue)}</p>
          <p className="text-sm text-slate-500 mt-1">
            {formatCurrency(metrics.totalConversionValue / (metrics.totalSpend || 1))} revenue per €1 spent
          </p>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Impressions</span>
          </div>
          <p className="text-xl font-bold text-white">{formatNumber(metrics.totalImpressions)}</p>
        </div>

        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Clicks</span>
          </div>
          <p className="text-xl font-bold text-white">{formatNumber(metrics.totalClicks)}</p>
        </div>

        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">CTR</span>
          </div>
          <p className="text-xl font-bold text-white">{formatPercentage(metrics.ctr)}</p>
        </div>

        <div className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">CPC</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(metrics.cpc)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Trend */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Spend & Conversions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={spendChartData}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
              />
              <YAxis 
                yAxisId="left"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                stroke="#3b82f6"
                fill="url(#spendGradient)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
          <div className="space-y-4">
            {/* Spend vs Budget */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Budget Utilization</span>
                <span className="text-white font-medium">
                  {Math.round(metrics.totalSpend / (campaign.budget * selectedDays) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-400"
                  style={{ width: `${Math.min(100, metrics.totalSpend / (campaign.budget * selectedDays) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(metrics.totalSpend)} of {formatCurrency(campaign.budget * selectedDays)} total budget
              </p>
            </div>

            {/* Conversion Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Conversion Rate</span>
                <span className="text-white font-medium">
                  {((metrics.totalConversions / metrics.totalClicks) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${Math.min(100, (metrics.totalConversions / metrics.totalClicks) * 100 * 10)}%` }}
                ></div>
              </div>
            </div>

            {/* ROAS Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ROAS Progress</span>
                <span className="text-white font-medium">{metrics.roas}x / 4x target</span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-purple-400"
                  style={{ width: `${Math.min(100, metrics.roas / 4 * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-dark-700">
            <div>
              <p className="text-sm text-slate-400">Best Day</p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(metrics.dailyMetrics.reduce((best, m) => 
                  m.conversions > (best?.conversions || 0) ? m : best
                , metrics.dailyMetrics[0] || {}).date || new Date()), 'EEEE')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Best Hour</p>
              <p className="text-lg font-semibold text-white">
                {metrics.dailyMetrics.reduce((best, m) => 
                  m.conversions > (best?.conversions || 0) ? m : best
                , metrics.dailyMetrics[0] || {}).hourOfDay || 0}:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditCampaignModal
        isOpen={editingCampaign}
        onClose={() => setEditingCampaign(false)}
        campaign={campaign}
        onSave={handleSaveCampaign}
      />
    </div>
  )
}

export default CampaignDetail
