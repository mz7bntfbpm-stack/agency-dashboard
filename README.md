# AgencyMetrics - Digital Marketing Analytics Dashboard

A comprehensive React-based analytics dashboard for digital marketing agencies to track client campaign performance across Google Ads, Facebook Ads, and GA4.

![Dashboard Preview](https://via.placeholder.com/800x400?text=AgencyMetrics+Dashboard)

## Features

### 📊 Main Dashboard
- **Period Selector**: Choose from Last 7, 14, 30, 90 days or custom date range
- **4 Main KPI Cards**: Total Spend, Conversions, ROAS, CPA with trend indicators
- **Interactive Charts**: Spend trends, client performance, platform distribution, performance heatmap
- **Quick Stats**: Top performing clients, campaign summary, platform breakdown

### 🔍 Campaign Drill-Down
- Click on any client to view detailed metrics
- Click on campaigns to see performance breakdown
- View impressions, clicks, CTR, CPC, conversions, and revenue
- Visual trend charts for daily performance

### 📝 Reports
- Generate PDF reports for client delivery
- Schedule weekly/monthly email reports
- Multiple report types: Performance, Financial, Executive Summary, Detailed Analysis
- Download templates for different platforms

### 📥 Data Import
- Drag & drop CSV uploads
- Support for GA4, Google Ads, Facebook Ads, Instagram exports
- Webhook receivers for real-time data updates
- Download CSV templates for each platform

### ⚙️ Settings
- Profile management
- Notification preferences
- API integrations configuration
- Appearance customization
- Security settings

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **CSV Parsing**: PapaParse
- **PDF Generation**: @react-pdf/renderer
- **Backend**: Node.js + Express
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**:
```bash
cd agency-dashboard
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to `http://localhost:3000`

### Running the Backend Server

The backend server handles webhooks and API endpoints:

```bash
# Start the API server
npm run server
```

The API server runs on `http://localhost:3001`

## Project Structure

```
agency-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── KPICard.jsx
│   │   ├── DateRangeSelector.jsx
│   │   ├── SpendTrendChart.jsx
│   │   ├── ClientPerformanceChart.jsx
│   │   ├── PlatformDistributionChart.jsx
│   │   ├── HeatmapChart.jsx
│   │   ├── CampaignTable.jsx
│   │   └── EditCampaignModal.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── ClientDetail.jsx
│   │   ├── CampaignDetail.jsx
│   │   ├── Reports.jsx
│   │   ├── ImportData.jsx
│   │   └── Settings.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useDashboard.js
│   ├── utils/               # Utility functions
│   │   └── formatters.js
│   ├── data/                # Sample data
│   │   └── sampleData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── index.js             # Express API server
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Live API Integration

### Setting Up Real Data

To connect to live advertising platforms, you'll need to:

1. **Obtain API Credentials** from each platform:
   - [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
   - [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis/)
   - [Google Analytics 4 API](https://developers.google.com/analytics/devguides/reporting/data/v1)

2. **Configure API Keys** in Settings > Integrations

3. **Set Up Webhooks** for real-time updates

### Webhook Endpoints

The backend provides webhook receivers for real-time data:

```
POST http://localhost:3001/api/webhooks/google-ads
POST http://localhost:3001/api/webhooks/facebook-ads
POST http://localhost:3001/api/webhooks/:platform
```

#### Webhook Payload Format

```json
{
  "campaignId": "camp1",
  "date": "2024-12-15",
  "metrics": {
    "spend": 1250.50,
    "impressions": 185000,
    "clicks": 3700,
    "conversions": 185
  }
}
```

#### Webhook Security

Add webhook signature verification in production:

```javascript
const crypto = require('crypto');

const verifySignature = (payload, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};
```

### CSV Import Format

#### Google Ads CSV Format
```csv
Date,Campaign,Impressions,Clicks,Spend,Conversions
2024-12-15,Q4 Lead Gen,185000,3700,1250.50,185
```

#### Facebook Ads CSV Format
```csv
Date,Campaign Name,Reach,Impressions,Clicks,Spend,Results
2024-12-15,Holiday Promo,52000,78000,1560,312
```

#### GA4 CSV Format
```csv
Date,Sessions,Users,Conversions,Revenue
2024-12-15,12450,9800,620,31000
```

## Customization

### Theming

Modify the color palette in `src/index.css`:

```css
:root {
  --color-good: #10b981;
  --color-bad: #ef4444;
  --color-warning: #f59e0b;
  --color-primary: #3b82f6;
}
```

### Adding New Platforms

1. Update the platform list in `src/pages/ImportData.jsx`
2. Add platform colors in `src/utils/formatters.js`
3. Create a webhook handler in `server/index.js`

### Adding New Chart Types

1. Create a new chart component in `src/components/`
2. Import and use in the relevant page
3. Add data aggregation logic in `src/hooks/useDashboard.js`

## Building for Production

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

The production files will be in the `dist/` directory.

## Backend Integration

For production deployment, integrate with:

- **Database**: PostgreSQL, MongoDB, or Firebase
- **Authentication**: JWT, OAuth, or session-based auth
- **Email**: Nodemailer for scheduled reports
- **Cron Jobs**: node-cron for scheduled tasks
- **File Storage**: AWS S3 or similar for report storage

### Example: Email Report Scheduling

```javascript
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Schedule weekly reports
cron.schedule('0 9 * * 1', async () => {
  // Generate and email weekly reports
  const report = await generateWeeklyReport();
  await sendEmail(report);
});
```

## License

MIT License - feel free to use this project for your agency or personal use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
