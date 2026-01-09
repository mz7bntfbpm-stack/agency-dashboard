import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronUp, 
  MoreVertical,
  ExternalLink,
  Edit,
  Play,
  Pause,
  Trash2
} from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage, getStatusBadgeClass, getPlatformColor } from '../utils/formatters'

const CampaignTable = ({ campaigns, metrics, isAdmin = false, onEdit }) => {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState({ key: 'totalSpend', direction: 'desc' })
  const [expandedRows, setExpandedRows] = useState({})

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return sortConfig.direction === 'asc' 
      ? aValue - bValue
      : bValue - aValue
  })

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />
  }

  const formatMetric = (key, value) => {
    switch (key) {
      case 'totalSpend':
      case 'cpa':
      case 'cpc':
        return formatCurrency(value)
      case 'totalConversions':
      case 'totalClicks':
      case 'totalImpressions':
        return formatNumber(value)
      case 'ctr':
      case 'roas':
        return formatPercentage(value, key === 'roas' ? 2 : 2)
      default:
        return value
    }
  }

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Campaign Performance</h3>
        <span className="text-sm text-slate-400">{campaigns.length} campaigns</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Campaign {getSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs uppercase tracking-wider text-slate-400">Platform</span>
              </th>
              <th className="px-4 py-3 text-center">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center justify-center gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Status {getSortIcon('status')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('totalSpend')}
                  className="flex items-center justify-end gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Spend {getSortIcon('totalSpend')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('conversions')}
                  className="flex items-center justify-end gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Conv. {getSortIcon('conversions')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('roas')}
                  className="flex items-center justify-end gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  ROAS {getSortIcon('roas')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('ctr')}
                  className="flex items-center justify-end gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  CTR {getSortIcon('ctr')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('cpa')}
                  className="flex items-center justify-end gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  CPA {getSortIcon('cpa')}
                </button>
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((campaign) => (
              <tr 
                key={campaign.id}
                className="cursor-pointer hover:bg-dark-700/50"
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{campaign.name}</span>
                    <ExternalLink className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPlatformColor(campaign.platform) }}
                    ></div>
                    <span className="text-sm text-slate-300 capitalize">{campaign.platform}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-white">
                  {formatCurrency(campaign.totalSpend)}
                </td>
                <td className="px-4 py-3 text-right text-slate-300">
                  {formatNumber(campaign.totalConversions)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${
                    campaign.roas >= 3 ? 'text-emerald-400' :
                    campaign.roas >= 2 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {campaign.roas}x
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-300">
                  {formatPercentage(campaign.ctr)}
                </td>
                <td className="px-4 py-3 text-right text-slate-300">
                  {formatCurrency(campaign.cpa)}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => onEdit && onEdit(campaign)}
                        className="p-1.5 rounded hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-dark-600 text-slate-400 hover:text-white transition-colors">
                        {campaign.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CampaignTable
