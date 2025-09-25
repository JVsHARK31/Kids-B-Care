import { useState } from 'react'
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  User,
  Lock,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Info,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useAppContext } from '../App'

const SettingsPage = () => {
  const { userMode, setUserMode, settings, setSettings, detections, setDetections } = useAppContext()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  // Update settings
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Clear all data
  const clearAllData = () => {
    setDetections([])
    setShowDeleteConfirm(false)
    // In a real app, you'd also clear from backend/localStorage
  }

  // Export data
  const exportData = () => {
    const dataToExport = {
      detections,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kids-b-care-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import data
  const importData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          if (importedData.detections) {
            setDetections(importedData.detections)
          }
          if (importedData.settings) {
            setSettings(importedData.settings)
          }
          alert('Data imported successfully!')
        } catch (error) {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const settingSections = [
    {
      title: 'General Settings',
      icon: Settings,
      items: [
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'id', label: 'Bahasa Indonesia' }
          ]
        },
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose between light and dark mode',
          type: 'select',
          options: [
            { value: 'light', label: 'Light Mode' },
            { value: 'dark', label: 'Dark Mode' },
            { value: 'auto', label: 'Auto (System)' }
          ]
        }
      ]
    },
    {
      title: 'Audio & Accessibility',
      icon: Volume2,
      items: [
        {
          key: 'voiceFeedback',
          label: 'Voice Feedback',
          description: 'Enable audio feedback for detections',
          type: 'switch'
        },
        {
          key: 'soundEffects',
          label: 'Sound Effects',
          description: 'Play sounds for interactions',
          type: 'switch'
        },
        {
          key: 'highContrast',
          label: 'High Contrast Mode',
          description: 'Improve visibility for better accessibility',
          type: 'switch'
        },
        {
          key: 'largeText',
          label: 'Large Text',
          description: 'Use larger fonts for better readability',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Privacy & Safety',
      icon: Shield,
      items: [
        {
          key: 'faceBlur',
          label: 'Face Blurring',
          description: 'Automatically blur faces in saved images',
          type: 'switch'
        },
        {
          key: 'dataCollection',
          label: 'Anonymous Analytics',
          description: 'Help improve the app by sharing anonymous usage data',
          type: 'switch'
        },
        {
          key: 'parentalPin',
          label: 'Parental PIN',
          description: 'Require PIN to access parent/admin modes',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Detection Settings',
      icon: User,
      items: [
        {
          key: 'confidenceThreshold',
          label: 'Confidence Threshold',
          description: 'Minimum confidence level for showing detections',
          type: 'select',
          options: [
            { value: '0.3', label: 'Low (30%)' },
            { value: '0.5', label: 'Medium (50%)' },
            { value: '0.7', label: 'High (70%)' },
            { value: '0.9', label: 'Very High (90%)' }
          ]
        },
        {
          key: 'maxDetections',
          label: 'Max Detections per Image',
          description: 'Maximum number of objects to detect in one image',
          type: 'select',
          options: [
            { value: '5', label: '5 objects' },
            { value: '10', label: '10 objects' },
            { value: '20', label: '20 objects' },
            { value: '50', label: '50 objects' }
          ]
        },
        {
          key: 'autoSave',
          label: 'Auto-save Detections',
          description: 'Automatically save all detection results',
          type: 'switch'
        }
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Settings ⚙️
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Customize your exploration experience!" 
            : "Configure your Kids B-Care preferences"
          }
        </p>
      </div>

      {/* User Mode Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-bold text-purple-700">Current Mode</h3>
                <p className="text-sm text-purple-600">
                  You are in <Badge className="bg-purple-500 text-white">{userMode}</Badge> mode
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Switch mode using the button in the top navigation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settingSections.map((section) => {
        const Icon = section.icon
        
        return (
          <Card key={section.title} className="kids-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon className="w-5 h-5 text-purple-500" />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-700">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  
                  <div className="ml-4">
                    {item.type === 'switch' ? (
                      <Switch
                        checked={settings[item.key] || false}
                        onCheckedChange={(checked) => updateSetting(item.key, checked)}
                      />
                    ) : item.type === 'select' ? (
                      <Select
                        value={settings[item.key] || item.options[0].value}
                        onValueChange={(value) => updateSetting(item.key, value)}
                      >
                        <SelectTrigger className="w-40 border-2 border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      {/* Data Management */}
      <Card className="kids-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-500" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Data */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Download className="w-6 h-6 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-blue-700">Export Data</h4>
                  <p className="text-sm text-blue-600">Download your detection history</p>
                </div>
              </div>
              <Button 
                onClick={exportData}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={detections.length === 0}
              >
                Export All Data
              </Button>
            </div>

            {/* Import Data */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="w-6 h-6 text-green-500" />
                <div>
                  <h4 className="font-semibold text-green-700">Import Data</h4>
                  <p className="text-sm text-green-600">Restore from backup file</p>
                </div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <Button 
                onClick={() => document.getElementById('import-file').click()}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Import Data
              </Button>
            </div>
          </div>

          {/* Clear Data */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-6 h-6 text-red-500" />
                <div>
                  <h4 className="font-semibold text-red-700">Clear All Data</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete all detection history ({detections.length} items)
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                disabled={detections.length === 0}
              >
                Clear Data
              </Button>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-red-600">Confirm Delete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Are you sure you want to delete all detection data? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={clearAllData}
                      variant="destructive"
                      className="flex-1"
                    >
                      Yes, Delete All
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="kids-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-purple-500" />
            <span>About Kids B-Care</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-purple-700">Kids B-Care v1.0.0</h3>
              <p className="text-gray-600">AI-Powered Object Explorer for Kids</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-bold text-purple-600">Safe</div>
                <div className="text-sm text-gray-600">Child-friendly design</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600">Smart</div>
                <div className="text-sm text-gray-600">AI-powered detection</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-green-600">Educational</div>
                <div className="text-sm text-gray-600">Learn through exploration</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-bold text-yellow-600">Fun</div>
                <div className="text-sm text-gray-600">Engaging experience</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Built with ❤️ for curious young minds
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kid-specific Safety Message */}
      {userMode === 'kid' && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">🛡️✨</div>
            <h3 className="text-xl font-bold text-green-700">
              Safe Exploring Reminders
            </h3>
            <div className="space-y-2 text-green-600">
              <p>🔒 Your privacy is always protected</p>
              <p>👨‍👩‍👧‍👦 Ask a grown-up before changing settings</p>
              <p>📸 Only take pictures of safe objects</p>
              <p>💝 Have fun and keep learning!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SettingsPage
