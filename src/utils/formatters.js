// Format currency
export const formatCurrency = (value, currency = 'EUR') => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format number with thousand separators
export const formatNumber = (value) => {
  return new Intl.NumberFormat('de-DE').format(value)
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`
}

// Format large numbers (K, M, B)
export const formatCompactNumber = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

// Get trend color based on value and threshold
export const getTrendColor = (value, isGoodHigh = true) => {
  if (value === 0) return 'text-slate-400'
  if (isGoodHigh) {
    return value > 0 ? 'text-emerald-400' : 'text-red-400'
  }
  return value < 0 ? 'text-emerald-400' : 'text-red-400'
}

// Get KPI status color
export const getKPIStatus = (value, type = 'spend') => {
  // Define thresholds for different metrics
  const thresholds = {
    roas: { good: 3, warning: 2 },
    cpa: { good: 30, warning: 50 },
    ctr: { good: 3, warning: 1.5 },
    conversions: { good: 100, warning: 50 }
  }

  const threshold = thresholds[type]
  if (!threshold) return 'neutral'

  if (type === 'cpa') {
    if (value <= threshold.good) return 'good'
    if (value <= threshold.warning) return 'warning'
    return 'bad'
  }

  if (value >= threshold.good) return 'good'
  if (value >= threshold.warning) return 'warning'
  return 'bad'
}

// Get heatmap color based on value
export const getHeatmapColor = (intensity) => {
  if (intensity < 20) return '#1e293b'
  if (intensity < 40) return '#1e3a5f'
  if (intensity < 60) return '#1d4ed8'
  if (intensity < 80) return '#3b82f6'
  return '#60a5fa'
}

// Get day name from number
export const getDayName = (dayNumber) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[dayNumber]
}

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'status-active',
    paused: 'status-paused',
    ended: 'status-ended'
  }
  return classes[status] || 'status-ended'
}

// Get platform color
export const getPlatformColor = (platform) => {
  const colors = {
    google: '#4285f4',
    facebook: '#1877f2',
    instagram: '#e4405f',
    linkedin: '#0a66c2',
    twitter: '#1da1f2',
    tiktok: '#000000'
  }
  return colors[platform] || '#64748b'
}

// Format date for display
export const formatDate = (dateStr, format = 'short') => {
  const date = new Date(dateStr)
  const options = format === 'short' 
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'long', year: 'numeric' }
  return new Intl.DateTimeFormat('de-DE', options).format(date)
}

// Calculate percentage change
export const calculateChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
