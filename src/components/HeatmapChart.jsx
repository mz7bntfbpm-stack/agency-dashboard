import { getDayName, getHeatmapColor } from '../utils/formatters'

const HeatmapChart = ({ data, height = 250 }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : []
  
  // Create a 7x24 grid
  const gridData = days.map((day, dayIndex) => {
    return hours.map(hour => {
      const cellData = chartData.find(d => d?.day === dayIndex && d?.hour === hour)
      return {
        day: dayIndex,
        dayName: day,
        hour,
        conversions: cellData?.conversions || 0,
        intensity: cellData?.intensity || 0
      }
    })
  }).flat()

  const maxConversions = Math.max(...chartData.map(d => d?.conversions || 0), 1)

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Performance Heatmap</h3>
      <p className="text-sm text-slate-400 mb-4">Best performing days and hours (conversions)</p>
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12 flex-shrink-0"></div>
            <div className="flex flex-1">
              {hours.map(hour => (
                <div 
                  key={hour}
                  className="flex-1 text-center text-xs text-slate-500"
                  style={{ fontSize: '10px' }}
                >
                  {hour % 6 === 0 ? hour : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {hours.map((hour) => {
              const firstRowCell = gridData.find(d => d.hour === hour && d.day === 0)
              if (!firstRowCell) return null
              
              return (
                <div key={`row-${hour}`} className="flex items-center gap-1">
                  {/* Day label */}
                  <div className="w-12 text-xs text-slate-400 font-medium">{days[0]}</div>
                  
                  {/* Hour cells */}
                  <div className="flex flex-1 gap-0.5">
                    {days.map((_, dayIndex) => {
                      const cellData = gridData.find(
                        d => d?.day === dayIndex && d?.hour === hour
                      )
                      const intensity = cellData ? ((cellData.conversions || 0) / maxConversions) * 100 : 0
                      
                      return (
                        <div
                          key={`${dayIndex}-${hour}`}
                          className="heatmap-cell flex-1 h-6 rounded cursor-pointer relative group"
                          style={{
                            backgroundColor: getHeatmapColor(intensity),
                            minHeight: '24px'
                          }}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {getDayName(dayIndex)} {hour}:00 - {(cellData?.conversions || 0)} conversions
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-4 mt-4">
            <span className="text-xs text-slate-500">Low</span>
            <div className="flex gap-0.5">
              {[0, 25, 50, 75, 100].map(intensity => (
                <div
                  key={intensity}
                  className="w-6 h-4 rounded"
                  style={{ backgroundColor: getHeatmapColor(intensity) }}
                ></div>
              ))}
            </div>
            <span className="text-xs text-slate-500">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeatmapChart
