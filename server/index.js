const express = require('express')
const cors = require('cors')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// In-memory data store (replace with database in production)
let dataStore = {
  clients: [
    { id: 'c1', name: 'TechCorp Solutions', logo: 'TC', industry: 'SaaS', status: 'active' },
    { id: 'c2', name: 'Fashion Forward', logo: 'FF', industry: 'E-commerce', status: 'active' },
    { id: 'c3', name: 'HealthPlus Medical', logo: 'HP', industry: 'Healthcare', status: 'active' },
  ],
  campaigns: [
    { id: 'camp1', clientId: 'c1', name: 'Q4 SaaS Lead Gen', platform: 'google', status: 'active', budget: 15000 },
    { id: 'camp2', clientId: 'c1', name: 'Brand Awareness', platform: 'facebook', status: 'active', budget: 8000 },
    { id: 'camp3', clientId: 'c2', name: 'Holiday Sale 2024', platform: 'facebook', status: 'active', budget: 20000 },
  ],
  metrics: {}
}

// Initialize metrics for each campaign
const today = new Date()
for (const campaign of dataStore.campaigns) {
  dataStore.metrics[campaign.id] = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const baseSpend = 200 + Math.random() * 300
    const impressions = Math.floor(baseSpend * (150 + Math.random() * 100))
    const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03))
    const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.1))
    
    dataStore.metrics[campaign.id].push({
      date: date.toISOString().split('T')[0],
      spend: Math.round(baseSpend * 100) / 100,
      impressions,
      clicks,
      conversions,
      ctr: (clicks / impressions) * 100,
      cpc: baseSpend / clicks
    })
  }
}

// ==================== API Routes ====================

// Get all clients
app.get('/api/clients', (req, res) => {
  const clientsWithMetrics = dataStore.clients.map(client => {
    const clientCampaigns = dataStore.campaigns.filter(c => c.clientId === client.id)
    let totalSpend = 0
    let totalConversions = 0
    
    clientCampaigns.forEach(campaign => {
      const metrics = dataStore.metrics[campaign.id] || []
      metrics.forEach(m => {
        totalSpend += m.spend
        totalConversions += m.conversions
      })
    })
    
    return {
      ...client,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalConversions,
      campaignCount: clientCampaigns.length
    }
  })
  
  res.json(clientsWithMetrics)
})

// Get client by ID
app.get('/api/clients/:id', (req, res) => {
  const client = dataStore.clients.find(c => c.id === req.params.id)
  if (!client) {
    return res.status(404).json({ error: 'Client not found' })
  }
  
  const clientCampaigns = dataStore.campaigns.filter(c => c.clientId === client.id)
  res.json({ ...client, campaigns: clientCampaigns })
})

// Get all campaigns
app.get('/api/campaigns', (req, res) => {
  const days = parseInt(req.query.days) || 30
  
  const campaignsWithMetrics = dataStore.campaigns.map(campaign => {
    const metrics = (dataStore.metrics[campaign.id] || []).slice(-days)
    const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0)
    const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0)
    const totalConversionValue = totalConversions * (50 + Math.random() * 100)
    
    return {
      ...campaign,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalConversions,
      roas: totalSpend > 0 ? Math.round(totalConversionValue / totalSpend * 100) / 100 : 0,
      cpa: totalConversions > 0 ? Math.round(totalSpend / totalConversions * 100) / 100 : 0
    }
  })
  
  res.json(campaignsWithMetrics)
})

// Get campaign by ID
app.get('/api/campaigns/:id', (req, res) => {
  const campaign = dataStore.campaigns.find(c => c.id === req.params.id)
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' })
  }
  
  const days = parseInt(req.query.days) || 30
  const metrics = (dataStore.metrics[campaign.id] || []).slice(-days)
  const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0)
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0)
  
  res.json({
    ...campaign,
    metrics,
    totals: {
      spend: Math.round(totalSpend * 100) / 100,
      conversions: totalConversions
    }
  })
})

// Update campaign
app.patch('/api/campaigns/:id', (req, res) => {
  const campaignIndex = dataStore.campaigns.findIndex(c => c.id === req.params.id)
  if (campaignIndex === -1) {
    return res.status(404).json({ error: 'Campaign not found' })
  }
  
  dataStore.campaigns[campaignIndex] = {
    ...dataStore.campaigns[campaignIndex],
    ...req.body
  }
  
  res.json(dataStore.campaigns[campaignIndex])
})

// ==================== Webhook Endpoints ====================

// Verify webhook signature (for production use)
const verifySignature = (payload, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(JSON.stringify(payload)).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

// Google Ads webhook receiver
app.post('/api/webhooks/google-ads', (req, res) => {
  const signature = req.headers['x-google-signature']
  
  // In production, verify signature here
  // if (!verifySignature(req.body, signature, process.env.GOOGLE_ADS_WEBHOOK_SECRET)) {
  //   return res.status(401).json({ error: 'Invalid signature' })
  // }
  
  const { campaignId, date, metrics } = req.body
  
  if (!campaignId || !date || !metrics) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  // Update metrics
  if (!dataStore.metrics[campaignId]) {
    dataStore.metrics[campaignId] = []
  }
  
  const existingIndex = dataStore.metrics[campaignId].findIndex(m => m.date === date)
  if (existingIndex !== -1) {
    dataStore.metrics[campaignId][existingIndex] = {
      ...dataStore.metrics[campaignId][existingIndex],
      ...metrics
    }
  } else {
    dataStore.metrics[campaignId].push({ date, ...metrics })
  }
  
  console.log(`Updated metrics for campaign ${campaignId} on ${date}`)
  res.json({ success: true, message: 'Metrics updated' })
})

// Facebook Ads webhook receiver
app.post('/api/webhooks/facebook-ads', (req, res) => {
  const signature = req.headers['x-facebook-signature']
  
  const { campaignId, date, metrics } = req.body
  
  if (!campaignId || !date || !metrics) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  // Update metrics (similar to Google Ads)
  if (!dataStore.metrics[campaignId]) {
    dataStore.metrics[campaignId] = []
  }
  
  const existingIndex = dataStore.metrics[campaignId].findIndex(m => m.date === date)
  if (existingIndex !== -1) {
    dataStore.metrics[campaignId][existingIndex] = {
      ...dataStore.metrics[campaignId][existingIndex],
      ...metrics
    }
  } else {
    dataStore.metrics[campaignId].push({ date, ...metrics })
  }
  
  console.log(`Updated Facebook metrics for campaign ${campaignId} on ${date}`)
  res.json({ success: true, message: 'Facebook metrics updated' })
})

// Generic webhook receiver for other platforms
app.post('/api/webhooks/:platform', (req, res) => {
  const { platform } = req.params
  const signature = req.headers['x-webhook-signature']
  
  const { campaignId, date, metrics } = req.body
  
  if (!campaignId || !date || !metrics) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  // Update metrics
  if (!dataStore.metrics[campaignId]) {
    dataStore.metrics[campaignId] = []
  }
  
  const existingIndex = dataStore.metrics[campaignId].findIndex(m => m.date === date)
  if (existingIndex !== -1) {
    dataStore.metrics[campaignId][existingIndex] = {
      ...dataStore.metrics[campaignId][existingIndex],
      ...metrics
    }
  } else {
    dataStore.metrics[campaignId].push({ date, ...metrics })
  }
  
  console.log(`Updated ${platform} metrics for campaign ${campaignId} on ${date}`)
  res.json({ success: true, message: `${platform} metrics updated` })
})

// ==================== CSV Import Endpoint ====================

// Parse CSV data
app.post('/api/import/csv', (req, res) => {
  const { platform, data: csvData } = req.body
  
  if (!platform || !csvData) {
    return res.status(400).json({ error: 'Missing platform or data' })
  }
  
  try {
    // Process CSV data
    const results = []
    
    csvData.forEach(row => {
      const campaignId = row.campaignId || row.campaign || row['Campaign ID']
      const date = row.date || row.Date
      
      if (campaignId && date) {
        if (!dataStore.metrics[campaignId]) {
          dataStore.metrics[campaignId] = []
        }
        
        const existingIndex = dataStore.metrics[campaignId].findIndex(m => m.date === date)
        const metrics = {
          spend: parseFloat(row.spend || row.Spend || row.cost || 0),
          impressions: parseInt(row.impressions || row.Impressions || 0),
          clicks: parseInt(row.clicks || row.Clicks || 0),
          conversions: parseInt(row.conversions || row.Conversions || 0)
        }
        
        if (existingIndex !== -1) {
          dataStore.metrics[campaignId][existingIndex] = {
            ...dataStore.metrics[campaignId][existingIndex],
            ...metrics
          }
        } else {
          dataStore.metrics[campaignId].push({ date, ...metrics })
        }
      }
    })
    
    res.json({ 
      success: true, 
      message: `Imported ${csvData.length} rows`,
      updatedCampaigns: [...new Set(csvData.map(r => r.campaignId || r.campaign))]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==================== Reports Endpoint ====================

// Generate report
app.post('/api/reports/generate', (req, res) => {
  const { type, clientId, dateRange } = req.body
  
  // Generate report based on type
  const report = {
    id: `report_${Date.now()}`,
    type,
    clientId,
    dateRange,
    generatedAt: new Date().toISOString(),
    data: {}
  }
  
  // Calculate metrics for report
  const days = parseInt(dateRange) || 30
  
  if (clientId) {
    const clientCampaigns = dataStore.campaigns.filter(c => c.clientId === clientId)
    report.data.totalSpend = 0
    report.data.totalConversions = 0
    
    clientCampaigns.forEach(campaign => {
      const metrics = (dataStore.metrics[campaign.id] || []).slice(-days)
      metrics.forEach(m => {
        report.data.totalSpend += m.spend
        report.data.totalConversions += m.conversions
      })
    })
  } else {
    // All campaigns
    dataStore.campaigns.forEach(campaign => {
      const metrics = (dataStore.metrics[campaign.id] || []).slice(-days)
      metrics.forEach(m => {
        report.data.totalSpend = (report.data.totalSpend || 0) + m.spend
        report.data.totalConversions = (report.data.totalConversions || 0) + m.conversions
      })
    })
  }
  
  res.json({ success: true, report })
})

// ==================== Health Check ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`)
  console.log(`📊 Dashboard: http://localhost:3000`)
  console.log(`\nWebhook endpoints:`)
  console.log(`  - POST /api/webhooks/google-ads`)
  console.log(`  - POST /api/webhooks/facebook-ads`)
  console.log(`  - POST /api/webhooks/:platform`)
})

module.exports = app
