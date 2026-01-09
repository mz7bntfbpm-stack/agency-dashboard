import { useState, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardPage from './pages/DashboardPage'
import ClientDetailPage from './pages/ClientDetailPage'
import CampaignDetailPage from './pages/CampaignDetailPage'
import ReportsPage from './pages/ReportsPage'
import ImportPage from './pages/ImportPage'
import SettingsPage from './pages/SettingsPage'
import { sampleData } from './data/sampleData'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [data] = useState(sampleData)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleAdminMode = () => setIsAdmin(!isAdmin)

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0f172a]">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Header 
            toggleSidebar={toggleSidebar} 
            isAdmin={isAdmin} 
            toggleAdminMode={toggleAdminMode}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardPage data={data} />} />
              <Route path="/client/:clientId" element={<ClientDetailPage data={data} isAdmin={isAdmin} />} />
              <Route path="/campaign/:campaignId" element={<CampaignDetailPage data={data} isAdmin={isAdmin} />} />
              <Route path="/reports" element={<ReportsPage data={data} />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
