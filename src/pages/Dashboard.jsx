import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, ShoppingCart, TrendingUp, Target, Upload } from 'lucide-react'
import KPICard from '../components/KPICard'
import DateRangeSelector from '../components/DateRangeSelector'
import SpendTrendChart from '../components/SpendTrendChart'
import ClientPerformanceChart from '../components/ClientPerformanceChart'
import PlatformDistributionChart from '../components/PlatformDistributionChart'
import HeatmapChart from '../components/HeatmapChart'
import { aggregateMetrics, getDailyTrend, getPlatformDistribution, getHeatmapData, getClientMetrics } from '../data/sampleData'

const Dashboard = ({ data }) => {
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState(30)

  // Safe data access
  const safeData = useMemo(() => {
    if (!data) {
      return { clients: [], campaigns: [], dailyMetrics: {} }
    }
    return {
      clients: data.clients || [],
      campaigns: data.campaigns || [],
      dailyMetrics: data.dailyMetrics || {}
    }
  }, [data])

  // Calculate metrics with safe data access
  const metrics = useMemo(() => {
    return aggregateMetrics(safeData.dailyMetrics, selectedDays)
  }, [safeData.dailyMetrics, selectedDays])

  const dailyTrend = useMemo(() => {
    return getDailyTrend(safeData.dailyMetrics, selectedDays)
  }, [safeData.dailyMetrics, selectedDays])

  const platformDistribution = useMemo(() => {
    return getPlatformDistribution(safeData.dailyMetrics, safeData.campaigns, selectedDays)
  }, [safeData.dailyMetrics, safeData.campaigns, selectedDays])

  const heatmapData = useMemo(() => {
    return getHeatmapData(safeData.dailyMetrics, selectedDays)
  }, [safeData.dailyMetrics, selectedDays])

  const clientPerformance = useMemo(() => {
    if (!safeData.clients || !Array.isArray(safeData.clients)) return []
    return safeData.clients.map(client => ({
      ...client,
      ...getClientMetrics(client.id, safeData.campaigns, safeData.dailyMetrics, selectedDays)
    }))
  }, [safeData.clients, safeData.campaigns, safeData.dailyMetrics, selectedDays])

  // Simulated previous period values for comparison
  const previousMetrics = useMemo(() => ({
    spend: metrics.totalSpend * 0.85,
    conversions: metrics.totalConversions * 0.9,
    roas: metrics.roas * 0.95,
    cpa: metrics.cpa * 1.1
  }), [metrics])

  const calculateChange = (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Safe derived values
  const activeCampaignsCount = useMemo(() => {
    if (!safeData.campaigns || !Array.isArray(safeData.campaigns)) return 0
    return safeData.campaigns.filter(c => c?.status === 'active').length
  }, [safeData.campaigns])

  const pausedCampaignsCount = useMemo(() => {
    if (!safeData.campaigns || !Array.isArray(safeData.campaigns)) return 0
    return safeData.campaigns.filter(c => c?.status === 'paused').length
  }, [safeData.campaigns])

  const sortedClients = useMemo(() => {
    if (!clientPerformance || !Array.isArray(clientPerformance)) return []
    return [...clientPerformance].sort((a, b) => (b.roas || 0) - (a.roas || 0))
  }, [clientPerformance])

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Track your marketing performance across all channels</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector 
            selectedDays={selectedDays} 
            onChange={setSelectedDays}
          />
          <button 
            onClick={() => navigate('/import')}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white hover:border-blue-500 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Spend"
          value={metrics.totalSpend}
          change={calculateChange(metrics.totalSpend, previousMetrics.spend)}
          icon={DollarSign}
          format="currency"
          color="blue"
        />
        <KPICard
          title="Conversions"
          value={metrics.totalConversions}
          change={calculateChange(metrics.totalConversions, previousMetrics.conversions)}
          icon={ShoppingCart}
          format="number"
          color="emerald"
        />
        <KPICard
          title="ROAS"
          value={metrics.roas}
          change={calculateChange(metrics.roas, previousMetrics.roas)}
          icon={TrendingUp}
          format="percentage"
          color="purple"
          suffix="x"
        />
        <KPICard
          title="CPA"
          value={metrics.cpa}
          change={calculateChange(metrics.cpa, previousMetrics.cpa)}
          icon={Target}
          format="currency"
          color="amber"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendTrendChart data={dailyTrend} height={350} />
        </div>
        <div>
          <PlatformDistributionChart data={platformDistribution} height={350} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientPerformanceChart 
          data={clientPerformance} 
          height={350}
        />
        <HeatmapChart 
          data={heatmapData}
          height={350}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Clients */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Clients</h3>
          <div className="space-y-3">
            {sortedClients.slice(0, 4).map((client) => (
              <div 
                key={client?.id || Math.random()}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700 cursor-pointer transition-colors"
                onClick={() => navigate(`/client/${client?.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {client?.logo || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{client?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-400">{client?.campaignCount || 0} campaigns</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{(client?.roas || 0)}x</p>
                  <p className="text-sm text-emerald-400">ROAS</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Summary */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Campaign Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Campaigns</span>
              <span className="text-xl font-bold text-white">{safeData.campaigns?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active</span>
              <span className="text-xl font-bold text-emerald-400">{activeCampaignsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Paused</span>
              <span className="text-xl font-bold text-amber-400">{pausedCampaignsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg. CTR</span>
              <span className="text-xl font-bold text-white">{(metrics.ctr || 0).toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg. CPC</span>
              <span className="text-xl font-bold text-white">{(metrics.cpc || 0).toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Breakdown</h3>
          <div className="space-y-3">
            {platformDistribution.map((platform, index) => {
              const total = platformDistribution.reduce((sum, p) => sum + (p?.value || 0), 0)
              const percentage = total > 0 ? ((platform?.value || 0) / total * 100).toFixed(1) : 0
              
              return (
                <div key={platform?.name || index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{platform?.name || 'Unknown'}</span>
                    <span className="text-white font-medium">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][index % 6]
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
