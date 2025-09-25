import { useState } from 'react'
import { 
  Info, 
  X, 
  Zap, 
  Heart, 
  Shield,
  Star,
  ChevronRight 
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getNutritionInfo } from '../lib/nutritionDatabase'

const ImageOverlay = ({ detectionResults, imageSource, userMode = 'kid' }) => {
  const [selectedFood, setSelectedFood] = useState(null)
  const [hoveredFood, setHoveredFood] = useState(null)

  if (!detectionResults || detectionResults.length === 0) return null

  const handleFoodClick = (result) => {
    const nutrition = getNutritionInfo(result.class_name)
    if (nutrition) {
      setSelectedFood(result)
    }
  }

  const getHealthScoreColor = (score) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 6) return 'bg-yellow-500'
    if (score >= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <img 
        src={imageSource} 
        alt="Detected Food" 
        className="w-full h-auto rounded-lg"
      />
      
      {/* Detection Boxes dengan Info Detail */}
      {detectionResults.map((result, index) => {
        const nutrition = getNutritionInfo(result.class_name)
        if (!nutrition) return null
        
        const bbox = result.bbox || { x: 0, y: 0, width: 100, height: 100 }
        const x = bbox.x || bbox[0] || 0
        const y = bbox.y || bbox[1] || 0  
        const width = bbox.width || (bbox[2] - bbox[0]) || 100
        const height = bbox.height || (bbox[3] - bbox[1]) || 100
        
        const isHovered = hoveredFood === index
        const isSelected = selectedFood?.class_name === result.class_name
        
        return (
          <div key={index}>
            {/* Detection Box */}
            <div
              className={`absolute border-4 rounded-lg cursor-pointer transition-all duration-300 ${
                isSelected ? 'border-purple-500 bg-purple-500/30' :
                isHovered ? 'border-yellow-400 bg-yellow-400/30' :
                'border-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30'
              }`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`
              }}
              onClick={() => handleFoodClick(result)}
              onMouseEnter={() => setHoveredFood(index)}
              onMouseLeave={() => setHoveredFood(null)}
            >
              {/* Food Label dengan Nutrition Info */}
              <div className={`absolute -top-12 left-0 transition-all duration-300 ${
                isHovered || isSelected ? 'scale-110' : ''
              }`}>
                <div className="bg-white rounded-lg shadow-lg border-2 border-purple-200 p-2 min-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{nutrition.emoji}</span>
                      <span className="font-bold text-purple-700 text-sm">{nutrition.name}</span>
                    </div>
                    <Badge className={`text-xs text-white ${getHealthScoreColor(nutrition.kidFriendly?.healthScore || 5)}`}>
                      {nutrition.kidFriendly?.healthScore}/10
                    </Badge>
                  </div>
                  
                  {/* Quick Nutrition Stats */}
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center bg-orange-50 rounded p-1">
                      <Zap className="w-3 h-3 text-orange-500 mx-auto" />
                      <div className="font-bold text-orange-600">{nutrition.nutrition.calories}</div>
                      <div className="text-gray-500">kcal</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded p-1">
                      <Heart className="w-3 h-3 text-blue-500 mx-auto" />
                      <div className="font-bold text-blue-600">{nutrition.nutrition.protein}g</div>
                      <div className="text-gray-500">protein</div>
                    </div>
                    <div className="text-center bg-purple-50 rounded p-1">
                      <Shield className="w-3 h-3 text-purple-500 mx-auto" />
                      <div className="font-bold text-purple-600">{nutrition.nutrition.calcium || 0}mg</div>
                      <div className="text-gray-500">kalsium</div>
                    </div>
                  </div>
                  
                  {/* Confidence */}
                  <div className="mt-1 text-xs text-gray-600 text-center">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </div>
                  
                  {/* Click for more info */}
                  <div className="mt-1 text-xs text-purple-600 text-center font-medium flex items-center justify-center">
                    <Info className="w-3 h-3 mr-1" />
                    Click for details
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* Detailed Nutrition Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getNutritionInfo(selectedFood.class_name)?.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-purple-700">
                      {getNutritionInfo(selectedFood.class_name)?.name}
                    </h3>
                    <Badge className="text-xs">
                      {getNutritionInfo(selectedFood.class_name)?.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFood(null)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Detailed Nutrition Info */}
              {(() => {
                const nutrition = getNutritionInfo(selectedFood.class_name)
                if (!nutrition) return null
                
                return (
                  <div className="space-y-4">
                    {/* Health Score */}
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-lg">Health Score</span>
                      </div>
                      <div className={`text-3xl font-bold ${
                        nutrition.kidFriendly?.healthScore >= 8 ? 'text-green-600' :
                        nutrition.kidFriendly?.healthScore >= 6 ? 'text-yellow-600' :
                        nutrition.kidFriendly?.healthScore >= 4 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {nutrition.kidFriendly?.healthScore}/10
                      </div>
                    </div>

                    {/* Main Nutrition */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-orange-600">{nutrition.nutrition.calories}</div>
                        <div className="text-sm text-gray-600">Kalori</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <Heart className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-blue-600">{nutrition.nutrition.protein}g</div>
                        <div className="text-sm text-gray-600">Protein</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-600">{nutrition.nutrition.carbs}g</div>
                        <div className="text-sm text-gray-600">Karbohidrat</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <Shield className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-purple-600">{nutrition.nutrition.calcium || 0}mg</div>
                        <div className="text-sm text-gray-600">Kalsium</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <p className="text-purple-700 font-medium text-center">
                        {nutrition.kidFriendly?.description}
                      </p>
                    </div>

                    {/* Fun Fact */}
                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-yellow-700">Fun Fact:</span>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        {nutrition.kidFriendly?.funFact}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-bold text-green-700 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Manfaat:
                      </h4>
                      <ul className="space-y-1">
                        {nutrition.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-green-600 flex items-start">
                            <ChevronRight className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ImageOverlay
