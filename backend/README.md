# EduGuard AI prediction API

This FastAPI package provides a same-origin `/health` endpoint and a typed `POST /predict` integration seam for a future, supplied Random Forest artifact. It **does not train a model**. Until a compatible `student_early_risk_model.joblib` is supplied and can be loaded, `/predict` returns HTTP 503 with `detail.code = "model_not_connected"` (or a documented load/inference error) and explicitly states that no prediction was produced.

The future model must implement `predict_proba()`, accept the seven named request features, expose compatible feature names when present, and use string classes `LOW`, `MEDIUM`, and/or `HIGH`. Incompatible artifacts remain unavailable rather than receiving an invented class mapping.

Local development from the repository root:

```bash
backend/.venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

The Vite development server runs on port 3000 and proxies `/health` and `/predict` to this API. The published deployment runs the API container on its platform-provided `PORT`.
