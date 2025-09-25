from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Kids B-Care Stats API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    """Get database connection."""
    if not DATABASE_URL:
        return None
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return None

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Kids B-Care Stats API", "status": "healthy"}

@app.get("/api/stats")
async def get_stats(period: str = "week"):
    """
    Get comprehensive statistics about object detections.
    
    Args:
        period: Time period - 'day', 'week', 'month', 'all' (default: 'week')
    
    Returns:
        JSON response with statistics data
    """
    try:
        conn = get_db_connection()
        
        if not conn:
            # Return mock data if no database
            mock_stats = {
                "total_detections": 1247,
                "unique_objects": 45,
                "avg_confidence": 0.78,
                "most_detected": "teddy bear",
                "detection_trend": [
                    {"date": "2024-09-19", "count": 45},
                    {"date": "2024-09-20", "count": 52},
                    {"date": "2024-09-21", "count": 38},
                    {"date": "2024-09-22", "count": 61},
                    {"date": "2024-09-23", "count": 47},
                    {"date": "2024-09-24", "count": 55},
                    {"date": "2024-09-25", "count": 49}
                ],
                "category_distribution": [
                    {"category": "Toys", "count": 234, "percentage": 18.8},
                    {"category": "Animals", "count": 189, "percentage": 15.2},
                    {"category": "Food", "count": 156, "percentage": 12.5},
                    {"category": "Vehicles", "count": 134, "percentage": 10.7},
                    {"category": "Household", "count": 112, "percentage": 9.0},
                    {"category": "Books", "count": 98, "percentage": 7.9},
                    {"category": "Electronics", "count": 87, "percentage": 7.0},
                    {"category": "Clothing", "count": 76, "percentage": 6.1},
                    {"category": "Sports", "count": 65, "percentage": 5.2},
                    {"category": "Others", "count": 96, "percentage": 7.7}
                ],
                "user_mode_stats": [
                    {"mode": "kid", "count": 892, "percentage": 71.5},
                    {"mode": "parent", "count": 267, "percentage": 21.4},
                    {"mode": "admin", "count": 88, "percentage": 7.1}
                ],
                "source_stats": [
                    {"source": "upload", "count": 743, "percentage": 59.6},
                    {"source": "webcam", "count": 504, "percentage": 40.4}
                ]
            }
            
            return JSONResponse({
                "success": True,
                "stats": mock_stats,
                "period": period,
                "generated_at": datetime.now().isoformat()
            })
        
        # Calculate time filter
        time_filter = ""
        if period == "day":
            time_filter = "AND timestamp >= NOW() - INTERVAL '1 day'"
        elif period == "week":
            time_filter = "AND timestamp >= NOW() - INTERVAL '1 week'"
        elif period == "month":
            time_filter = "AND timestamp >= NOW() - INTERVAL '1 month'"
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Get basic stats
            cur.execute(f"""
                SELECT 
                    COUNT(*) as total_detections,
                    COUNT(DISTINCT class_name) as unique_objects,
                    AVG(confidence) as avg_confidence
                FROM detections 
                WHERE 1=1 {time_filter}
            """)
            basic_stats = cur.fetchone()
            
            # Get most detected object
            cur.execute(f"""
                SELECT class_name, COUNT(*) as count
                FROM detections 
                WHERE 1=1 {time_filter}
                GROUP BY class_name 
                ORDER BY count DESC 
                LIMIT 1
            """)
            most_detected = cur.fetchone()
            
            # Get detection trend (last 7 days)
            cur.execute(f"""
                SELECT 
                    DATE(timestamp) as date,
                    COUNT(*) as count
                FROM detections 
                WHERE timestamp >= NOW() - INTERVAL '7 days'
                GROUP BY DATE(timestamp)
                ORDER BY date
            """)
            trend_data = cur.fetchall()
            
            # Get user mode distribution
            cur.execute(f"""
                SELECT 
                    user_mode as mode,
                    COUNT(*) as count,
                    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
                FROM detections 
                WHERE 1=1 {time_filter}
                GROUP BY user_mode
                ORDER BY count DESC
            """)
            user_mode_stats = cur.fetchall()
            
            # Get source distribution
            cur.execute(f"""
                SELECT 
                    source,
                    COUNT(*) as count,
                    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
                FROM detections 
                WHERE 1=1 {time_filter}
                GROUP BY source
                ORDER BY count DESC
            """)
            source_stats = cur.fetchall()
            
            # Create category distribution (simplified mapping)
            category_mapping = {
                'teddy bear': 'Toys',
                'sports ball': 'Toys',
                'kite': 'Toys',
                'frisbee': 'Toys',
                'cat': 'Animals',
                'dog': 'Animals',
                'bird': 'Animals',
                'horse': 'Animals',
                'sheep': 'Animals',
                'cow': 'Animals',
                'elephant': 'Animals',
                'bear': 'Animals',
                'zebra': 'Animals',
                'giraffe': 'Animals',
                'apple': 'Food',
                'banana': 'Food',
                'orange': 'Food',
                'broccoli': 'Food',
                'carrot': 'Food',
                'pizza': 'Food',
                'donut': 'Food',
                'cake': 'Food',
                'sandwich': 'Food',
                'hot dog': 'Food',
                'car': 'Vehicles',
                'truck': 'Vehicles',
                'bus': 'Vehicles',
                'motorcycle': 'Vehicles',
                'bicycle': 'Vehicles',
                'airplane': 'Vehicles',
                'boat': 'Vehicles',
                'train': 'Vehicles',
                'chair': 'Household',
                'couch': 'Household',
                'bed': 'Household',
                'dining table': 'Household',
                'toilet': 'Household',
                'sink': 'Household',
                'refrigerator': 'Household',
                'microwave': 'Household',
                'oven': 'Household',
                'toaster': 'Household',
                'book': 'Books',
                'tv': 'Electronics',
                'laptop': 'Electronics',
                'mouse': 'Electronics',
                'remote': 'Electronics',
                'keyboard': 'Electronics',
                'cell phone': 'Electronics',
                'clock': 'Electronics'
            }
            
            cur.execute(f"""
                SELECT class_name, COUNT(*) as count
                FROM detections 
                WHERE 1=1 {time_filter}
                GROUP BY class_name
            """)
            class_counts = cur.fetchall()
            
            # Aggregate by category
            category_counts = {}
            total_count = sum(row['count'] for row in class_counts)
            
            for row in class_counts:
                category = category_mapping.get(row['class_name'], 'Others')
                category_counts[category] = category_counts.get(category, 0) + row['count']
            
            category_distribution = [
                {
                    "category": category,
                    "count": count,
                    "percentage": round(count * 100.0 / total_count, 1) if total_count > 0 else 0
                }
                for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
            ]
            
            # Compile final stats
            stats = {
                "total_detections": basic_stats['total_detections'],
                "unique_objects": basic_stats['unique_objects'],
                "avg_confidence": round(float(basic_stats['avg_confidence']), 3) if basic_stats['avg_confidence'] else 0,
                "most_detected": most_detected['class_name'] if most_detected else "N/A",
                "detection_trend": [
                    {"date": row['date'].strftime('%Y-%m-%d'), "count": row['count']}
                    for row in trend_data
                ],
                "category_distribution": category_distribution,
                "user_mode_stats": [dict(row) for row in user_mode_stats],
                "source_stats": [dict(row) for row in source_stats]
            }
            
            logger.info(f"Stats query completed for period: {period}")
            
            return JSONResponse({
                "success": True,
                "stats": stats,
                "period": period,
                "generated_at": datetime.now().isoformat()
            })
            
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")
    
    finally:
        if conn:
            conn.close()

