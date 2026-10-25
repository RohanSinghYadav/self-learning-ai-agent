import { useState } from "react";
import { sendChatMessage } from "../service/api";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(message) {
    const text = message.trim();

    if (!text || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: text },
    ]);

    setLoading(true);
    setError("");

    try {
      const reply = await sendChatMessage(text);

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setError(err.message || "Unable to connect to NEXUS backend.");
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, sendMessage };
}
