import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAppContext } from '../App'

const AnalyticsPage = () => {
  const { userMode, detections } = useAppContext()

  // Calculate analytics
  const totalDetections = detections.length
  const totalItems = detections.reduce((sum, detection) => sum + detection.results.length, 0)
  const uniqueItems = new Set(detections.flatMap(detection => detection.results.map(r => r.class_name))).size
  
  // Get most detected items
  const itemCounts = {}
  detections.forEach(detection => {
    detection.results.forEach(result => {
      itemCounts[result.class_name] = (itemCounts[result.class_name] || 0) + 1
    })
  })
  const topItems = Object.entries(itemCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // Get detection frequency by day
  const dailyCounts = {}
  detections.forEach(detection => {
    const date = new Date(detection.timestamp).toDateString()
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  })

  const getAchievementLevel = () => {
    if (totalDetections >= 50) return { level: 'Expert Explorer', color: 'bg-purple-500', icon: '🏆' }
    if (totalDetections >= 25) return { level: 'Advanced Explorer', color: 'bg-blue-500', icon: '🥇' }
    if (totalDetections >= 10) return { level: 'Skilled Explorer', color: 'bg-green-500', icon: '🥈' }
    if (totalDetections >= 5) return { level: 'Learning Explorer', color: 'bg-yellow-500', icon: '🥉' }
    return { level: 'New Explorer', color: 'bg-gray-500', icon: '🌟' }
  }

  const achievement = getAchievementLevel()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {userMode === 'kid' ? 'My Explorer Stats 📊🌟' : 'Analytics Dashboard 📊🌟'}
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Lihat pencapaian dan statistik eksplorasi kamu!" 
            : "Track progress and exploration statistics"
          }
        </p>
      </div>

      {/* Achievement Badge */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">{achievement.icon}</div>
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            {achievement.level}
          </h2>
          <p className="text-purple-600">
            {userMode === 'kid' 
              ? `Kamu sudah melakukan ${totalDetections} eksplorasi!` 
              : `You've completed ${totalDetections} detections!`
            }
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="text-center p-6">
            <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600">{totalDetections}</div>
            <div className="text-sm text-blue-700">Total Explorations</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="text-center p-6">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">{totalItems}</div>
            <div className="text-sm text-green-700">Items Discovered</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="text-center p-6">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600">{uniqueItems}</div>
            <div className="text-sm text-purple-700">Unique Items</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="text-center p-6">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-orange-600">
              {totalDetections > 0 ? Math.round(totalItems / totalDetections * 10) / 10 : 0}
            </div>
            <div className="text-sm text-orange-700">Avg Items/Detection</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Discovered Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-yellow-500" />
              <span>Top Discovered Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {userMode === 'kid' ? 'Belum ada data!' : 'No data yet!'}
              </div>
            ) : (
              topItems.map(([item, count], index) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {count} times
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {detections.slice(0, 5).map((detection, index) => (
              <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {new Date(detection.timestamp).toLocaleDateString('id-ID')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {detection.results.length} items detected
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {detection.source}
                </Badge>
              </div>
            ))}
            {detections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {userMode === 'kid' ? 'Belum ada aktivitas!' : 'No activity yet!'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-orange-700 mb-4 text-center">
            🎉 Explorer Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl">🔍</div>
              <div className="font-semibold text-orange-600">Curious Mind</div>
              <div className="text-sm text-gray-600">Always exploring new things</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">📚</div>
              <div className="font-semibold text-orange-600">Knowledge Seeker</div>
              <div className="text-sm text-gray-600">Learning through discovery</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🌟</div>
              <div className="font-semibold text-orange-600">Future Scientist</div>
              <div className="text-sm text-gray-600">Building observation skills</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPage