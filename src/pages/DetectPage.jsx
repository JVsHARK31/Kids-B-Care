import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Apple,
  Utensils
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppContext } from '../App'
import NutritionCard from '../components/NutritionCard'
import { getNutritionInfo } from '../lib/nutritionDatabase'
import axios from 'axios'

const DetectPage = () => {
  const { userMode, detections, setDetections } = useAppContext()
  const [activeTab, setActiveTab] = useState('webcam') // 'webcam' or 'upload'
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResults, setDetectionResults] = useState([])
  const [error, setError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [nutritionView, setNutritionView] = useState('detection') // 'detection' or 'nutrition'
  
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)

  // Webcam configuration
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  }

  // Capture image from webcam
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
    setDetectionResults([])
    setError(null)
    setNutritionView('detection')
  }, [webcamRef])

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        setCapturedImage(null)
        setDetectionResults([])
        setError(null)
        setNutritionView('detection')
      }
      reader.readAsDataURL(file)
    }
  }

  // Perform object detection
  const performDetection = async () => {
    const imageToDetect = capturedImage || uploadedImage
    if (!imageToDetect) {
      setError('Please capture or upload an image first!')
      return
    }

    setIsDetecting(true)
    setError(null)

    try {
      // Convert base64 to blob
      const response = await fetch(imageToDetect)
      const blob = await response.blob()
      
      // Create form data
      const formData = new FormData()
      formData.append('image', blob, 'image.jpg')

      // Call the API
      const apiResponse = await axios.post('/api/infer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      })

      if (apiResponse.data.success) {
        const results = apiResponse.data.results
        setDetectionResults(results)
        
        // Add to detections history
        const newDetection = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          image: imageToDetect,
          results: results,
          source: activeTab,
          userMode: userMode
        }
        setDetections(prev => [newDetection, ...prev])

        // Log each detection to the backend
        for (const result of results) {
          try {
            await axios.post('/api/log-detection', {
              class_name: result.class_name,
              confidence: result.confidence,
              source: activeTab,
              user_mode: userMode,
              session_id: `session_${Date.now()}`,
              bbox: result.bbox
            })
          } catch (logError) {
            console.warn('Failed to log detection:', logError)
          }
        }

        // Check if we found any food items
        const foodItems = results.filter(result => getNutritionInfo(result.class_name))
        if (foodItems.length > 0) {
          setNutritionView('nutrition')
        }
      } else {
        setError('Detection failed. Please try again!')
      }
    } catch (err) {
      console.error('Detection error:', err)
      if (err.code === 'ECONNABORTED') {
        setError('Detection timed out. Please try with a smaller image!')
      } else if (err.response?.status === 413) {
        setError('Image is too large. Please try a smaller image!')
      } else {
        setError('Something went wrong. Please try again!')
      }
    } finally {
      setIsDetecting(false)
    }
  }

  // Reset everything
  const resetDetection = () => {
    setCapturedImage(null)
    setUploadedImage(null)
    setDetectionResults([])
    setError(null)
    setNutritionView('detection')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
    if (detectionResults.length === 0) return "Let's find some cool objects! 🔍"
    
    const foodItems = detectionResults.filter(result => getNutritionInfo(result.class_name))
    if (foodItems.length > 0) {
      return `Yummy! I found ${foodItems.length} food item${foodItems.length !== 1 ? 's' : ''}! Let's learn about nutrition! 🍎`
    }
    
    if (detectionResults.length === 1) return "Wow! I found 1 awesome thing! 🌟"
    return `Amazing! I found ${detectionResults.length} cool things! 🎉`
  }

  // Filter food items from detection results
  const foodItems = detectionResults.filter(result => getNutritionInfo(result.class_name))
  const nonFoodItems = detectionResults.filter(result => !getNutritionInfo(result.class_name))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {userMode === 'kid' ? 'Food & Object Explorer 🔍🍎' : 'Object Detection & Nutrition Analysis 🔍🍎'}
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Point your camera at anything and discover what it is! If it's food, I'll tell you how healthy it is!" 
            : "Use AI-powered detection to identify objects and get detailed nutrition information for food items"
          }
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setActiveTab('webcam')}
          variant={activeTab === 'webcam' ? 'default' : 'outline'}
          className={`px-6 py-3 rounded-full font-bold transition-all duration-200 ${
            activeTab === 'webcam' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
              : 'hover:bg-purple-50'
          }`}
        >
          <Camera className="w-5 h-5 mr-2" />
          Camera
        </Button>
        <Button
          onClick={() => setActiveTab('upload')}
          variant={activeTab === 'upload' ? 'default' : 'outline'}
          className={`px-6 py-3 rounded-full font-bold transition-all duration-200 ${
            activeTab === 'upload' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
              : 'hover:bg-purple-50'
          }`}
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Capture/Upload Section */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {activeTab === 'webcam' ? (
                <>
                  <Camera className="w-6 h-6 text-purple-500" />
                  <span>Camera View</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-purple-500" />
                  <span>Upload Image</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTab === 'webcam' ? (
              <div className="space-y-4">
                {!capturedImage ? (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full rounded-lg"
                    />
                    {/* Detection boxes overlay */}
                    {detectionResults.map((result, index) => (
                      <div
                        key={index}
                        className="detection-box"
                        style={{
                          left: `${result.bbox[0]}px`,
                          top: `${result.bbox[1]}px`,
                          width: `${result.bbox[2] - result.bbox[0]}px`,
                          height: `${result.bbox[3] - result.bbox[1]}px`
                        }}
                      >
                        <div className="detection-label">
                          {result.class_name} ({Math.round(result.confidence * 100)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    onClick={captureImage}
                    disabled={isDetecting}
                    className="kids-button flex-1"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {capturedImage ? 'Take New Photo' : 'Take Photo'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="border-4 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedImage ? (
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
                      {/* Detection boxes overlay */}
                      {detectionResults.map((result, index) => (
                        <div
                          key={index}
                          className="detection-box"
                          style={{
                            left: `${result.bbox[0]}px`,
                            top: `${result.bbox[1]}px`,
                            width: `${result.bbox[2] - result.bbox[0]}px`,
                            height: `${result.bbox[3] - result.bbox[1]}px`
                          }}
                        >
                          <div className="detection-label">
                            {result.class_name} ({Math.round(result.confidence * 100)}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-purple-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-purple-600">
                          Click to upload an image
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG, or GIF (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDetecting}
                  className="kids-button w-full"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {uploadedImage ? 'Choose Different Image' : 'Choose Image'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detection Results Section */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-6 h-6 text-purple-500" />
                <span>What I Found</span>
              </div>
              
              {/* View Toggle */}
              {detectionResults.length > 0 && foodItems.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant={nutritionView === 'detection' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNutritionView('detection')}
                    className="text-xs"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Objects
                  </Button>
                  <Button
                    variant={nutritionView === 'nutrition' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNutritionView('nutrition')}
                    className="text-xs"
                  >
                    <Apple className="w-4 h-4 mr-1" />
                    Nutrition
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Kid-friendly message */}
            {userMode === 'kid' && (
              <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg border-2 border-yellow-300">
                <p className="text-lg font-bold text-purple-700">
                  {getKidMessage()}
                </p>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Detection Action Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={performDetection}
                disabled={isDetecting || (!capturedImage && !uploadedImage)}
                className="kids-button flex-1"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Detect Objects
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetDetection}
                variant="outline"
                disabled={isDetecting}
                className="px-4 py-2 border-2 border-purple-300 hover:bg-purple-50"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            {/* Results Content */}
            {detectionResults.length > 0 && (
              <div className="space-y-4">
                {nutritionView === 'nutrition' && foodItems.length > 0 ? (
                  /* Nutrition View */
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-purple-700 flex items-center space-x-2">
                      <Utensils className="w-5 h-5" />
                      <span>Nutrition Information</span>
                    </h3>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {foodItems.map((result, index) => (
                        <NutritionCard 
                          key={index}
                          detectedObject={result}
                          className="border border-purple-200"
                        />
                      ))}
                    </div>

                    {nonFoodItems.length > 0 && (
                      <div className="pt-4 border-t border-purple-200">
                        <h4 className="font-semibold text-purple-600 mb-2">
                          Other Objects Found:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {nonFoodItems.map((result, index) => (
                            <Badge key={index} variant="outline" className="capitalize">
                              {result.class_name.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Detection View */
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-purple-700">
                      Found {detectionResults.length} object{detectionResults.length !== 1 ? 's' : ''}:
                    </h3>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {detectionResults.map((result, index) => {
                        const nutritionInfo = getNutritionInfo(result.class_name)
                        
                        return (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-purple-700 capitalize">
                                  {result.class_name.replace('_', ' ')}
                                </p>
                                {nutritionInfo && (
                                  <Badge className="bg-green-100 text-green-700 border-green-300">
                                    <Apple className="w-3 h-3 mr-1" />
                                    Food
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                Confidence: {Math.round(result.confidence * 100)}%
                              </p>
                            </div>
                            
                            <Badge 
                              className={`${getConfidenceColor(result.confidence)} text-white font-bold`}
                            >
                              {result.confidence >= 0.8 ? 'Great!' : 
                               result.confidence >= 0.6 ? 'Good' : 'Maybe?'}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>

                    {foodItems.length > 0 && (
                      <Alert className="border-green-200 bg-green-50">
                        <Apple className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-700">
                          {userMode === 'kid' 
                            ? `I found ${foodItems.length} yummy food item${foodItems.length !== 1 ? 's' : ''}! Click the "Nutrition" tab to learn about how healthy ${foodItems.length === 1 ? 'it is' : 'they are'}! 🍎`
                            : `Found ${foodItems.length} food item${foodItems.length !== 1 ? 's' : ''} with nutrition information available. Switch to Nutrition view for details.`
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Success message */}
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {userMode === 'kid' 
                      ? "Great job exploring! Keep discovering new things! 🌟"
                      : `Successfully detected ${detectionResults.length} object${detectionResults.length !== 1 ? 's' : ''}.`
                    }
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Loading state */}
            {isDetecting && (
              <div className="text-center py-8">
                <div className="kids-spinner mx-auto mb-4"></div>
                <p className="text-purple-600 font-semibold">
                  {userMode === 'kid' 
                    ? "Looking for cool objects and yummy food... 🔍✨🍎"
                    : "Processing image with AI and analyzing nutrition..."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tips Section */}
      {userMode === 'kid' && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
              🌟 Explorer & Nutrition Tips 🌟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl">📸</div>
                <p className="text-blue-600 font-medium">
                  Make sure objects are clearly visible
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🍎</div>
                <p className="text-blue-600 font-medium">
                  Point at food to learn about nutrition
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">💡</div>
                <p className="text-blue-600 font-medium">
                  Good lighting helps me see better
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🥗</div>
                <p className="text-blue-600 font-medium">
                  Learn what makes food healthy or unhealthy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DetectPage
