# EduGuard AI

live at : https://eduguard.ashok1007.workers.dev

### AI-Powered Student Early Warning & Risk Detection Platform

EduGuard AI is an AI-powered early-warning platform designed to help educators identify students who may be at academic risk and provide timely support.

The platform combines a modern React dashboard, FastAPI backend, and a Random Forest machine-learning model to analyze student-related indicators and classify risk into **LOW, MEDIUM, or HIGH**.

---

## 🚀 Overview

Students can experience academic difficulties due to multiple factors such as attendance, study habits, motivation, access to resources, sleep, previous academic performance, and family or learning circumstances.

EduGuard AI brings these indicators together into a single dashboard and provides an AI-based risk signal that can help educators identify students who may benefit from additional attention.

### Core Risk Levels

| Risk Level | Meaning |
|---|---|
| 🟢 LOW | Lower predicted risk |
| 🟡 MEDIUM | Moderate predicted risk |
| 🔴 HIGH | Higher predicted risk |

---

## ✨ Key Features

### 📊 Student Dashboard
- Overview of student population
- Risk-level distribution
- Student monitoring
- Quick access to important indicators

### 👨‍🎓 Student Profiles
- Individual student information
- Academic indicators
- Attendance and study patterns
- Behavioral and learning indicators

### 🤖 AI Risk Analysis
- Random Forest machine-learning model
- LOW / MEDIUM / HIGH risk classification
- Prediction probability
- Real-time prediction through FastAPI

### 🚨 Early-Warning Alerts
- Identifies students with higher predicted risk
- Helps educators prioritize students for review
- Supports early intervention workflows

### 📈 Analytics
- Student risk distribution
- Risk trends
- Academic indicator analysis
- High-level insights for educators

### 🧠 Model Insights
- Machine-learning model information
- Prediction probabilities
- Risk factors and indicators

---

# 🧠 Machine Learning

EduGuard AI uses a **Random Forest Classifier** for student risk classification.

### Model Configuration

```text
Algorithm: Random Forest Classifier
Estimators: 400
Maximum Depth: 12
Minimum Samples per Leaf: 3
Class Weight: Balanced
Random State: 42
