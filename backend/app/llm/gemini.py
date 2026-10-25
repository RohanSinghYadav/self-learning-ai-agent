
from google import genai
import re

from app.config import GEMINI_API_KEY
from app.llm.memory import get_history, save_message
from app.llm.tools import calculate

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_response(message: str, session_id: str = "default") -> str:
    history = get_history(session_id)

    # Detect simple arithmetic requests and calculate locally.
    match = re.search(
        r"(?:calculate|compute|what is|solve)?\s*"
        r"(-?\d+(?:\.\d+)?(?:\s*[-+*/%]\s*-?\d+(?:\.\d+)?)+)",
        message,
        re.IGNORECASE,
    )

    if match:
        expression = match.group(1)
        try:
            result = calculate(expression)
            answer = f"The calculated result is {result}."
            save_message(session_id, "user", message)
            save_message(session_id, "model", answer)
            return answer
        except (ValueError, SyntaxError, ZeroDivisionError):
            pass

    contents = []

    for item in history:
        role = "user" if item["role"] == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": item["content"]}],
        })

    contents.append({
        "role": "user",
        "parts": [{"text": message}],
    })

    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=contents,
    )

    answer = response.text

    if answer is None or not answer.strip():
        return "I couldn't generate a response. Please try again."

    answer = answer.strip()

    save_message(session_id, "user", message)
    save_message(session_id, "model", answer)

    return answer
