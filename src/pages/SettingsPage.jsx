import { useState } from 'react'
import { 
  Settings, 
  User, 
  Baby, 
  Palette, 
  Volume2, 
  VolumeX,
  Globe,
  Moon,
  Sun,
  Save,
  RotateCcw
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAppContext } from '../App'

const SettingsPage = () => {
  const { userMode, setUserMode, settings, setSettings } = useAppContext()
  const [localSettings, setLocalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    setHasChanges(true)
  }

  const saveSettings = () => {
    setSettings(localSettings)
    setHasChanges(false)
  }

  const resetSettings = () => {
    setLocalSettings({
      language: 'en',
      voiceFeedback: false,
      theme: 'light'
    })
    setHasChanges(true)
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const themes = [
    { code: 'light', name: 'Light Mode', icon: Sun, color: 'text-yellow-500' },
    { code: 'dark', name: 'Dark Mode', icon: Moon, color: 'text-blue-500' },
    { code: 'auto', name: 'Auto', icon: Settings, color: 'text-gray-500' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          {userMode === 'kid' ? 'My Settings ⚙️🎨' : 'Settings ⚙️🎨'}
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Atur aplikasi sesuai keinginan kamu!" 
            : "Customize your Kids B-Care experience"
          }
        </p>
      </div>

      {/* User Mode Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6 text-purple-500" />
            <span>User Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {userMode === 'kid' 
              ? 'Pilih mode yang sesuai dengan kamu:' 
              : 'Choose the interface mode:'
            }
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                userMode === 'kid' 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
              onClick={() => setUserMode('kid')}
            >
              <div className="flex items-center space-x-3">
                <Baby className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="font-semibold text-gray-800">Kid Mode</div>
                  <div className="text-sm text-gray-600">
                    Fun, colorful interface with simple language
                  </div>
                </div>
                {userMode === 'kid' && (
                  <Badge className="ml-auto bg-purple-100 text-purple-700">Active</Badge>
                )}
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                userMode === 'parent' 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setUserMode('parent')}
            >
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="font-semibold text-gray-800">Parent Mode</div>
                  <div className="text-sm text-gray-600">
                    Detailed interface with comprehensive information
                  </div>
                </div>
                {userMode === 'parent' && (
                  <Badge className="ml-auto bg-blue-100 text-blue-700">Active</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-green-500" />
            <span>Language</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {userMode === 'kid' 
              ? 'Pilih bahasa yang kamu suka:' 
              : 'Choose your preferred language:'
            }
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {languages.map((lang) => (
              <div 
                key={lang.code}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  localSettings.language === lang.code 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 hover:border-green-200'
                }`}
                onClick={() => handleSettingChange('language', lang.code)}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.name}</div>
                {localSettings.language === lang.code && (
                  <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Selected</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-6 h-6 text-pink-500" />
            <span>Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {userMode === 'kid' 
              ? 'Pilih tema yang kamu suka:' 
              : 'Choose your preferred theme:'
            }
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon
              return (
                <div 
                  key={theme.code}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    localSettings.theme === theme.code 
                      ? 'border-pink-400 bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => handleSettingChange('theme', theme.code)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${theme.color}`} />
                    <div>
                      <div className="font-semibold text-gray-800">{theme.name}</div>
                      <div className="text-sm text-gray-600">
                        {theme.code === 'light' ? 'Bright and colorful' :
                         theme.code === 'dark' ? 'Easy on the eyes' :
                         'Follows system setting'}
                      </div>
                    </div>
                    {localSettings.theme === theme.code && (
                      <Badge className="ml-auto bg-pink-100 text-pink-700">Active</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {localSettings.voiceFeedback ? (
              <Volume2 className="w-6 h-6 text-blue-500" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-500" />
            )}
            <span>Audio Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {userMode === 'kid' 
              ? 'Aktifkan suara untuk pengalaman yang lebih menyenangkan:' 
              : 'Enable audio feedback for better experience:'
            }
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-800">Voice Feedback</div>
              <div className="text-sm text-gray-600">
                {localSettings.voiceFeedback 
                  ? 'Audio feedback is enabled' 
                  : 'Audio feedback is disabled'
                }
              </div>
            </div>
            <Button
              variant={localSettings.voiceFeedback ? 'default' : 'outline'}
              onClick={() => handleSettingChange('voiceFeedback', !localSettings.voiceFeedback)}
              className={localSettings.voiceFeedback ? 'bg-blue-500' : ''}
            >
              {localSettings.voiceFeedback ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {hasChanges && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-700 mb-1">
                  {userMode === 'kid' ? 'Ada perubahan yang belum disimpan!' : 'You have unsaved changes!'}
                </h3>
                <p className="text-sm text-green-600">
                  {userMode === 'kid' 
                    ? 'Klik Save untuk menyimpan pengaturan kamu' 
                    : 'Click Save to apply your settings'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={saveSettings}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* App Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            Kids B-Care v1.0.0
          </h3>
          <p className="text-purple-600 mb-4">
            {userMode === 'kid' 
              ? 'Aplikasi eksplorasi makanan terbaik untuk anak-anak!' 
              : 'The best nutrition exploration app for kids!'
            }
          </p>
          <div className="flex justify-center space-x-4 text-sm text-purple-500">
            <span>Made with ❤️</span>
            <span>•</span>
            <span>AI-Powered</span>
            <span>•</span>
            <span>Kid-Safe</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage