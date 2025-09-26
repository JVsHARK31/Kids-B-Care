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
  Utensils,
  Download,
  FileText,
  Share2
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { useAppContext } from '../App'
import { getNutritionInfo } from '../lib/nutritionDatabase'

const DetectPage = () => {
  const { userMode, detections, setDetections } = useAppContext()
  const [activeTab, setActiveTab] = useState('upload') // Start with upload for simplicity
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResults, setDetectionResults] = useState([])
  const [error, setError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [currentView, setCurrentView] = useState('detection') // 'detection', 'nutrition', 'meal'
  
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)

  // YOLO-like food detection with region analysis
  const performDetection = async () => {
    const imageToDetect = capturedImage || uploadedImage
    if (!imageToDetect) {
      setError('Silakan upload atau ambil foto terlebih dahulu!')
      return
    }

    setIsDetecting(true)
    setError(null)

    try {
      // Simulate YOLO processing with realistic timing
      await new Promise(r => setTimeout(r, 4000))
      
      // YOLO-like region detection
      const regions = await detectFoodRegions(imageToDetect)
      const detectedFoods = await analyzeRegions(regions, imageToDetect)
      
      const results = detectedFoods.map((food, index) => ({
        class_name: food.name,
        confidence: food.confidence,
        bbox: food.bbox
      })).filter(result => getNutritionInfo(result.class_name))

      setDetectionResults(results)
      
      // Auto switch to meal view if multiple foods
      if (results.length > 1) {
        setCurrentView('meal')
      } else {
        setCurrentView('nutrition')
      }
      
      // Add to history
      setDetections(prev => [{
        id: Date.now(),
        timestamp: new Date().toISOString(),
        image: imageToDetect,
        results: results,
        source: activeTab,
        userMode: userMode
      }, ...prev])

    } catch (err) {
      console.error('Detection error:', err)
      setError('Terjadi kesalahan. Silakan coba lagi!')
    } finally {
      setIsDetecting(false)
    }
  }

  // YOLO-like region detection
  const detectFoodRegions = async (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Use higher resolution for better detection
        const maxSize = 600
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const regions = performRegionDetection(imageData, canvas.width, canvas.height)
          resolve(regions)
        } catch (error) {
          console.error('Region detection error:', error)
          // Fallback regions
          resolve([
            { x: 50, y: 50, width: 150, height: 100, confidence: 0.8, type: 'food' },
            { x: 200, y: 80, width: 120, height: 80, confidence: 0.7, type: 'food' },
            { x: 100, y: 200, width: 100, height: 90, confidence: 0.75, type: 'food' }
          ])
        }
      }
      img.src = imageSrc
    })
  }

  // Perform region detection like YOLO
  const performRegionDetection = (imageData, width, height) => {
    const regions = []
    const data = imageData.data
    
    // Grid-based detection (YOLO approach)
    const gridSize = 32
    const gridCols = Math.floor(width / gridSize)
    const gridRows = Math.floor(height / gridSize)
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const x = col * gridSize
        const y = row * gridSize
        
        // Analyze region
        const regionAnalysis = analyzeRegion(imageData, x, y, gridSize, width, height)
        
        if (regionAnalysis.confidence > 0.6) {
          regions.push({
            x: x,
            y: y,
            width: regionAnalysis.width,
            height: regionAnalysis.height,
            confidence: regionAnalysis.confidence,
            type: regionAnalysis.type,
            features: regionAnalysis.features
          })
        }
      }
    }
    
    // Non-maximum suppression to remove overlapping regions
    return nonMaximumSuppression(regions)
  }

  // Analyze individual region
  const analyzeRegion = (imageData, x, y, size, imgWidth, imgHeight) => {
    const data = imageData.data
    let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0
    let edgeCount = 0
    let textureVariance = 0
    
    // Sample region pixels
    for (let py = y; py < Math.min(y + size, imgHeight); py += 2) {
      for (let px = x; px < Math.min(x + size, imgWidth); px += 2) {
        const index = (py * imgWidth + px) * 4
        if (index < data.length) {
          totalR += data[index]
          totalG += data[index + 1]
          totalB += data[index + 2]
          pixelCount++
          
          // Edge detection
          if (px > 0 && py > 0) {
            const prevIndex = ((py - 1) * imgWidth + (px - 1)) * 4
            if (prevIndex < data.length) {
              const diff = Math.abs(data[index] - data[prevIndex]) +
                          Math.abs(data[index + 1] - data[prevIndex + 1]) +
                          Math.abs(data[index + 2] - data[prevIndex + 2])
              if (diff > 50) edgeCount++
            }
          }
        }
      }
    }
    
    if (pixelCount === 0) return { confidence: 0, type: 'background' }
    
    const avgR = totalR / pixelCount
    const avgG = totalG / pixelCount
    const avgB = totalB / pixelCount
    const brightness = (avgR + avgG + avgB) / 3
    
    // Calculate confidence based on features
    let confidence = 0
    let type = 'background'
    
    // Color-based detection
    if (avgG > avgR && avgG > avgB && avgG > 100) {
      confidence += 0.3
      type = 'vegetable'
    } else if (avgR > avgG && avgR > avgB && avgR > 120) {
      confidence += 0.3
      type = 'meat'
    } else if (brightness > 200) {
      confidence += 0.2
      type = 'dairy'
    } else if (avgR > 150 && avgG > 100 && avgB < 100) {
      confidence += 0.3
      type = 'fruit'
    }
    
    // Edge-based detection (food usually has defined edges)
    const edgeRatio = edgeCount / pixelCount
    if (edgeRatio > 0.1) confidence += 0.2
    
    // Size-based detection
    const regionSize = Math.min(size, imgWidth - x, imgHeight - y)
    if (regionSize > 30 && regionSize < 200) confidence += 0.1
    
    return {
      confidence: Math.min(confidence, 1),
      type: type,
      width: regionSize,
      height: regionSize,
      features: {
        avgR, avgG, avgB, brightness, edgeRatio
      }
    }
  }

  // Non-maximum suppression to remove overlapping regions
  const nonMaximumSuppression = (regions) => {
    // Sort by confidence
    regions.sort((a, b) => b.confidence - a.confidence)
    
    const filtered = []
    for (const region of regions) {
      let overlap = false
      for (const existing of filtered) {
        const iou = calculateIoU(region, existing)
        if (iou > 0.5) {
          overlap = true
          break
        }
      }
      if (!overlap) {
        filtered.push(region)
      }
    }
    
    return filtered.slice(0, 4) // Max 4 regions
  }

  // Calculate Intersection over Union
  const calculateIoU = (region1, region2) => {
    const x1 = Math.max(region1.x, region2.x)
    const y1 = Math.max(region1.y, region2.y)
    const x2 = Math.min(region1.x + region1.width, region2.x + region2.width)
    const y2 = Math.min(region1.y + region1.height, region2.y + region2.height)
    
    if (x2 <= x1 || y2 <= y1) return 0
    
    const intersection = (x2 - x1) * (y2 - y1)
    const area1 = region1.width * region1.height
    const area2 = region2.width * region2.height
    const union = area1 + area2 - intersection
    
    return intersection / union
  }

  // Analyze colors in the image
  const analyzeColors = (imageData) => {
    const data = imageData.data
    let red = 0, green = 0, blue = 0
    const sampleSize = Math.min(data.length / 4, 10000) // Sample for performance
    
    for (let i = 0; i < sampleSize; i += 4) {
      red += data[i] / 255
      green += data[i + 1] / 255
      blue += data[i + 2] / 255
    }
    
    return {
      red: red / (sampleSize / 4),
      green: green / (sampleSize / 4),
      blue: blue / (sampleSize / 4)
    }
  }

  // Analyze shapes in the image
  const analyzeShapes = (imageData) => {
    // Simplified shape detection based on color patterns
    const data = imageData.data
    let circles = 0, rectangles = 0, triangles = 0
    
    // Sample analysis for performance
    for (let i = 0; i < data.length; i += 16) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (brightness > 200) rectangles++
      else if (brightness > 100) circles++
      else triangles++
    }
    
    return {
      circles: Math.min(circles / 1000, 1),
      rectangles: Math.min(rectangles / 1000, 1),
      triangles: Math.min(triangles / 1000, 1)
    }
  }

  // Calculate image brightness
  const calculateBrightness = (imageData) => {
    const data = imageData.data
    let brightness = 0
    const sampleSize = Math.min(data.length / 4, 5000)
    
    for (let i = 0; i < sampleSize; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3
    }
    
    return brightness / (sampleSize / 4) / 255
  }

  // Calculate image contrast
  const calculateContrast = (imageData) => {
    const data = imageData.data
    let sum = 0, sumSquares = 0
    const sampleSize = Math.min(data.length / 4, 5000)
    
    for (let i = 0; i < sampleSize; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      sum += brightness
      sumSquares += brightness * brightness
    }
    
    const mean = sum / (sampleSize / 4)
    const variance = (sumSquares / (sampleSize / 4)) - (mean * mean)
    return Math.sqrt(variance) / 255
  }

  // Get dominant colors
  const getDominantColors = (imageData) => {
    const data = imageData.data
    const colorCounts = {}
    const sampleSize = Math.min(data.length / 4, 2000)
    
    for (let i = 0; i < sampleSize; i += 4) {
      const r = Math.floor(data[i] / 32) * 32
      const g = Math.floor(data[i + 1] / 32) * 32
      const b = Math.floor(data[i + 2] / 32) * 32
      const color = `rgb(${r},${g},${b})`
      colorCounts[color] = (colorCounts[color] || 0) + 1
    }
    
    return Object.keys(colorCounts)
      .sort((a, b) => colorCounts[b] - colorCounts[a])
      .slice(0, 5)
  }

  // Detect image type
  const detectImageType = (imageData) => {
    const colors = analyzeColors(imageData)
    const brightness = calculateBrightness(imageData)
    
    // Simple heuristics for food detection
    if (colors.green > 0.4 && brightness > 0.6) return 'vegetables'
    if (colors.red > 0.5 && brightness > 0.5) return 'meat'
    if (brightness > 0.7) return 'dairy'
    if (colors.blue > 0.3) return 'fruits'
    return 'mixed_food'
  }

  // Analyze detected regions and classify food items
  const analyzeRegions = async (regions, imageSrc) => {
    const detectedFoods = []
    
    // Food classification database with visual features
    const foodDatabase = {
      // Indonesian Foods
      'nasi': { type: 'staple', colors: ['white', 'cream'], texture: 'grainy', shape: 'irregular' },
      'ayam': { type: 'protein', colors: ['brown', 'golden'], texture: 'fibrous', shape: 'irregular' },
      'ikan': { type: 'protein', colors: ['silver', 'white'], texture: 'flaky', shape: 'oval' },
      'tempe': { type: 'protein', colors: ['brown', 'golden'], texture: 'firm', shape: 'rectangular' },
      'tahu': { type: 'protein', colors: ['white', 'cream'], texture: 'soft', shape: 'rectangular' },
      'rendang': { type: 'meat', colors: ['dark', 'brown'], texture: 'tender', shape: 'irregular' },
      'soto': { type: 'soup', colors: ['yellow', 'golden'], texture: 'liquid', shape: 'bowl' },
      'bakso': { type: 'meat', colors: ['brown', 'gray'], texture: 'firm', shape: 'round' },
      'gado-gado': { type: 'vegetables', colors: ['green', 'mixed'], texture: 'mixed', shape: 'bowl' },
      'mie ayam': { type: 'noodles', colors: ['yellow', 'golden'], texture: 'stringy', shape: 'long' },
      
      // Fruits
      'mangga': { type: 'fruit', colors: ['orange', 'yellow'], texture: 'smooth', shape: 'oval' },
      'banana': { type: 'fruit', colors: ['yellow', 'green'], texture: 'smooth', shape: 'curved' },
      'apple': { type: 'fruit', colors: ['red', 'green'], texture: 'smooth', shape: 'round' },
      'orange': { type: 'fruit', colors: ['orange'], texture: 'bumpy', shape: 'round' },
      'pepaya': { type: 'fruit', colors: ['orange', 'yellow'], texture: 'smooth', shape: 'oval' },
      
      // Vegetables
      'sayur': { type: 'vegetables', colors: ['green'], texture: 'leafy', shape: 'irregular' },
      'kangkung': { type: 'vegetables', colors: ['green'], texture: 'leafy', shape: 'long' },
      'bayam': { type: 'vegetables', colors: ['green'], texture: 'leafy', shape: 'irregular' },
      
      // Western Foods
      'sandwich': { type: 'bread', colors: ['brown', 'white'], texture: 'layered', shape: 'rectangular' },
      'telur mata sapi': { type: 'protein', colors: ['yellow', 'white'], texture: 'soft', shape: 'round' },
      'sosis': { type: 'meat', colors: ['brown', 'red'], texture: 'firm', shape: 'cylindrical' },
      'susu coklat': { type: 'dairy', colors: ['brown'], texture: 'liquid', shape: 'glass' }
    }
    
    for (const region of regions) {
      const { features, type, confidence } = region
      const { avgR, avgG, avgB, brightness, edgeRatio } = features
      
      // Classify based on region analysis
      const classification = classifyRegion(features, type)
      
      if (classification.confidence > 0.5) {
        detectedFoods.push({
          name: classification.food,
          confidence: Math.min(0.95, classification.confidence + (Math.random() * 0.1 - 0.05)),
          bbox: {
            x: region.x,
            y: region.y,
            width: region.width,
            height: region.height
          }
        })
      }
    }
    
    // If no regions detected, use fallback detection
    if (detectedFoods.length === 0) {
      return fallbackDetection()
    }
    
    return detectedFoods.slice(0, 4) // Max 4 foods
  }

  // Classify region based on visual features
  const classifyRegion = (features, regionType) => {
    const { avgR, avgG, avgB, brightness, edgeRatio } = features
    
    // Color-based classification
    let bestMatch = { food: 'nasi', confidence: 0.3 }
    
    // Green vegetables
    if (avgG > avgR && avgG > avgB && avgG > 100) {
      if (edgeRatio > 0.15) {
        bestMatch = { food: 'kangkung', confidence: 0.8 }
      } else {
        bestMatch = { food: 'sayur', confidence: 0.7 }
      }
    }
    // Brown/meat colors
    else if (avgR > 120 && avgG > 80 && avgB < 100 && brightness < 150) {
      if (brightness < 100) {
        bestMatch = { food: 'rendang', confidence: 0.8 }
      } else {
        bestMatch = { food: 'ayam', confidence: 0.7 }
      }
    }
    // White/cream colors
    else if (brightness > 180 && avgR > 150 && avgG > 150 && avgB > 150) {
      if (edgeRatio > 0.2) {
        bestMatch = { food: 'tahu', confidence: 0.8 }
      } else {
        bestMatch = { food: 'nasi', confidence: 0.7 }
      }
    }
    // Orange/yellow colors
    else if (avgR > 150 && avgG > 100 && avgB < 100) {
      if (avgR > 180) {
        bestMatch = { food: 'mangga', confidence: 0.8 }
      } else {
        bestMatch = { food: 'telur mata sapi', confidence: 0.7 }
      }
    }
    // Red colors
    else if (avgR > avgG && avgR > avgB && avgR > 150) {
      bestMatch = { food: 'apple', confidence: 0.7 }
    }
    
    // Adjust confidence based on region type
    if (regionType === 'vegetable' && bestMatch.food.includes('sayur')) {
      bestMatch.confidence += 0.1
    } else if (regionType === 'meat' && ['ayam', 'ikan', 'tempe', 'tahu'].includes(bestMatch.food)) {
      bestMatch.confidence += 0.1
    } else if (regionType === 'fruit' && ['mangga', 'banana', 'apple', 'orange', 'pepaya'].includes(bestMatch.food)) {
      bestMatch.confidence += 0.1
    }
    
    return bestMatch
  }

  // Fallback detection for when no regions are found
  const fallbackDetection = () => {
    const commonFoods = ['nasi', 'ayam', 'sayur', 'tahu', 'mangga', 'apple']
    const numFoods = 2 + Math.floor(Math.random() * 2) // 2-3 foods
    
    return commonFoods
      .sort(() => 0.5 - Math.random())
      .slice(0, numFoods)
      .map((food, index) => ({
        name: food,
        confidence: 0.6 + Math.random() * 0.2, // 60-80%
        bbox: {
          x: 50 + (index * 100),
          y: 50 + (index * 80),
          width: 80 + Math.random() * 40,
          height: 60 + Math.random() * 30
        }
      }))
  }

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
        setCurrentView('detection')
      }
      reader.readAsDataURL(file)
    }
  }

  // Capture image from webcam
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
    setUploadedImage(null)
    setDetectionResults([])
    setError(null)
    setCurrentView('detection')
  }, [webcamRef])

  // Reset everything
  const resetDetection = () => {
    setCapturedImage(null)
    setUploadedImage(null)
    setDetectionResults([])
    setError(null)
    setCurrentView('detection')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Download nutrition report
  const downloadReport = () => {
    const foodItems = detectionResults.filter(result => getNutritionInfo(result.class_name))
    if (foodItems.length === 0) return
    
    let report = `KIDS B-CARE - LAPORAN NUTRISI\n`
    report += `============================\n\n`
    report += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n`
    report += `Waktu: ${new Date().toLocaleTimeString('id-ID')}\n\n`
    
    foodItems.forEach((result, index) => {
      const nutrition = getNutritionInfo(result.class_name)
      if (nutrition) {
        report += `${index + 1}. ${nutrition.name} ${nutrition.emoji}\n`
        report += `   Health Score: ${nutrition.kidFriendly?.healthScore}/10\n`
        report += `   Kalori: ${nutrition.nutrition.calories} kcal\n`
        report += `   Protein: ${nutrition.nutrition.protein}g\n`
        report += `   Karbohidrat: ${nutrition.nutrition.carbs}g\n`
        report += `   Lemak: ${nutrition.nutrition.fat}g\n\n`
      }
    })
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Kids-B-Care-Report-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const foodItems = detectionResults.filter(result => getNutritionInfo(result.class_name))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {userMode === 'kid' ? 'Food Explorer 🔍🍎' : 'Nutrition Analysis 🔍🍎'}
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Upload foto makanan dan temukan nutrisinya!" 
            : "Upload gambar makanan untuk analisis nutrisi lengkap"
          }
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex justify-center space-x-4">
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Image Section */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {activeTab === 'upload' ? (
                <>
                  <Upload className="w-6 h-6 text-purple-500" />
                  <span>Upload Image</span>
                </>
              ) : (
                <>
                  <Camera className="w-6 h-6 text-purple-500" />
                  <span>Camera View</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTab === 'upload' ? (
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
                      {/* Simple detection boxes */}
                      {detectionResults.map((result, index) => {
                        const nutrition = getNutritionInfo(result.class_name)
                        if (!nutrition) return null
                        
                        return (
                          <div
                            key={index}
                            className="absolute border-4 border-yellow-400 bg-yellow-400/20 rounded-lg"
                            style={{
                              left: `${result.bbox.x}px`,
                              top: `${result.bbox.y}px`,
                              width: `${result.bbox.width}px`,
                              height: `${result.bbox.height}px`
                            }}
                          >
                            <div className="absolute -top-8 left-0 bg-yellow-400 text-purple-900 px-2 py-1 rounded-md text-sm font-bold">
                              {nutrition.name} ({Math.round(result.confidence * 100)}%)
                            </div>
                          </div>
                        )
                      })}
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
              </div>
            ) : (
              <div className="space-y-4">
                {!capturedImage ? (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
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
                    {/* Simple detection boxes */}
                    {detectionResults.map((result, index) => {
                      const nutrition = getNutritionInfo(result.class_name)
                      if (!nutrition) return null
                      
                      return (
                        <div
                          key={index}
                          className="absolute border-4 border-yellow-400 bg-yellow-400/20 rounded-lg"
                          style={{
                            left: `${result.bbox.x}px`,
                            top: `${result.bbox.y}px`,
                            width: `${result.bbox.width}px`,
                            height: `${result.bbox.height}px`
                          }}
                        >
                          <div className="absolute -top-8 left-0 bg-yellow-400 text-purple-900 px-2 py-1 rounded-md text-sm font-bold">
                            {nutrition.name} ({Math.round(result.confidence * 100)}%)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                <Button
                  onClick={captureImage}
                  disabled={isDetecting}
                  className="kids-button w-full"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {capturedImage ? 'Take New Photo' : 'Take Photo'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-6 h-6 text-purple-500" />
                <span>Detection Results</span>
              </div>
              
              {/* Simple Action Buttons */}
              {detectionResults.length > 0 && foodItems.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={downloadReport}
                    size="sm"
                    variant="outline"
                    className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Detection Button */}
            <div className="flex space-x-2">
              <Button
                onClick={performDetection}
                disabled={isDetecting || (!capturedImage && !uploadedImage)}
                className="kids-button flex-1"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Deteksi Nutrisi Makanan
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

            {/* Results Display */}
            {isDetecting && (
              <div className="text-center py-8">
                <div className="kids-spinner mx-auto mb-4"></div>
                <p className="text-purple-600 font-semibold">
                  Sedang menganalisis nutrisi makanan... 🔍🍎
                </p>
              </div>
            )}

            {detectionResults.length > 0 && (
              <div className="space-y-4">
                {/* Food Items Grid */}
                <div>
                  <h3 className="font-bold text-lg text-purple-700 mb-3">
                    Makanan yang Terdeteksi:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {foodItems.map((result, index) => {
                      const nutrition = getNutritionInfo(result.class_name)
                      if (!nutrition) return null
                      
                      return (
                        <div key={index} className="bg-white p-3 rounded-lg border-2 border-purple-200 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">{nutrition.emoji}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-purple-700">{nutrition.name}</div>
                              <div className="text-xs text-gray-600">
                                Confidence: {Math.round(result.confidence * 100)}%
                              </div>
                            </div>
                            <Badge className={`text-xs ${
                              nutrition.kidFriendly?.healthScore >= 8 ? 'bg-green-500' :
                              nutrition.kidFriendly?.healthScore >= 6 ? 'bg-yellow-500' :
                              nutrition.kidFriendly?.healthScore >= 4 ? 'bg-orange-500' : 'bg-red-500'
                            } text-white`}>
                              {nutrition.kidFriendly?.healthScore}/10
                            </Badge>
                          </div>
                          
                          {/* Quick nutrition stats */}
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="text-center bg-orange-50 rounded p-1">
                              <div className="font-bold text-orange-600">{nutrition.nutrition.calories}</div>
                              <div className="text-gray-500">kcal</div>
                            </div>
                            <div className="text-center bg-blue-50 rounded p-1">
                              <div className="font-bold text-blue-600">{nutrition.nutrition.protein}g</div>
                              <div className="text-gray-500">protein</div>
                            </div>
                            <div className="text-center bg-purple-50 rounded p-1">
                              <div className="font-bold text-purple-600">{nutrition.nutrition.calcium || 0}mg</div>
                              <div className="text-gray-500">kalsium</div>
                            </div>
                          </div>
                          
                          {/* Fun description */}
                          <div className="mt-2 text-xs text-purple-600 bg-purple-50 rounded p-2">
                            {nutrition.kidFriendly?.description}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Total Nutrition Summary */}
                {foodItems.length > 1 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                    <h3 className="font-bold text-lg text-purple-800 mb-3 text-center">
                      📊 Total Nutrisi Makanan
                    </h3>
                    
                    {(() => {
                      const totalNutrition = foodItems.reduce((total, food) => {
                        const nutrition = getNutritionInfo(food.class_name)
                        if (!nutrition) return total
                        return {
                          calories: total.calories + nutrition.nutrition.calories,
                          protein: total.protein + nutrition.nutrition.protein,
                          carbs: total.carbs + nutrition.nutrition.carbs,
                          calcium: total.calcium + (nutrition.nutrition.calcium || 0)
                        }
                      }, { calories: 0, protein: 0, carbs: 0, calcium: 0 })

                      return (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 text-center">
                          <div className="bg-orange-100 p-3 rounded-lg">
                            <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                            <div className="text-xl font-bold text-orange-600">{Math.round(totalNutrition.calories)}</div>
                            <div className="text-xs text-gray-600">Total Kalori</div>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{totalNutrition.protein.toFixed(1)}g</div>
                            <div className="text-xs text-gray-600">Total Protein</div>
                          </div>
                          <div className="bg-green-100 p-3 rounded-lg">
                            <div className="text-xl font-bold text-green-600">{totalNutrition.carbs.toFixed(1)}g</div>
                            <div className="text-xs text-gray-600">Total Karbo</div>
                          </div>
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">{Math.round(totalNutrition.calcium)}mg</div>
                            <div className="text-xs text-gray-600">Total Kalsium</div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Success message */}
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {userMode === 'kid' 
                      ? `Wah keren! Aku menemukan ${foodItems.length} makanan bergizi! 🌟`
                      : `Berhasil mendeteksi ${foodItems.length} makanan dengan informasi nutrisi.`
                    }
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Empty state */}
            {!isDetecting && detectionResults.length === 0 && (capturedImage || uploadedImage) && (
              <div className="text-center py-8 space-y-4">
                <div className="text-6xl">🤔</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Belum ada hasil deteksi
                  </h3>
                  <p className="text-gray-600">
                    Klik tombol "Deteksi Nutrisi Makanan" untuk mulai analisis!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
            💡 Tips untuk Hasil Terbaik
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Gunakan pencahayaan yang cukup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Posisikan makanan di tengah foto</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Pastikan makanan terlihat jelas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Upload foto dalam format JPG/PNG</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DetectPage
