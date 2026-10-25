from fastapi import Header
from fastapi import APIRouter, HTTPException

from app.llm.gemini import generate_response
from app.llm.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api", tags=["AI Chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    x_session_id: str = Header(default="default"),
):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    try:
        reply = generate_response(message, session_id=x_session_id)
        return ChatResponse(reply=reply)
    except Exception as exc:
        print(f"Gemini API error: {exc}")
        raise HTTPException(
            status_code=502,
            detail="AI service failed. Check the backend terminal logs.",
        )