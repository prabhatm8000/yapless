from constants.chat_db_constants import CHAT_DB_PATH
from langchain_core.messages import AIMessage, HumanMessage
from model.sub_class import TimestampedSQLChatMessageHistory


def get_recent_chat_messages(
    session_id: str,
    skip: int = 0,
    limit: int = 6
):
    """
    Fetch paginated messages from chat history.

    Args:
        session_id (str): Unique chat session ID.
        limit (int): Number of messages to return.
        skip (int): Number of recent messages to skip (for pagination).

    Returns:
        List[Dict[str, str]]: Messages in the form [{role, content}, ...]
    """

    history = TimestampedSQLChatMessageHistory(
        session_id=session_id,
        connection=CHAT_DB_PATH
    )

    # Calculate slice range (oldest-to-newest order preserved)
    paginated = history.get_messages(limit=limit, skip=skip)
    return [
        {
            "role": (
                "user" if isinstance(msg, HumanMessage)
                else "assistant" if isinstance(msg, AIMessage)
                else "system"
            ),
            "content": msg.content
        }
        for msg in paginated
    ]


def clear_session(session_id: str):
    history = TimestampedSQLChatMessageHistory(
        session_id=session_id,
        connection=CHAT_DB_PATH
    )
    history.clear()
