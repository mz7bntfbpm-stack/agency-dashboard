import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, XCircle, Loader2, Download, Database, Cloud, RefreshCw } from 'lucide-react'

const platforms = [
  { id: 'ga4', name: 'Google Analytics 4', icon: '📊', color: '#f9ab00' },
  { id: 'google_ads', name: 'Google Ads', icon: '🔍', color: '#4285f4' },
  { id: 'facebook', name: 'Facebook Ads', icon: '📘', color: '#1877f2' },
  { id: 'instagram', name: 'Instagram Insights', icon: '📷', color: '#e4405f' },
]

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [importing, setImporting] = useState(false)
  const [importStatus, setImportStatus] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState('ga4')

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const validateFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase()
    if (extension !== 'csv') return { valid: false, error: 'Invalid file type. Please upload a CSV file.' }
    if (file.size > 10 * 1024 * 1024) return { valid: false, error: 'File too large. Maximum size is 10MB.' }
    return { valid: true }
  }

  const handleImport = async () => {
    if (files.length === 0) {
      setImportStatus({ type: 'error', message: 'Please select at least one file to import.' })
      return
    }
    setImporting(true)
    setImportStatus(null)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setImportStatus({ type: 'success', message: `Successfully imported ${files.length} file(s). Data has been processed.` })
    setFiles([])
    setImporting(false)
  }

  const downloadTemplate = (platform) => {
    const templates = {
      ga4: ['Date', 'Sessions', 'Users', 'Conversions', 'Revenue'],
      google_ads: ['Date', 'Campaign', 'Impressions', 'Clicks', 'Spend', 'Conversions'],
      facebook: ['Date', 'Campaign Name', 'Reach', 'Impressions', 'Clicks', 'Spend', 'Results'],
    }
    const csvContent = templates[platform].join(',') + '\n'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${platform}_template.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Import Data</h1>
        <p className="text-slate-400 mt-1">Upload CSV exports from your advertising platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Select Data Source</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {platforms.map(platform => (
                <button key={platform.id} onClick={() => setSelectedPlatform(platform.id)} className={`p-4 rounded-lg border text-center transition-all ${selectedPlatform === platform.id ? 'bg-dark-700 border-blue-500/50' : 'bg-dark-700/30 border-dark-600'}`}>
                  <span className="text-2xl block mb-2">{platform.icon}</span>
                  <span className={`text-sm font-medium ${selectedPlatform === platform.id ? 'text-blue-400' : 'text-white'}`}>{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Drop Zone */}
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`bg-dark-800/50 border-2 border-dashed rounded-xl p-8 transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-dark-600'}`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${dragActive ? 'bg-blue-500' : 'bg-dark-700'}`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-slate-400'}`} />
              </div>
              <p className="text-lg font-medium text-white mb-2">{dragActive ? 'Drop files here' : 'Drag & drop CSV files here'}</p>
              <p className="text-sm text-slate-400 mb-4">or click to browse</p>
              <input type="file" accept=".csv" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium cursor-pointer">
                <FileText className="w-4 h-4" />Browse Files
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Selected Files</h3>
                <button onClick={() => setFiles([])} className="text-sm text-slate-400 hover:text-white">Clear all</button>
              </div>
              <div className="space-y-2">
                {files.map((file, index) => {
                  const validation = validateFile(file)
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${validation.valid ? 'bg-dark-700/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <div className="flex items-center gap-3">
                        <FileText className={`w-5 h-5 ${validation.valid ? 'text-blue-400' : 'text-red-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB {!validation.valid && <span className="text-red-400">- {validation.error}</span>}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(index)} className="p-1.5 rounded-lg text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Import Status */}
          {importStatus && (
            <div className={`p-4 rounded-xl border ${importStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-start gap-3">
                {importStatus.type === 'success' ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertCircle className="w-6 h-6 text-red-400" />}
                <div>
                  <p className={`font-medium ${importStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{importStatus.type === 'success' ? 'Import Successful' : 'Import Failed'}</p>
                  <p className="text-sm text-slate-400 mt-1">{importStatus.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Import Button */}
          <button onClick={handleImport} disabled={files.length === 0 || importing} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">
            {importing ? <><Loader2 className="w-5 h-5 animate-spin" />Processing...</> : <><Database className="w-5 h-5" />Import Data</>}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Templates */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Download Templates</h3>
            <div className="space-y-2">
              {platforms.map(platform => (
                <button key={platform.id} onClick={() => downloadTemplate(platform.id)} className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-sm text-white">{platform.name}</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Webhook */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Real-time Integration</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-dark-700/30">
                <p className="text-sm text-slate-400 mb-2">Webhook URL</p>
                <code className="text-xs text-blue-400 bg-dark-800 px-2 py-1 rounded block">https://api.example.com/webhooks</code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cloud className="w-4 h-4 text-emerald-400" /><span className="text-slate-400">Receive real-time updates</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm"><RefreshCw className="w-4 h-4" />Configure Webhook</button>
            </div>
          </div>

          {/* Help */}
          <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Import Guidelines</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>CSV files must have headers</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Date format: YYYY-MM-DD</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Max file size: 10MB</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
