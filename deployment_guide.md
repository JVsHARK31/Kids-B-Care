# Kids B-Care Object Explorer: Deployment Guide

## 1. Introduction

This document provides a comprehensive guide for deploying the **Kids B-Care Object Explorer** application. The application is designed to be child-friendly, offering object detection and nutritional analysis for food items, with a focus on an elegant, safe, fast, and accessible user experience. It is built as a monorepo, leveraging Next.js for the frontend and Python serverless functions (FastAPI with ONNXRuntime) for the backend, optimized for deployment on Vercel.

## 2. Application Architecture

The Kids B-Care Object Explorer follows a modern serverless monorepo architecture, enabling efficient development, deployment, and scaling. The key components are:

*   **Frontend (Next.js)**: Developed using React, Next.js, Tailwind CSS, and shadcn/ui. This provides a responsive, interactive, and child-friendly user interface. It handles image capture/upload, displays detection results, and presents nutritional information.
*   **Backend (Python Serverless with FastAPI)**: Implemented as serverless functions using FastAPI. This backend is responsible for:
    *   **Object Detection**: Utilizes YOLO (You Only Look Once) models, specifically `yolov8n.onnx`, for efficient and accurate object detection. Inference is performed using `onnxruntime`.
    *   **Nutrition Analysis**: Processes detected food items and provides nutritional information based on an integrated database.
    *   **Data Management**: Handles logging of detection events and potentially integrates with a PostgreSQL database (e.g., Neon) for persistent storage of user data, analytics, and leaderboard information.
*   **Monorepo Structure**: The project is organized as a monorepo using `pnpm` workspaces, allowing for shared configurations, dependencies, and streamlined development across frontend and backend components.
*   **Deployment Platform (Vercel)**: The entire application is designed for seamless deployment on Vercel, which supports both Next.js frontend and Python serverless functions.

### Architecture Diagram

```mermaid
graph TD
    User[User Browser] -->|Accesses| VercelCDN[Vercel CDN]
    VercelCDN -->|Serves Frontend| Frontend(Next.js App)
    Frontend -->|Image Upload/Webcam Stream| BackendAPI(Python Serverless API)
    BackendAPI -->|YOLO Inference (ONNXRuntime)| YOLOModel[YOLOv8n ONNX Model]
    BackendAPI -->|Nutrition Lookup| NutritionDB[Nutrition Database]
    BackendAPI -->|Log Detections/Stats| PostgreSQL[PostgreSQL (e.g., Neon)]
    PostgreSQL -->|Stores Data| BackendAPI
    YOLOModel -->|Returns Detections| BackendAPI
    NutritionDB -->|Returns Nutrition Info| BackendAPI
    BackendAPI -->|Returns Results| Frontend
    Frontend -->|Displays| User
```

## 3. Project Setup

To set up the project locally for development or to prepare for deployment, follow these steps:

### 3.1 Prerequisites

Ensure you have the following installed on your system:

*   **Node.js** (v18 or higher)
*   **pnpm** (preferred package manager for monorepos)
*   **Python** (v3.11 or higher)
*   **Git**

### 3.2 Clone the Repository

First, clone the project repository from your version control system:

```bash
git clone <your-repository-url>
cd kids-object-explorer
```

### 3.3 Environment Variables

Create a `.env` file in the root of the project based on the `.env.example` file. This file will contain sensitive information and configuration settings.

```bash
cp .env.example .env
```

Edit the `.env` file and fill in the necessary values:

```ini
# YOLO Model Configuration
MODEL_ONNX_URL=https://huggingface.co/SpotLab/YOLOv8Detection/resolve/main/yolov8n.onnx

# Database Configuration (Neon/PostgreSQL)
# Example for Neon: postgresql://[user]:[password]@[neon_hostname]/[db_name]?sslmode=require
DATABASE_URL=""

# Optional: Class names JSON URL (if hosted externally)
CLASS_NAMES_JSON_URL=""

# API Configuration (for local development)
API_BASE_URL=http://localhost:8000

# Vercel Blob Storage (for production, if used)
BLOB_READ_WRITE_TOKEN=""

# Development Settings
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8000
```

**Important**: For `DATABASE_URL`, ensure you replace the placeholder with your actual PostgreSQL connection string. For Vercel deployments, this will be automatically configured if you link a Neon database.

### 3.4 Install Dependencies

Navigate to the project root and install all dependencies using `pnpm`:

```bash
pnpm install
```

This command will install dependencies for both the `web` (Next.js) and `api` (Python serverless) applications within the monorepo.

### 3.5 Prepare Data Assets

The application uses pre-processed data for nutrition information and enhanced class labels. Run the data processing script:

```bash
python3 tools/process_kaggle_data.py --output models
```

This will generate `enhanced_class_labels.json`, `nutrition_database.json`, `child_safety_data.json`, and `dataset_summary.json` in the `models/` directory. These files are crucial for the frontend's functionality.

## 4. Local Development

To run the application locally, you need to start both the frontend and the backend services.

### 4.1 Start the Backend API

Navigate to the `apps/api` directory and start the FastAPI server:

```bash
cd apps/api
pip install -r requirements.txt
uvicorn infer:app --host 0.0.0.0 --port 8000 --reload
```

This will start the Python serverless API on `http://localhost:8000`.

### 4.2 Start the Frontend Application

In a separate terminal, navigate to the `apps/web` directory and start the Next.js development server:

```bash
cd apps/web
pnpm run dev
```

The frontend application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## 5. Deployment to Vercel

The Kids B-Care Object Explorer is designed for seamless deployment on Vercel. Follow these steps:

### 5.1 Vercel Account and Project Setup

1.  **Create a Vercel Account**: If you don't have one, sign up at [vercel.com](https://vercel.com/).
2.  **Link Git Repository**: Connect your Git repository (GitHub, GitLab, Bitbucket) to Vercel.
3.  **Import Project**: Import your `kids-object-explorer` repository as a new Vercel project.

### 5.2 Vercel Configuration (`vercel.json`)

The `vercel.json` file at the root of your monorepo is crucial for configuring Vercel to build and deploy both your Next.js frontend and Python serverless functions. Ensure your `vercel.json` looks similar to this:

```json
{
  "buildCommand": "pnpm install && pnpm build",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.9",
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "installCommand": "pnpm install",
  "outputDirectory": "apps/web/.next",
  "git": {
    "deploymentEnabled": true
  }
}
```

**Note**: The `runtime` for Python functions should match a supported Vercel Python runtime (e.g., `python3.9` or `python3.10`). Adjust as necessary.

### 5.3 Environment Variables on Vercel

Add your environment variables (especially `DATABASE_URL` and `MODEL_ONNX_URL`) to your Vercel project settings:

1.  Go to your project dashboard on Vercel.
2.  Navigate to **Settings** > **Environment Variables**.
3.  Add each variable (e.g., `DATABASE_URL`, `MODEL_ONNX_URL`) with its corresponding value. Mark them for both 
