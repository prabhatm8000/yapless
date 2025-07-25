import datetime
import sqlite3
from typing import List

from langchain.schema import messages_from_dict, messages_to_dict
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.messages import BaseMessage


class TimestampedSQLChatMessageHistory(SQLChatMessageHistory):
    """
    A subclass of SQLChatMessageHistory that adds a timestamp to each message.
    """

    def __init__(self, session_id: str, connection: str):
        super().__init__(session_id, connection)
        self.session_id = session_id
        self.connection = connection
        self.table_name = "messages"
        self._create_tables_if_not_exists()

    def _create_tables_if_not_exists(self) -> None:
        with sqlite3.connect(self.connection.replace("sqlite:///", "")) as conn:
            conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message TEXT NOT NULL,
                type TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            conn.commit()

    def add_message(self, message: BaseMessage) -> None:
        message_dict = messages_to_dict([message])[0]
        with sqlite3.connect(self.connection.replace("sqlite:///", "")) as conn:
            conn.execute(
                "INSERT INTO messages (session_id, message, type, created_at) VALUES (?, ?, ?, ?)",
                (
                    self.session_id,
                    message_dict["data"]['content'],
                    message_dict["type"],
                    datetime.datetime.now(datetime.timezone.utc).isoformat(),
                ),
            )
            conn.commit()

    @property
    def messages(self) -> List[BaseMessage]:
        """
        Fetch recent 6 messages from the database.
        Returns:
            List[BaseMessage]: All messages in the session.
        """
        return self.get_messages(6)

    def get_messages(self, limit: int, skip: int = 0) -> List[BaseMessage]:
        with sqlite3.connect(self.connection.replace("sqlite:///", "")) as conn:
            result = conn.execute(
                "SELECT message, type FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
                (self.session_id, limit, skip),
            )
            rows = result.fetchall()
        messages = []
        for message, type_ in rows:
            messages.append({"type": type_, "data": {"content": message}})
        messages.reverse()
        return messages_from_dict(messages)
