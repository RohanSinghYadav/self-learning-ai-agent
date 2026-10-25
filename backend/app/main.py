from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.chat import router as chat_router

app = FastAPI(
    title="NEXUS — Adaptive AI Data Analyst",
    description="AI-powered data analysis and assistant platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": "NEXUS API is running",
        "status": "success",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

