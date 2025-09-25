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

app = FastAPI(title="Kids B-Care Leaderboard API", version="1.0.0")

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
        # Return mock data if no database configured
        return None
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return None

def init_database():
    """Initialize database tables if they don't exist."""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        with conn.cursor() as cur:
            # Create detections table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS detections (
                    id SERIAL PRIMARY KEY,
                    class_name VARCHAR(100) NOT NULL,
                    confidence FLOAT NOT NULL,
                    source VARCHAR(20) DEFAULT 'upload',
                    user_mode VARCHAR(20) DEFAULT 'kid',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    session_id VARCHAR(100),
                    bbox_x1 FLOAT,
                    bbox_y1 FLOAT,
                    bbox_x2 FLOAT,
                    bbox_y2 FLOAT
                );
            """)
            
            # Create index for faster queries
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_detections_timestamp 
                ON detections(timestamp);
            """)
            
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_detections_class_name 
                ON detections(class_name);
            """)
            
            conn.commit()
            logger.info("Database tables initialized successfully")
            return True
            
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        conn.rollback()
        return False
    finally:
        conn.close()

# Initialize database on startup
init_database()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Kids B-Care Leaderboard API", "status": "healthy"}

@app.get("/api/leaderboard")
async def get_leaderboard(limit: int = 10, period: str = "week"):
    """
    Get leaderboard data showing most detected objects.
    
    Args:
        limit: Number of top results to return (default: 10)
        period: Time period - 'day', 'week', 'month', 'all' (default: 'week')
    
    Returns:
        JSON response with leaderboard data
    """
    try:
        conn = get_db_connection()
        
        if not conn:
            # Return mock data if no database
            mock_data = [
                {"class_name": "teddy bear", "count": 45, "rank": 1},
                {"class_name": "book", "count": 38, "rank": 2},
                {"class_name": "cup", "count": 32, "rank": 3},
                {"class_name": "apple", "count": 28, "rank": 4},
                {"class_name": "car", "count": 25, "rank": 5},
                {"class_name": "cat", "count": 22, "rank": 6},
                {"class_name": "dog", "count": 20, "rank": 7},
                {"class_name": "ball", "count": 18, "rank": 8},
                {"class_name": "bottle", "count": 15, "rank": 9},
                {"class_name": "chair", "count": 12, "rank": 10}
            ]
            return JSONResponse({
                "success": True,
                "leaderboard": mock_data[:limit],
                "period": period,
                "total_entries": len(mock_data)
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
            query = f"""
                SELECT 
                    class_name,
                    COUNT(*) as count,
                    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
                FROM detections 
                WHERE 1=1 {time_filter}
                GROUP BY class_name 
                ORDER BY count DESC 
                LIMIT %s
            """
            
            cur.execute(query, (limit,))
            results = cur.fetchall()
            
            # Convert to list of dicts
            leaderboard = [dict(row) for row in results]
            
            logger.info(f"Leaderboard query completed: {len(leaderboard)} entries")
            
            return JSONResponse({
                "success": True,
                "leaderboard": leaderboard,
                "period": period,
                "total_entries": len(leaderboard)
            })
            
    except Exception as e:
        logger.error(f"Leaderboard error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get leaderboard: {str(e)}")
    
    finally:
        if conn:
            conn.close()

@app.post("/api/log-detection")
async def log_detection(
    class_name: str,
    confidence: float,
    source: str = "upload",
    user_mode: str = "kid",
    session_id: str = None,
    bbox: list = None
):
    """
    Log a detection event to the database.
    
    Args:
        class_name: Name of detected class
        confidence: Detection confidence score
        source: Source of detection ('upload', 'webcam')
        user_mode: User mode ('kid', 'parent', 'admin')
        session_id: Optional session identifier
        bbox: Bounding box coordinates [x1, y1, x2, y2]
    
    Returns:
        JSON response confirming log entry
    """
    try:
        conn = get_db_connection()
        
        if not conn:
            # Mock response if no database
            return JSONResponse({
                "success": True,
                "message": "Detection logged (mock)",
                "data": {
                    "class_name": class_name,
                    "confidence": confidence,
                    "source": source,
                    "user_mode": user_mode
                }
            })
        
        with conn.cursor() as cur:
            if bbox and len(bbox) == 4:
                cur.execute("""
                    INSERT INTO detections 
                    (class_name, confidence, source, user_mode, session_id, bbox_x1, bbox_y1, bbox_x2, bbox_y2)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, timestamp
                """, (class_name, confidence, source, user_mode, session_id, 
                      bbox[0], bbox[1], bbox[2], bbox[3]))
            else:
                cur.execute("""
                    INSERT INTO detections 
                    (class_name, confidence, source, user_mode, session_id)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, timestamp
                """, (class_name, confidence, source, user_mode, session_id))
            
            result = cur.fetchone()
            conn.commit()
            
            logger.info(f"Detection logged: {class_name} (confidence: {confidence})")
            
            return JSONResponse({
                "success": True,
                "message": "Detection logged successfully",
                "data": {
                    "id": result[0],
                    "timestamp": result[1].isoformat(),
                    "class_name": class_name,
                    "confidence": confidence
                }
            })
            
    except Exception as e:
        logger.error(f"Log detection error: {str(e)}")
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to log detection: {str(e)}")
    
    finally:
        if conn:
            conn.close()

# For Vercel deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