@app.get("/api/recent-detections")
async def get_recent_detections(limit: int = 20):
    """
    Get recent detection events.
    
    Args:
        limit: Number of recent detections to return (default: 20)
    
    Returns:
        JSON response with recent detections
    """
    try:
        conn = get_db_connection()
        
        if not conn:
            # Return mock data if no database
            mock_detections = [
                {
                    "id": i,
                    "class_name": ["teddy bear", "book", "apple", "car", "cat"][i % 5],
                    "confidence": round(0.6 + (i % 4) * 0.1, 2),
                    "source": "upload" if i % 2 == 0 else "webcam",
                    "user_mode": "kid",
                    "timestamp": (datetime.now() - timedelta(minutes=i*5)).isoformat()
                }
                for i in range(limit)
            ]
            
            return JSONResponse({
                "success": True,
                "recent_detections": mock_detections,
                "count": len(mock_detections)
            })
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    id, class_name, confidence, source, user_mode, timestamp
                FROM detections 
                ORDER BY timestamp DESC 
                LIMIT %s
            """, (limit,))
            
            results = cur.fetchall()
            
            # Convert to list of dicts with ISO timestamp
            recent_detections = [
                {
                    **dict(row),
                    "timestamp": row['timestamp'].isoformat()
                }
                for row in results
            ]
            
            logger.info(f"Recent detections query completed: {len(recent_detections)} entries")
            
            return JSONResponse({
                "success": True,
                "recent_detections": recent_detections,
                "count": len(recent_detections)
            })
            
    except Exception as e:
        logger.error(f"Recent detections error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get recent detections: {str(e)}")
    
    finally:
        if conn:
            conn.close()

# For Vercel deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
