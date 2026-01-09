import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]?.payload
  if (!data) return null
  
  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label">{data.name || 'Unknown'}</p>
      <p style={{ color: data.fill }} className="text-sm">
        {formatCurrency(data.value || 0)}
      </p>
    </div>
  )
}

const PlatformDistributionChart = ({ data, height = 300 }) => {
  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : []
  const total = chartData.reduce((sum, item) => sum + (item?.value || 0), 0)

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Don't show labels for small segments
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Ad Spend by Platform</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry) => (
                <span className="text-slate-400 text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-slate-400">
          No data available
        </div>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">Total Spend</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
      </div>
    </div>
  )
}

export default PlatformDistributionChart
