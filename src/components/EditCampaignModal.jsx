import { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'

const EditCampaignModal = ({ isOpen, onClose, campaign, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    budget: 0,
    platform: '',
    status: ''
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        budget: campaign.budget || 0,
        platform: campaign.platform || '',
        status: campaign.status || 'active'
      })
    }
  }, [campaign])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }))
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required'
    }
    
    if (formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative'
    }
    
    if (!formData.platform) {
      newErrors.platform = 'Platform is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave({ ...campaign, ...formData })
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save changes. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !campaign) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Edit Campaign</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-dark-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-dark-600'
              }`}
              placeholder="Enter campaign name"
            />
            {errors.name && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-dark-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.platform ? 'border-red-500' : 'border-dark-600'
              }`}
            >
              <option value="">Select platform</option>
              <option value="google">Google Ads</option>
              <option value="facebook">Facebook Ads</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="tiktok">TikTok</option>
            </select>
            {errors.platform && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.platform}
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Daily Budget (€)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 bg-dark-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.budget ? 'border-red-500' : 'border-dark-600'
              }`}
              placeholder="0.00"
            />
            {errors.budget && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.budget}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Status
            </label>
            <div className="flex gap-3">
              {['active', 'paused'].map((status) => (
                <label
                  key={status}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.status === status
                      ? status === 'active'
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                      : 'bg-dark-700 border-dark-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="capitalize font-medium">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errors.submit}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-dark-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCampaignModal
