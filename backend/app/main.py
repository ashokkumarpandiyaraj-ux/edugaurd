from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="EduGuard AI Prediction API",
    version="2.0.0",
    description="Early academic risk prediction API powered by a Random Forest model.",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Vite / local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Current frontend
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Network frontend shown in your browser
        "http://192.168.137.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD MACHINE LEARNING MODEL
# ============================================================

MODEL_PATH = (
    Path(__file__).resolve().parents[1]
    / "student_early_risk_model.joblib"
)

try:
    model = joblib.load(MODEL_PATH)
    MODEL_LOADED = True
    MODEL_ERROR = None
except Exception as exc:
    model = None
    MODEL_LOADED = False
    MODEL_ERROR = str(exc)


# ============================================================
# REQUEST MODEL
# ============================================================

class PredictionInput(BaseModel):
    Hours_Studied: float
    Attendance: float
    Parental_Involvement: str
    Access_to_Resources: str
    Extracurricular_Activities: str
    Sleep_Hours: float
    Previous_Scores: float
    Motivation_Level: str
    Internet_Access: str
    Tutoring_Sessions: float
    Family_Income: str
    Teacher_Quality: str
    School_Type: str
    Peer_Influence: str
    Physical_Activity: float
    Learning_Disabilities: str
    Parental_Education_Level: str
    Distance_from_Home: str
    Gender: str


class PredictionResponse(BaseModel):
    risk: Literal["LOW", "MEDIUM", "HIGH"]
    probability: float


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "name": "EduGuard AI Prediction API",
        "version": "2.0.0",
        "status": "running",
        "model_status": "loaded" if MODEL_LOADED else "error",
        "docs": "/docs",
        "health": "/health",
        "predict": "/predict",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy" if MODEL_LOADED else "unhealthy",
        "model_loaded": MODEL_LOADED,
        "model_path": str(MODEL_PATH),
        "model_error": MODEL_ERROR,
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/model-info")
def model_info():
    if not MODEL_LOADED:
        return {
            "model_loaded": False,
            "error": MODEL_ERROR,
        }

    return {
        "model_loaded": True,
        "model_type": type(model).__name__,
        "model_path": str(MODEL_PATH),
        "risk_classes": ["LOW", "MEDIUM", "HIGH"],
        "features": [
            "Hours_Studied",
            "Attendance",
            "Parental_Involvement",
            "Access_to_Resources",
            "Extracurricular_Activities",
            "Sleep_Hours",
            "Previous_Scores",
            "Motivation_Level",
            "Internet_Access",
            "Tutoring_Sessions",
            "Family_Income",
            "Teacher_Quality",
            "School_Type",
            "Peer_Influence",
            "Physical_Activity",
            "Learning_Disabilities",
            "Parental_Education_Level",
            "Distance_from_Home",
            "Gender",
        ],
    }


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionInput):

    # Check that the ML model loaded successfully
    if not MODEL_LOADED or model is None:
        raise HTTPException(
            status_code=500,
            detail=f"ML model is not loaded. Error: {MODEL_ERROR}",
        )

    try:
        # ----------------------------------------------------
        # Convert incoming JSON to DataFrame
        # ----------------------------------------------------

        input_data = pd.DataFrame(
            [
                {
                    "Hours_Studied": data.Hours_Studied,
                    "Attendance": data.Attendance,
                    "Parental_Involvement": data.Parental_Involvement,
                    "Access_to_Resources": data.Access_to_Resources,
                    "Extracurricular_Activities": data.Extracurricular_Activities,
                    "Sleep_Hours": data.Sleep_Hours,
                    "Previous_Scores": data.Previous_Scores,
                    "Motivation_Level": data.Motivation_Level,
                    "Internet_Access": data.Internet_Access,
                    "Tutoring_Sessions": data.Tutoring_Sessions,
                    "Family_Income": data.Family_Income,
                    "Teacher_Quality": data.Teacher_Quality,
                    "School_Type": data.School_Type,
                    "Peer_Influence": data.Peer_Influence,
                    "Physical_Activity": data.Physical_Activity,
                    "Learning_Disabilities": data.Learning_Disabilities,
                    "Parental_Education_Level": data.Parental_Education_Level,
                    "Distance_from_Home": data.Distance_from_Home,
                    "Gender": data.Gender,
                }
            ]
        )

        # ----------------------------------------------------
        # Generate prediction
        # ----------------------------------------------------

        prediction = model.predict(input_data)

        # Example:
        # prediction = ["HIGH"]

        predicted_risk = str(prediction[0]).upper()

        # ----------------------------------------------------
        # Generate probabilities
        # ----------------------------------------------------

        probabilities = model.predict_proba(input_data)[0]

        classes = list(model.classes_)

        # Find probability belonging to predicted class
        if predicted_risk in classes:
            class_index = classes.index(predicted_risk)
            probability = float(probabilities[class_index])
        else:
            probability = float(max(probabilities))

        # Keep probability between 0 and 1
        probability = max(0.0, min(1.0, probability))

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------

        return PredictionResponse(
            risk=predicted_risk,
            probability=round(probability, 4),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )


# ============================================================
# FRONTEND / API STATUS
# ============================================================

@app.get("/api/status")
def api_status():
    return {
        "api": "EduGuard AI",
        "status": "connected",
        "model_loaded": MODEL_LOADED,
        "model_status": (
            "ready"
            if MODEL_LOADED
            else "error"
        ),
        "message": (
            "EduGuard AI prediction service is ready."
            if MODEL_LOADED
            else f"Model failed to load: {MODEL_ERROR}"
        ),
    }