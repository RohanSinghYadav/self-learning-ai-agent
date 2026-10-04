from fastapi import FastAPI


app = FastAPI(
    title="Adaptive AI Data Analyst",
    description="AI-powered data analysis and agent platform",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Adaptive AI Data Analyst API is running",
        "status": "success",
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
