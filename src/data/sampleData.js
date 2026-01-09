import { subDays, format, eachDayOfInterval } from 'date-fns'

// Generate sample data for the dashboard
export const generateSampleData = () => {
  const clients = [
    { id: 'c1', name: 'TechCorp Solutions', logo: 'TC', industry: 'SaaS', status: 'active' },
    { id: 'c2', name: 'Fashion Forward', logo: 'FF', industry: 'E-commerce', status: 'active' },
    { id: 'c3', name: 'HealthPlus Medical', logo: 'HP', industry: 'Healthcare', status: 'active' },
    { id: 'c4', name: 'Green Energy Co', logo: 'GE', industry: 'Energy', status: 'paused' },
    { id: 'c5', name: 'Digital Dynamics', logo: 'DD', industry: 'Technology', status: 'active' },
  ]

  const campaigns = [
    { id: 'camp1', clientId: 'c1', name: 'Q4 SaaS Lead Gen', platform: 'google', status: 'active', budget: 15000 },
    { id: 'camp2', clientId: 'c1', name: 'Brand Awareness', platform: 'facebook', status: 'active', budget: 8000 },
    { id: 'camp3', clientId: 'c1', name: 'Product Launch', platform: 'google', status: 'active', budget: 25000 },
    { id: 'camp4', clientId: 'c2', name: 'Holiday Sale 2024', platform: 'facebook', status: 'active', budget: 20000 },
    { id: 'camp5', clientId: 'c2', name: 'New Collection Launch', platform: 'instagram', status: 'active', budget: 12000 },
    { id: 'camp6', clientId: 'c2', name: 'Retargeting Campaign', platform: 'facebook', status: 'active', budget: 5000 },
    { id: 'camp7', clientId: 'c3', name: 'Patient Acquisition', platform: 'google', status: 'active', budget: 18000 },
    { id: 'camp8', clientId: 'c3', name: 'Telemedicine Promo', platform: 'facebook', status: 'active', budget: 7500 },
    { id: 'camp9', clientId: 'c4', name: 'Solar Panel Promotion', platform: 'google', status: 'paused', budget: 10000 },
    { id: 'camp10', clientId: 'c5', name: 'Developer Outreach', platform: 'linkedin', status: 'active', budget: 9000 },
    { id: 'camp11', clientId: 'c5', name: 'Tech Blog Sponsorship', platform: 'google', status: 'active', budget: 6000 },
  ]

  const today = new Date()
  const generateDailyMetrics = (campaignId, days = 90) => {
    const metrics = []
    const daysInterval = eachDayOfInterval({
      start: subDays(today, days - 1),
      end: today
    })

    daysInterval.forEach((date) => {
      const baseSpend = 200 + Math.random() * 300
      const impressions = Math.floor(baseSpend * (150 + Math.random() * 100))
      const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03))
      const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.1))
      const conversionValue = conversions * (50 + Math.random() * 100)

      // Add weekly pattern for heatmap
      const dayOfWeek = date.getDay()
      const hourOfDay = Math.floor(Math.random() * 24)
      
      metrics.push({
        date: format(date, 'yyyy-MM-dd'),
        dayOfWeek,
        hourOfDay,
        spend: Math.round(baseSpend * 100) / 100,
        impressions,
        clicks,
        ctr: clicks > 0 ? (clicks / impressions) * 100 : 0,
        conversions,
        cpc: clicks > 0 ? baseSpend / clicks : 0,
        conversionValue: Math.round(conversionValue * 100) / 100,
      })
    })

    return metrics
  }

  const dailyMetrics = {}
  campaigns.forEach(campaign => {
    dailyMetrics[campaign.id] = generateDailyMetrics(campaign.id, 90)
  })

  return { clients, campaigns, dailyMetrics }
}

export const aggregateMetrics = (dailyMetrics, days = 30) => {
  // Handle edge cases
  if (!dailyMetrics || typeof dailyMetrics !== 'object') {
    return {
      totalSpend: 0, totalConversions: 0, totalConversionValue: 0,
      roas: 0, cpa: 0, ctr: 0, cpc: 0, totalClicks: 0, totalImpressions: 0
    }
  }

  let totalSpend = 0
  let totalConversions = 0
  let totalConversionValue = 0
  let totalClicks = 0
  let totalImpressions = 0

  Object.values(dailyMetrics).forEach(metrics => {
    if (!Array.isArray(metrics)) return
    const recentMetrics = metrics.slice(-days)
    recentMetrics.forEach(m => {
      if (m && typeof m === 'object') {
        totalSpend += m.spend || 0
        totalConversions += m.conversions || 0
        totalConversionValue += m.conversionValue || 0
        totalClicks += m.clicks || 0
        totalImpressions += m.impressions || 0
      }
    })
  })

  const roas = totalSpend > 0 ? totalConversionValue / totalSpend : 0
  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
  const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0

  return {
    totalSpend: Math.round(totalSpend * 100) / 100,
    totalConversions,
    totalConversionValue: Math.round(totalConversionValue * 100) / 100,
    roas: Math.round(roas * 100) / 100,
    cpa: Math.round(cpa * 100) / 100,
    ctr: Math.round(ctr * 100) / 100,
    cpc: Math.round(cpc * 100) / 100,
    totalClicks,
    totalImpressions
  }
}

