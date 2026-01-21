from dotenv import load_dotenv
import os

load_dotenv()

PROJECT_NAME = "NU Phil Backend"
API_V1_STR = "/api/v1"

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:8080")
