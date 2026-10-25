import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[2] / "nexus_memory.db"


def init_memory():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_message(session_id: str, role: str, content: str):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "INSERT INTO conversations (session_id, role, content) VALUES (?, ?, ?)",
            (session_id, role, content),
        )


def get_history(session_id: str, limit: int = 20) -> list[dict]:
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute(
            """
            SELECT role, content FROM (
                SELECT id, role, content
                FROM conversations
                WHERE session_id = ?
                ORDER BY id DESC
                LIMIT ?
            )
            ORDER BY id ASC
            """,
            (session_id, limit),
        ).fetchall()

    return [{"role": role, "content": content} for role, content in rows]


init_memory()
