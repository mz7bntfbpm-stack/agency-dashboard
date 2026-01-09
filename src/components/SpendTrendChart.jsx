import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { formatCurrency, formatDate } from '../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label">{formatDate(label, 'short')}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="text-sm">
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

const SpendTrendChart = ({ data, height = 300 }) => {
  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Spend Trend</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => formatDate(value, 'short')}
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="spend" 
            name="Spend (€)" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#3b82f6' }}
          />
          <Line 
            type="monotone" 
            dataKey="conversions" 
            name="Conversions" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#10b981' }}
            yAxisId={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SpendTrendChart
