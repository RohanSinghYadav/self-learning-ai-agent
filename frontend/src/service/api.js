
const API_BASE_URL = "http://127.0.0.1:8000";

const SESSION_KEY = "nexus_session_id";

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Session-ID": getSessionId(),
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || `Backend request failed (${response.status})`
    );
  }

  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The AI returned an empty response.");
  }

  return data.reply.trim();
}
