# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import PROJECT_NAME, API_V1_STR, FRONTEND_ORIGIN
from app.api.routes import notifications

app = FastAPI(title=PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://qmo-manila-events.onrender.com",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=API_V1_STR)
app.include_router(notifications.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "NU Phil Backend is running"}
