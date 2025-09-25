// YOLO class names (COCO dataset)
export const YOLO_CLASSES = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
  "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
  "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
  "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
  "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
  "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
  "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake",
  "chair", "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop",
  "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
  "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
]

// Category mapping for objects
export const OBJECT_CATEGORIES = {
  'Toys': ['teddy bear', 'sports ball', 'kite', 'frisbee', 'skateboard', 'surfboard'],
  'Animals': ['cat', 'dog', 'bird', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'],
  'Food': ['apple', 'banana', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'sandwich'],
  'Vehicles': ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'airplane', 'boat', 'train'],
  'Household': ['chair', 'couch', 'bed', 'dining table', 'toilet', 'sink', 'refrigerator', 'microwave', 'oven', 'toaster'],
  'Books': ['book'],
  'Electronics': ['tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'clock'],
  'Clothing': ['tie', 'backpack', 'handbag', 'suitcase', 'umbrella'],
  'Sports': ['tennis racket', 'baseball bat', 'baseball glove', 'skis', 'snowboard'],
  'Kitchen': ['bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'vase'],
  'Personal Care': ['scissors', 'hair drier', 'toothbrush'],
  'Others': ['person', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'potted plant']
}

// Kid-friendly object names
export const KID_FRIENDLY_NAMES = {
  'cell phone': 'phone',
  'dining table': 'table',
  'potted plant': 'plant',
  'wine glass': 'glass',
  'hot dog': 'hotdog',
  'teddy bear': 'teddy',
  'sports ball': 'ball',
  'hair drier': 'hair dryer',
  'fire hydrant': 'fire plug',
  'stop sign': 'stop sign',
  'traffic light': 'traffic light',
  'parking meter': 'parking meter'
}

// Confidence level descriptions
export const CONFIDENCE_LEVELS = {
  HIGH: { min: 0.8, label: 'Great!', color: 'green', description: 'Very confident' },
  MEDIUM: { min: 0.6, label: 'Good', color: 'yellow', description: 'Pretty sure' },
  LOW: { min: 0.4, label: 'Maybe?', color: 'orange', description: 'Not very sure' },
  VERY_LOW: { min: 0.0, label: 'Hmm...', color: 'red', description: 'Very uncertain' }
}

// User modes
export const USER_MODES = {
  KID: 'kid',
  PARENT: 'parent',
  ADMIN: 'admin'
}

// Theme colors
export const THEME_COLORS = {
  primary: '#8b5cf6', // purple-500
  secondary: '#f87171', // red-400
  accent: '#34d399', // emerald-400
  background: '#fef7ff', // purple-50
  surface: '#ffffff',
  text: '#2d1b69'
}

// Chart colors for analytics
export const CHART_COLORS = [
  '#8b5cf6', // purple-500
  '#f87171', // red-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#fb7185'  // rose-400
]

// Achievement levels
export const ACHIEVEMENT_LEVELS = [
  { min: 0, max: 4, name: 'New Explorer', icon: '👶', color: 'pink' },
  { min: 5, max: 9, name: 'Beginner Explorer', icon: '🌱', color: 'orange' },
  { min: 10, max: 19, name: 'Explorer', icon: '🔍', color: 'green' },
  { min: 20, max: 49, name: 'Advanced Explorer', icon: '⭐', color: 'blue' },
  { min: 50, max: 99, name: 'Expert Explorer', icon: '🌟', color: 'purple' },
  { min: 100, max: Infinity, name: 'Master Explorer', icon: '🏆', color: 'yellow' }
]

// Default settings
export const DEFAULT_SETTINGS = {
  language: 'en',
  theme: 'light',
  voiceFeedback: false,
  soundEffects: true,
  highContrast: false,
  largeText: false,
  faceBlur: true,
  dataCollection: false,
  parentalPin: false,
  confidenceThreshold: '0.5',
  maxDetections: '10',
  autoSave: true
}

// API configuration
export const API_CONFIG = {
  timeout: 30000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxImageDimensions: { width: 1920, height: 1080 }
}

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'Image file is too large. Please choose a smaller image (max 10MB).',
  UNSUPPORTED_FORMAT: 'Unsupported image format. Please use JPG, PNG, GIF, or WebP.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try with a smaller image.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  NO_IMAGE: 'Please select or capture an image first.',
  DETECTION_FAILED: 'Object detection failed. Please try again with a different image.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  DETECTION_SUCCESS: 'Objects detected successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  DATA_IMPORTED: 'Data imported successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  DATA_CLEARED: 'All data cleared successfully!'
}

// Kid-friendly messages
export const KID_MESSAGES = {
  WELCOME: "Hello, Little Explorer! 🌟",
  DETECTION_START: "Looking for cool objects... 🔍✨",
  DETECTION_SUCCESS: "Wow! I found some amazing things! 🎉",
  NO_OBJECTS: "Hmm, I couldn't find any objects. Try a different picture! 🤔",
  KEEP_EXPLORING: "Keep exploring and discovering new things! 🚀",
  GREAT_JOB: "Great job exploring! You're amazing! ⭐",
  SAFETY_REMINDER: "Remember to ask a grown-up before taking pictures! 👨‍👩‍👧‍👦"
}

// Navigation items
export const NAV_ITEMS = [
  { path: '/', icon: 'Home', label: 'Home', color: 'text-purple-500' },
  { path: '/detect', icon: 'Camera', label: 'Explore', color: 'text-pink-500' },
  { path: '/journal', icon: 'BookOpen', label: 'Journal', color: 'text-blue-500' },
  { path: '/analytics', icon: 'BarChart3', label: 'Stats', color: 'text-green-500' },
  { path: '/settings', icon: 'Settings', label: 'Settings', color: 'text-orange-500' }
]

// Export all constants
export default {
  YOLO_CLASSES,
  OBJECT_CATEGORIES,
  KID_FRIENDLY_NAMES,
  CONFIDENCE_LEVELS,
  USER_MODES,
  THEME_COLORS,
  CHART_COLORS,
  ACHIEVEMENT_LEVELS,
  DEFAULT_SETTINGS,
  API_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  KID_MESSAGES,
  NAV_ITEMS
}
