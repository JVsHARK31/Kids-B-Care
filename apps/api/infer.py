from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import onnxruntime as ort
import cv2
import os
import urllib.request
import io
from PIL import Image
import tempfile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Kids B-Care Object Detection API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model caching
SESSION = None
MODEL_INPUT = (640, 640)
CLASS_NAMES = [
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

# Environment variables
MODEL_URL = os.getenv("MODEL_ONNX_URL", "https://huggingface.co/SpotLab/YOLOv8Detection/resolve/main/yolov8n.onnx")

def _load_session():
    """Load ONNX model session with caching."""
    global SESSION
    if SESSION is None:
        try:
            # Create temporary file for model
            model_path = "/tmp/yolov8n.onnx"
            
            # Download model if not exists
            if not os.path.exists(model_path):
                logger.info(f"Downloading model from {MODEL_URL}")
                urllib.request.urlretrieve(MODEL_URL, model_path)
                logger.info("Model downloaded successfully")
            
            # Create ONNX session
            providers = ["CPUExecutionProvider"]
            SESSION = ort.InferenceSession(model_path, providers=providers)
            logger.info("ONNX session created successfully")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")
    
    return SESSION

def _letterbox(im, new_shape=(640, 640), color=(114, 114, 114)):
    """Resize and pad image to new_shape with minimal ratio change."""
    shape = im.shape[:2]  # current shape [height, width]
    if isinstance(new_shape, int):
        new_shape = (new_shape, new_shape)

    # Scale ratio (new / old)
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])

    # Compute padding
    ratio = r, r  # width, height ratios
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding
    
    dw /= 2  # divide padding into 2 sides
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    
    return im, ratio, (dw, dh)

def _non_max_suppression(prediction, conf_thres=0.25, iou_thres=0.45, max_det=300):
    """Non-Maximum Suppression (NMS) on inference results."""
    
    # Transpose and squeeze
    prediction = prediction[0]  # Remove batch dimension
    prediction = prediction.T   # Transpose to (num_boxes, 85)
    
    # Filter by confidence
    conf_mask = prediction[:, 4] > conf_thres
    prediction = prediction[conf_mask]
    
    if not len(prediction):
        return []
    
    # Compute class confidence
    class_conf = prediction[:, 5:] * prediction[:, 4:5]
    class_pred = np.argmax(class_conf, axis=1)
    conf = np.max(class_conf, axis=1)
    
    # Filter by confidence again
    conf_mask = conf > conf_thres
    prediction = prediction[conf_mask]
    class_pred = class_pred[conf_mask]
    conf = conf[conf_mask]
    
    if not len(prediction):
        return []
    
    # Convert xywh to xyxy
    box = prediction[:, :4].copy()
    box[:, 0] = prediction[:, 0] - prediction[:, 2] / 2  # x1
    box[:, 1] = prediction[:, 1] - prediction[:, 3] / 2  # y1
    box[:, 2] = prediction[:, 0] + prediction[:, 2] / 2  # x2
    box[:, 3] = prediction[:, 1] + prediction[:, 3] / 2  # y2
    
    # Apply NMS
    indices = cv2.dnn.NMSBoxes(
        box.tolist(),
        conf.tolist(),
        conf_thres,
        iou_thres
    )
    
    if len(indices) == 0:
        return []
    
    # Format results
    results = []
    for i in indices.flatten():
        results.append({
            "bbox": box[i].tolist(),
            "confidence": float(conf[i]),
            "class_id": int(class_pred[i]),
            "class_name": CLASS_NAMES[class_pred[i]] if class_pred[i] < len(CLASS_NAMES) else "unknown"
        })
    
    return results

def _preprocess_image(image: Image.Image):
    """Preprocess image for YOLO inference."""
    # Convert to RGB and then to BGR for OpenCV
    img_rgb = np.array(image.convert("RGB"))
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    
    # Apply letterbox
    img_resized, ratio, (dw, dh) = _letterbox(img_bgr, MODEL_INPUT)
    
    # Normalize and transpose
    img_input = img_resized.astype(np.float32) / 255.0
    img_input = np.transpose(img_input, (2, 0, 1))  # HWC to CHW
    img_input = np.expand_dims(img_input, axis=0)   # Add batch dimension
    
    return img_input, ratio, (dw, dh), img_bgr.shape[:2]

def _postprocess_results(results, ratio, pad, original_shape):
    """Post-process detection results to original image coordinates."""
    if not results:
        return results
    
    dw, dh = pad
    r = ratio[0]
    
    processed_results = []
    for result in results:
        bbox = result["bbox"]
        
        # Undo letterbox padding
        bbox[0] = (bbox[0] - dw) / r  # x1
        bbox[1] = (bbox[1] - dh) / r  # y1
        bbox[2] = (bbox[2] - dw) / r  # x2
        bbox[3] = (bbox[3] - dh) / r  # y2
        
        # Clip to original image bounds
        bbox[0] = max(0, min(bbox[0], original_shape[1]))
        bbox[1] = max(0, min(bbox[1], original_shape[0]))
        bbox[2] = max(0, min(bbox[2], original_shape[1]))
        bbox[3] = max(0, min(bbox[3], original_shape[0]))
        
        processed_results.append({
            **result,
            "bbox": bbox
        })
    
    return processed_results

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Kids B-Care Object Detection API", "status": "healthy"}

@app.post("/api/infer")
async def infer(image: UploadFile = File(None), image_url: str = Form(None)):
    """
    Perform object detection on uploaded image or image URL.
    
    Args:
        image: Uploaded image file (multipart/form-data)
        image_url: URL to image (alternative to file upload)
    
    Returns:
        JSON response with detection results
    """
    try:
        # Validate input
        if image is None and not image_url:
            raise HTTPException(
                status_code=400, 
                detail="Please provide either an image file or image_url"
            )
        
        # Load image data
        if image is not None:
            # Read uploaded file
            image_data = await image.read()
            logger.info(f"Processing uploaded image: {image.filename}")
        else:
            # Download from URL
            try:
                with urllib.request.urlopen(image_url) as response:
                    image_data = response.read()
                logger.info(f"Processing image from URL: {image_url}")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to download image: {str(e)}")
        
        # Open image with PIL
        try:
            pil_image = Image.open(io.BytesIO(image_data))
            original_size = pil_image.size  # (width, height)
            logger.info(f"Image loaded successfully: {original_size}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")
        
        # Load ONNX session
        session = _load_session()
        
        # Preprocess image
        img_input, ratio, pad, original_shape = _preprocess_image(pil_image)
        
        # Run inference
        input_name = session.get_inputs()[0].name
        outputs = session.run(None, {input_name: img_input})
        
        # Post-process results
        raw_results = _non_max_suppression(outputs[0])
        final_results = _postprocess_results(raw_results, ratio, pad, original_shape)
        
        logger.info(f"Detection completed: {len(final_results)} objects found")
        
        return JSONResponse({
            "success": True,
            "results": final_results,
            "image_size": original_size,
            "detections_count": len(final_results)
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# For Vercel deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
