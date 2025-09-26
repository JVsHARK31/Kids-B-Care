import { useState } from 'react'
import { 
  BookOpen, 
  Calendar, 
  Camera, 
  Eye,
  Download,
  Trash2,
  Stethoscope,
  Baby,
  Apple,
  Brain
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAppContext } from '../App'

const JournalPage = () => {
  const { userMode, detections, setDetections } = useAppContext()
  const [selectedDetection, setSelectedDetection] = useState(null)

  const deleteDetection = (id) => {
    setDetections(prev => prev.filter(detection => detection.id !== id))
    if (selectedDetection?.id === id) {
      setSelectedDetection(null)
    }
  }

  const downloadDetection = (detection) => {
    const report = `KIDS B-CARE - DETECTION REPORT\n` +
      `============================\n\n` +
      `Date: ${new Date(detection.timestamp).toLocaleDateString('id-ID')}\n` +
      `Time: ${new Date(detection.timestamp).toLocaleTimeString('id-ID')}\n` +
      `Source: ${detection.source}\n` +
      `Mode: ${detection.userMode}\n\n` +
      `Detected Items:\n` +
      detection.results.map((result, index) => 
        `${index + 1}. ${result.class_name} (${Math.round(result.confidence * 100)}%)`
      ).join('\n')
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Kids-B-Care-Detection-${detection.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {userMode === 'kid' ? 'My Discovery Journal 📖✨' : 'Detection History 📖✨'}
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Lihat semua hal keren yang sudah kamu temukan!" 
            : "Track all detection history and discoveries"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Detection List */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <span>All Discoveries</span>
                <Badge className="ml-auto">{detections.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {detections.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl">📚</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {userMode === 'kid' ? 'Belum ada penemuan!' : 'No detections yet'}
            </h3>
            <p className="text-gray-600">
                      {userMode === 'kid' 
                        ? 'Mulai explore untuk mengisi journal kamu!' 
                        : 'Start detecting to build your history'
              }
            </p>
                  </div>
                </div>
              ) : (
                detections.map((detection) => (
                  <div 
              key={detection.id} 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedDetection?.id === detection.id 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
              onClick={() => setSelectedDetection(detection)}
            >
                <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {new Date(detection.timestamp).toLocaleDateString('id-ID')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(detection.timestamp).toLocaleTimeString('id-ID')} • {detection.results.length} items
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-700">
                          {detection.source}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadDetection(detection)
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                  <Button
                    size="sm"
                          variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDetection(detection.id)
                    }}
                          className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Detection Details */}
        <div className="space-y-4">
          {selectedDetection ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-6 h-6 text-purple-500" />
                  <span>Detection Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Date & Time</div>
                  <div className="font-semibold">
                    {new Date(selectedDetection.timestamp).toLocaleString('id-ID')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Source</div>
                  <Badge className="bg-blue-100 text-blue-700">
                    {selectedDetection.source}
                      </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Detected Items</div>
                  <div className="space-y-2">
                  {selectedDetection.results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{result.class_name}</span>
                        <Badge className="bg-green-100 text-green-700">
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
                {selectedDetection.image && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Image</div>
                    <img 
                      src={selectedDetection.image} 
                      alt="Detection" 
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-4xl mb-4">👆</div>
                <p className="text-gray-600">
                  {userMode === 'kid' 
                    ? 'Pilih penemuan untuk melihat detail!' 
                    : 'Select a detection to view details'
                  }
                </p>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>

    {/* Pediatric Nutrition Tips */}
    <div className="max-w-6xl mx-auto">
      <div className="mt-2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="kids-card border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Stethoscope className="w-6 h-6" />
              <span>Jurnal Gizi Anak (Evidence-based)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 font-semibold text-green-800">
                <Baby className="w-4 h-4" /> Porsi & Energi Harian
              </div>
              <ul className="list-disc ml-5 mt-2 text-green-700">
                <li>Balita: 1000–1400 kcal/hari; Anak 6–12 th: 1400–2200 kcal/hari.</li>
                <li>Piring: 1/2 sayur&buah, 1/4 protein, 1/4 karbo kompleks.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 font-semibold text-blue-800">
                <Apple className="w-4 h-4" /> Makronutrien Seimbang
              </div>
              <ul className="list-disc ml-5 mt-2 text-blue-700">
                <li>Protein 1.0–1.2 g/kg/hari; serat ≥ 14 g/1000 kcal.</li>
                <li>Batasi gula tambahan & minuman manis.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 font-semibold text-yellow-800">
                <Brain className="w-4 h-4" /> Mikronutrien Kunci
              </div>
              <ul className="list-disc ml-5 mt-2 text-yellow-700">
                <li>Zat besi, kalsium, vitamin A & C dari menu beragam.</li>
                <li>Target 5 warna sayur/buah per hari.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 font-semibold text-purple-800">
                <Stethoscope className="w-4 h-4" /> Kebiasaan Makan Sehat
              </div>
              <ul className="list-disc ml-5 mt-2 text-purple-700">
                <li>Jadwal makan teratur; porsi kecil tapi sering.</li>
                <li>Libatkan anak menyiapkan makanan untuk menumbuhkan minat.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default JournalPage