export const getClientMetrics = (clientId, campaigns, dailyMetrics, days = 30) => {
  if (!campaigns || !Array.isArray(campaigns)) {
    return { totalSpend: 0, totalConversions: 0, totalConversionValue: 0, roas: 0, campaignCount: 0 }
  }

  const clientCampaigns = campaigns.filter(c => c && c.clientId === clientId)
  let totalSpend = 0
  let totalConversions = 0
  let totalConversionValue = 0

  clientCampaigns.forEach(campaign => {
    if (!campaign || !dailyMetrics) return
    const metrics = dailyMetrics[campaign.id]?.slice(-days) || []
    metrics.forEach(m => {
      if (m && typeof m === 'object') {
        totalSpend += m.spend || 0
        totalConversions += m.conversions || 0
        totalConversionValue += m.conversionValue || 0
      }
    })
  })

  return {
    totalSpend: Math.round(totalSpend * 100) / 100,
    totalConversions,
    totalConversionValue: Math.round(totalConversionValue * 100) / 100,
    roas: totalSpend > 0 ? Math.round(totalConversionValue / totalSpend * 100) / 100 : 0,
    campaignCount: clientCampaigns.length
  }
}

export const getDailyTrend = (dailyMetrics, days = 30) => {
  const result = []
  
  // Get the last N days
  const today = new Date()
  const daysInterval = eachDayOfInterval({
    start: subDays(today, days - 1),
    end: today
  })

  // Initialize with zeros
  daysInterval.forEach(date => {
    result.push({
      date: format(date, 'yyyy-MM-dd'),
      spend: 0,
      conversions: 0,
      impressions: 0,
      clicks: 0,
      cpa: 0
    })
  })

  // Aggregate metrics by date
  if (dailyMetrics && typeof dailyMetrics === 'object') {
    Object.values(dailyMetrics).forEach(metrics => {
      if (!Array.isArray(metrics)) return
      metrics.slice(-days).forEach(m => {
        if (!m || typeof m !== 'object') return
        const dayData = result.find(d => d.date === m.date)
        if (dayData) {
          dayData.spend += m.spend || 0
          dayData.conversions += m.conversions || 0
          dayData.impressions += m.impressions || 0
          dayData.clicks += m.clicks || 0
        }
      })
    })
  }

  // Final calculations
  return result.map(d => ({
    ...d,
    spend: Math.round(d.spend * 100) / 100,
    cpa: d.conversions > 0 ? Math.round(d.spend / d.conversions * 100) / 100 : 0
  }))
}

export const getPlatformDistribution = (dailyMetrics, campaigns, days = 30) => {
  const platformSpend = {}

  if (campaigns && Array.isArray(campaigns)) {
    campaigns.forEach(campaign => {
      if (!campaign) return
      const metrics = dailyMetrics?.[campaign.id]?.slice(-days) || []
      metrics.forEach(m => {
        if (!m || typeof m !== 'object') return
        const platform = campaign.platform || 'unknown'
        platformSpend[platform] = (platformSpend[platform] || 0) + (m.spend || 0)
      })
    })
  }

  return Object.entries(platformSpend).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value * 100) / 100
  }))
}

export const getHeatmapData = (dailyMetrics, days = 30) => {
  const heatmapData = []
  
  // Get all metrics as a flat array
  let allMetrics = []
  if (dailyMetrics && typeof dailyMetrics === 'object') {
    allMetrics = Object.values(dailyMetrics).flat().slice(-(days * 11))
  }

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const dayMetrics = allMetrics.filter(m => m && m.dayOfWeek === day && m.hourOfDay === hour)
      const totalConversions = dayMetrics.reduce((sum, m) => sum + (m?.conversions || 0), 0)
      
      heatmapData.push({
        day,
        hour,
        conversions: totalConversions,
        intensity: Math.min(100, totalConversions * 2)
      })
    }
  }

  return heatmapData
}

export const sampleData = generateSampleData()
