import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  aggregateMetrics, 
  getClientMetrics, 
  getDailyTrend, 
  getPlatformDistribution,
  getHeatmapData,
  sampleData
} from '../data/sampleData'

export const useDashboard = (days = 30) => {
  const [data, setData] = useState(sampleData)
  const [selectedDays, setSelectedDays] = useState(days)
  const [loading, setLoading] = useState(false)

  // Aggregate metrics for the dashboard
  const metrics = useMemo(() => {
    return aggregateMetrics(data?.dailyMetrics, selectedDays)
  }, [data?.dailyMetrics, selectedDays])

  // Daily trend data
  const dailyTrend = useMemo(() => {
    return getDailyTrend(data?.dailyMetrics, selectedDays)
  }, [data?.dailyMetrics, selectedDays])

  // Platform distribution
  const platformDistribution = useMemo(() => {
    return getPlatformDistribution(data?.dailyMetrics, data?.campaigns, selectedDays)
  }, [data?.dailyMetrics, data?.campaigns, selectedDays])

  // Heatmap data
  const heatmapData = useMemo(() => {
    return getHeatmapData(data?.dailyMetrics, selectedDays)
  }, [data?.dailyMetrics, selectedDays])

  // Client performance data
  const clientPerformance = useMemo(() => {
    if (!data?.clients || !Array.isArray(data.clients)) return []
    return data.clients.map(client => ({
      ...client,
      ...getClientMetrics(client.id, data?.campaigns, data?.dailyMetrics, selectedDays)
    }))
  }, [data?.clients, data?.campaigns, data?.dailyMetrics, selectedDays])

  const changeDays = useCallback((newDays) => {
    setLoading(true)
    setSelectedDays(newDays)
    setTimeout(() => setLoading(false), 300)
  }, [])

  return {
    data,
    metrics,
    dailyTrend,
    platformDistribution,
    heatmapData,
    clientPerformance,
    selectedDays,
    changeDays,
    loading
  }
}

export const useClientDetail = (clientId, data, days = 30) => {
  const client = useMemo(() => {
    if (!data?.clients || !Array.isArray(data.clients)) return null
    return data.clients.find(c => c && c.id === clientId) || null
  }, [data?.clients, clientId])

  const clientCampaigns = useMemo(() => {
    if (!data?.campaigns || !Array.isArray(data.campaigns)) return []
    return data.campaigns.filter(c => c && c.clientId === clientId)
  }, [data?.campaigns, clientId])

  const clientMetrics = useMemo(() => {
    return getClientMetrics(clientId, data?.campaigns, data?.dailyMetrics, days)
  }, [clientId, data?.campaigns, data?.dailyMetrics, days])

  const campaignMetrics = useMemo(() => {
    if (!clientCampaigns || !Array.isArray(clientCampaigns)) return []
    
    return clientCampaigns.map(campaign => {
      const metrics = data?.dailyMetrics?.[campaign.id]?.slice(-days) || []
      const totalSpend = metrics.reduce((sum, m) => sum + (m?.spend || 0), 0)
      const totalConversions = metrics.reduce((sum, m) => sum + (m?.conversions || 0), 0)
      const totalConversionValue = metrics.reduce((sum, m) => sum + (m?.conversionValue || 0), 0)
      const totalClicks = metrics.reduce((sum, m) => sum + (m?.clicks || 0), 0)
      const totalImpressions = metrics.reduce((sum, m) => sum + (m?.impressions || 0), 0)

      return {
        ...campaign,
        totalSpend: Math.round(totalSpend * 100) / 100,
        totalConversions,
        totalConversionValue: Math.round(totalConversionValue * 100) / 100,
        totalClicks,
        totalImpressions,
        roas: totalSpend > 0 ? Math.round(totalConversionValue / totalSpend * 100) / 100 : 0,
        cpa: totalConversions > 0 ? Math.round(totalSpend / totalConversions * 100) / 100 : 0,
        ctr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
        dailyMetrics: metrics
      }
    })
  }, [clientCampaigns, data?.dailyMetrics, days])

  return {
    client,
    clientCampaigns,
    clientMetrics,
    campaignMetrics
  }
}

export const useCampaignDetail = (campaignId, data, days = 30) => {
  const campaign = useMemo(() => {
    if (!data?.campaigns || !Array.isArray(data.campaigns)) return null
    return data.campaigns.find(c => c && c.id === campaignId) || null
  }, [data?.campaigns, campaignId])

  const metrics = useMemo(() => {
    if (!campaign || !data?.dailyMetrics) return null
    
    const dailyMetrics = data.dailyMetrics[campaignId]?.slice(-days) || []
    
    const totalSpend = dailyMetrics.reduce((sum, m) => sum + (m?.spend || 0), 0)
    const totalConversions = dailyMetrics.reduce((sum, m) => sum + (m?.conversions || 0), 0)
    const totalConversionValue = dailyMetrics.reduce((sum, m) => sum + (m?.conversionValue || 0), 0)
    const totalClicks = dailyMetrics.reduce((sum, m) => sum + (m?.clicks || 0), 0)
    const totalImpressions = dailyMetrics.reduce((sum, m) => sum + (m?.impressions || 0), 0)

    return {
      dailyMetrics,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalConversions,
      totalConversionValue: Math.round(totalConversionValue * 100) / 100,
      totalClicks,
      totalImpressions,
      roas: totalSpend > 0 ? Math.round(totalConversionValue / totalSpend * 100) / 100 : 0,
      cpa: totalConversions > 0 ? Math.round(totalSpend / totalConversions * 100) / 100 : 0,
      ctr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
      cpc: totalClicks > 0 ? Math.round(totalSpend / totalClicks * 100) / 100 : 0
    }
  }, [campaign, campaignId, data?.dailyMetrics, days])

  return { campaign, metrics }
}

export const useCSVImport = () => {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const importCSV = useCallback(async (file, onComplete) => {
    setImporting(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate CSV parsing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      if (onComplete) onComplete()
    } catch (err) {
      setError(err.message)
    } finally {
      setImporting(false)
    }
  }, [])

  return { importing, error, success, importCSV }
}

export const usePDFReport = () => {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const generatePDF = useCallback(async (reportData, options = {}) => {
    setGenerating(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('PDF generated:', reportData, options)
      return { success: true, filename: `report-${Date.now()}.pdf` }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setGenerating(false)
    }
  }, [])

  return { generating, error, generatePDF }
}
