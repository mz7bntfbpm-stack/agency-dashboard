import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters'

const KPICard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  format = 'number', 
  color = 'blue',
  suffix = ''
}) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
      emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
      purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
      amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
      red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    }
    return colors[color] || colors.blue
  }

  const formatValue = (val, fmt) => {
    switch (fmt) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return formatPercentage(val)
      case 'compact':
        return formatNumber(val)
      default:
        return formatNumber(val)
    }
  }

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = (change, type = 'positive') => {
    if (type === 'spend' || type === 'cpa') {
      // For spend and CPA, lower is better
      return change < 0 ? 'text-emerald-400' : change > 0 ? 'text-red-400' : 'text-slate-400'
    }
    // For conversions, ROAS, CTR, higher is better
    return change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-slate-400'
  }

  return (
    <div className={`kpi-card bg-gradient-to-br ${getColorClasses(color)} border rounded-xl p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">
              {formatValue(value, format)}
            </span>
            {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${getTrendColor(change, title.includes('Spend') || title.includes('CPA') ? 'spend' : 'positive')}`}>
              {getTrendIcon(change)}
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">vs previous period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-dark-800/50 ${
            color === 'blue' ? 'text-blue-400' :
            color === 'emerald' ? 'text-emerald-400' :
            color === 'purple' ? 'text-purple-400' :
            color === 'amber' ? 'text-amber-400' :
            color === 'red' ? 'text-red-400' : 'text-slate-400'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard
