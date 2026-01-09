import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

const DateRangeSelector = ({ selectedDays, onChange, showCustom = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const presets = [
    { label: 'Today', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ]

  const getSelectedLabel = () => {
    const preset = presets.find(p => p.days === selectedDays)
    if (preset) return preset.label
    return `${selectedDays} days`
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white hover:border-blue-500 transition-colors"
      >
        <Calendar className="w-4 h-4 text-slate-400" />
        <span>{getSelectedLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 animate-fadeIn">
          <div className="p-2">
            {presets.map((preset) => (
              <button
                key={preset.days}
                onClick={() => {
                  onChange(preset.days)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDays === preset.days
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <span>{preset.label}</span>
                {selectedDays === preset.days && (
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                )}
              </button>
            ))}
            {showCustom && (
              <>
                <div className="my-2 border-t border-dark-700"></div>
                <button
                  onClick={() => {
                    // In a real app, this would open a custom date picker
                    const customDays = prompt('Enter number of days:', '60')
                    if (customDays && !isNaN(customDays)) {
                      onChange(parseInt(customDays))
                      setIsOpen(false)
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Custom range...</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangeSelector
