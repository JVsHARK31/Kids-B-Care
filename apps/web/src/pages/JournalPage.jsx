import { useState, useMemo } from 'react'
import { 
  BookOpen, 
  Calendar, 
  Camera, 
  Upload, 
  Search,
  Filter,
  Star,
  Trash2,
  Download,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppContext } from '../App'

const JournalPage = () => {
  const { detections, setDetections, userMode } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSource, setFilterSource] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedDetection, setSelectedDetection] = useState(null)

  // Filter and sort detections
  const filteredDetections = useMemo(() => {
    let filtered = detections.filter(detection => {
      const matchesSearch = detection.results.some(result => 
        result.class_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const matchesSource = filterSource === 'all' || detection.source === filterSource
      
      return matchesSearch && matchesSource
    })

    // Sort detections
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp)
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp)
        case 'most_objects':
          return b.results.length - a.results.length
        case 'highest_confidence':
          const aMaxConf = Math.max(...a.results.map(r => r.confidence))
          const bMaxConf = Math.max(...b.results.map(r => r.confidence))
          return bMaxConf - aMaxConf
        default:
          return 0
      }
    })

    return filtered
  }, [detections, searchTerm, filterSource, sortBy])

  // Get statistics
  const stats = useMemo(() => {
    const totalDetections = detections.length
    const totalObjects = detections.reduce((sum, d) => sum + d.results.length, 0)
    const uniqueObjects = new Set(
      detections.flatMap(d => d.results.map(r => r.class_name))
    ).size
    const avgConfidence = detections.length > 0 
      ? detections.reduce((sum, d) => {
          const avgDetectionConf = d.results.reduce((s, r) => s + r.confidence, 0) / d.results.length
          return sum + avgDetectionConf
        }, 0) / detections.length
      : 0

    return {
      totalDetections,
      totalObjects,
      uniqueObjects,
      avgConfidence: Math.round(avgConfidence * 100)
    }
  }, [detections])

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString()
  }

  // Delete detection
  const deleteDetection = (detectionId) => {
    setDetections(prev => prev.filter(d => d.id !== detectionId))
    if (selectedDetection?.id === detectionId) {
      setSelectedDetection(null)
    }
  }

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500'
    if (confidence >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Get kid-friendly messages
  const getKidMessage = () => {
    if (detections.length === 0) {
      return "No adventures yet! Go explore and discover cool things! 🔍"
    }
    if (detections.length === 1) {
      return "You've started your exploration journey! Keep going! 🌟"
    }
    return `Wow! You've discovered ${stats.totalObjects} objects in ${stats.totalDetections} adventures! 🎉`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Exploration Journal 📖
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Look at all the amazing things you've discovered!" 
            : "Review your object detection history and discoveries"
          }
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.totalDetections}</div>
            <div className="text-sm text-purple-700">
              {userMode === 'kid' ? 'Adventures' : 'Detections'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalObjects}</div>
            <div className="text-sm text-blue-700">Objects Found</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.uniqueObjects}</div>
            <div className="text-sm text-green-700">Unique Types</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.avgConfidence}%</div>
            <div className="text-sm text-orange-700">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Kid-friendly message */}
      {userMode === 'kid' && (
        <Card className="bg-gradient-to-r from-yellow-50 to-pink-50 border-2 border-yellow-300">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-lg font-bold text-purple-700">
              {getKidMessage()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      <Card className="kids-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for objects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>
            
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full md:w-40 border-2 border-purple-200">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="webcam">Camera</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 border-2 border-purple-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_objects">Most Objects</SelectItem>
                <SelectItem value="highest_confidence">Best Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Detection Grid */}
      {filteredDetections.length === 0 ? (
        <Card className="kids-card">
          <CardContent className="p-12 text-center space-y-4">
            <BookOpen className="w-16 h-16 text-purple-300 mx-auto" />
            <h3 className="text-xl font-bold text-purple-600">
              {searchTerm || filterSource !== 'all' 
                ? "No matching discoveries found" 
                : userMode === 'kid'
                  ? "Your journal is waiting for adventures!"
                  : "No detections recorded yet"
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterSource !== 'all'
                ? "Try adjusting your search or filters"
                : userMode === 'kid'
                  ? "Go to the Explorer page and start discovering cool objects!"
                  : "Start detecting objects to build your journal"
              }
            </p>
            {(!searchTerm && filterSource === 'all') && (
              <Button 
                onClick={() => window.location.href = '/detect'}
                className="kids-button mt-4"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDetections.map((detection) => (
            <Card 
              key={detection.id} 
              className="kids-card hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setSelectedDetection(detection)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    {detection.source === 'webcam' ? (
                      <Camera className="w-4 h-4 text-purple-500" />
                    ) : (
                      <Upload className="w-4 h-4 text-purple-500" />
                    )}
                    <span>{formatDate(detection.timestamp)}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDetection(detection.id)
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Image thumbnail */}
                <div className="relative">
                  <img 
                    src={detection.image} 
                    alt="Detection" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {detection.results.length} object{detection.results.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {/* Objects found */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-700">Found:</h4>
                  <div className="flex flex-wrap gap-1">
                    {detection.results.slice(0, 3).map((result, index) => (
                      <Badge 
                        key={index}
                        className={`${getConfidenceColor(result.confidence)} text-white text-xs`}
                      >
                        {result.class_name.replace('_', ' ')}
                      </Badge>
                    ))}
                    {detection.results.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{detection.results.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* View details button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-2 border-purple-300 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDetection(detection)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detection Detail Modal */}
      {selectedDetection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>Detection Details - {formatDate(selectedDetection.timestamp)}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDetection(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Image with detection boxes */}
              <div className="relative max-w-2xl mx-auto">
                <img 
                  src={selectedDetection.image} 
                  alt="Detection" 
                  className="w-full rounded-lg"
                />
                {/* Detection boxes overlay would go here */}
              </div>
              
              {/* Detection results */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-700">
                  Objects Found ({selectedDetection.results.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDetection.results.map((result, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-700 capitalize">
                          {result.class_name.replace('_', ' ')}
                        </h4>
                        <Badge className={`${getConfidenceColor(result.confidence)} text-white`}>
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Confidence: {result.confidence >= 0.8 ? 'Very High' : 
                                   result.confidence >= 0.6 ? 'Good' : 'Moderate'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Detection Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Source:</span>
                    <span className="ml-2 font-medium capitalize">{selectedDetection.source}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mode:</span>
                    <span className="ml-2 font-medium capitalize">{selectedDetection.userMode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedDetection.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Objects:</span>
                    <span className="ml-2 font-medium">{selectedDetection.results.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default JournalPage
