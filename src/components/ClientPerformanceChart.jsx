import { useNavigate } from 'react-router-dom'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]?.payload
  if (!data) return null
  
  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label text-white font-semibold">{data.name || 'Unknown'}</p>
      <div className="space-y-1">
        <p style={{ color: '#3b82f6' }} className="text-sm">
          Spend: {formatCurrency(data.totalSpend || 0)}
        </p>
        <p style={{ color: '#10b981' }} className="text-sm">
          ROAS: {(data.roas || 0)}x
        </p>
        <p style={{ color: '#f59e0b' }} className="text-sm">
          Conversions: {data.totalConversions || 0}
        </p>
      </div>
      <p className="text-xs text-slate-500 mt-2">Click to view details</p>
    </div>
  )
}

const ClientPerformanceChart = ({ data, height = 300 }) => {
  const navigate = useNavigate()

  const handleBarClick = (chartData) => {
    if (chartData && chartData.activePayload && chartData.activePayload.length > 0) {
      const clientId = chartData.activePayload[0]?.payload?.id
      if (clientId) {
        navigate(`/client/${clientId}`)
      }
    }
  }

  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : []

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Performance by Client</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart 
            data={chartData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={11}
              tick={{ fill: '#64748b' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="totalSpend" 
              name="Total Spend"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-slate-400">
          No data available
        </div>
      )}
    </div>
  )
}

export default ClientPerformanceChart
