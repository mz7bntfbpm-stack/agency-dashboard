import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Target, 
  TrendingUp,
  ExternalLink,
  Calendar,
  Edit
} from 'lucide-react'
import KPICard from '../components/KPICard'
import DateRangeSelector from '../components/DateRangeSelector'
import CampaignTable from '../components/CampaignTable'
import EditCampaignModal from '../components/EditCampaignModal'
import { useClientDetail } from '../hooks/useDashboard'
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters'

const ClientDetail = ({ data, isAdmin }) => {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState(30)
  const [editingCampaign, setEditingCampaign] = useState(null)

  // Safe data access with fallbacks
  const { client, clientCampaigns, clientMetrics, campaignMetrics } = useClientDetail(
    clientId, 
    data || { clients: [], campaigns: [], dailyMetrics: {} }, 
    selectedDays
  )

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Client not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const handleSaveCampaign = (updatedCampaign) => {
    console.log('Updated campaign:', updatedCampaign)
    const campaignIndex = (data?.campaigns || []).findIndex(c => c.id === updatedCampaign.id)
    if (campaignIndex !== -1 && data?.campaigns) {
      data.campaigns[campaignIndex] = updatedCampaign
    }
  }

  // Safe calculations with fallbacks
  const avgCTR = useMemo(() => {
    if (!campaignMetrics || !Array.isArray(campaignMetrics) || campaignMetrics.length === 0) return 0
    const totalCTR = campaignMetrics.reduce((sum, c) => sum + (c?.ctr || 0), 0)
    return (totalCTR / campaignMetrics.length).toFixed(2)
  }, [campaignMetrics])

  const totalClicks = useMemo(() => {
    if (!campaignMetrics || !Array.isArray(campaignMetrics)) return 0
    return campaignMetrics.reduce((sum, c) => sum + (c?.totalClicks || 0), 0)
  }, [campaignMetrics])

  const totalImpressions = useMemo(() => {
    if (!campaignMetrics || !Array.isArray(campaignMetrics)) return 0
    return campaignMetrics.reduce((sum, c) => sum + (c?.totalImpressions || 0), 0)
  }, [campaignMetrics])

  const totalSpend = useMemo(() => {
    if (!campaignMetrics || !Array.isArray(campaignMetrics)) return 0
    return campaignMetrics.reduce((sum, c) => sum + (c?.totalSpend || 0), 0)
  }, [campaignMetrics])

  const avgCPC = useMemo(() => {
    return totalClicks > 0 ? formatCurrency(totalSpend / totalClicks) : formatCurrency(0)
  }, [totalSpend, totalClicks])

  const activeCampaigns = useMemo(() => {
    if (!clientCampaigns || !Array.isArray(clientCampaigns)) return 0
    return clientCampaigns.filter(c => c?.status === 'active').length
  }, [clientCampaigns])

  const totalBudget = useMemo(() => {
    if (!clientCampaigns || !Array.isArray(clientCampaigns)) return 0
    return clientCampaigns.reduce((sum, c) => sum + (c?.budget || 0), 0)
  }, [clientCampaigns])

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-dark-700 text-slate-400 hover:text-white hover:bg-dark-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {client.logo || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{client.name || 'Unknown'}</h1>
              <p className="text-slate-400 flex items-center gap-2">
                <span className="capitalize">{client.industry || 'N/A'}</span>
                <span className="text-slate-600">•</span>
                <span className="capitalize">{client.status || 'unknown'}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector 
            selectedDays={selectedDays} 
            onChange={setSelectedDays}
          />
          {isAdmin && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              <Edit className="w-4 h-4" />
              Edit Client
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Spend"
          value={clientMetrics?.totalSpend || 0}
          icon={DollarSign}
          format="currency"
          color="blue"
        />
        <KPICard
          title="Conversions"
          value={clientMetrics?.totalConversions || 0}
          icon={Target}
          format="number"
          color="emerald"
        />
        <KPICard
          title="ROAS"
          value={clientMetrics?.roas || 0}
          icon={TrendingUp}
          format="percentage"
          color="purple"
          suffix="x"
        />
        <KPICard
          title="Revenue"
          value={clientMetrics?.totalConversionValue || 0}
          icon={DollarSign}
          format="currency"
          color="green"
        />
      </div>

      {/* Client Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-dark-700">
              <span className="text-slate-400">Industry</span>
              <span className="text-white capitalize">{(client?.industry) || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dark-700">
              <span className="text-slate-400">Active Campaigns</span>
              <span className="text-white">{activeCampaigns}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dark-700">
              <span className="text-slate-400">Total Budget</span>
              <span className="text-white">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Status</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                client?.status === 'active' ? 'status-active' : 'status-paused'
              }`}>
                {(client?.status) || 'unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg. CTR</span>
              <span className="text-white font-medium">{avgCTR}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg. CPC</span>
              <span className="text-white font-medium">{avgCPC}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Impressions</span>
              <span className="text-white font-medium">{formatNumber(totalImpressions)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Clicks</span>
              <span className="text-white font-medium">{formatNumber(totalClicks)}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
              <span>Schedule Report</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
              <span>View Team</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              <span>Generate Invoice</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      {campaignMetrics && Array.isArray(campaignMetrics) && campaignMetrics.length > 0 && (
        <CampaignTable 
          campaigns={campaignMetrics}
          isAdmin={isAdmin}
          onEdit={(campaign) => setEditingCampaign(campaign)}
        />
      )}

      {/* Edit Modal */}
      <EditCampaignModal
        isOpen={!!editingCampaign}
        onClose={() => setEditingCampaign(null)}
        campaign={editingCampaign}
        onSave={handleSaveCampaign}
      />
    </div>
  )
}

export default ClientDetail
