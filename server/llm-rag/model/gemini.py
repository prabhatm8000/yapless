import uuid
from typing import Any, Dict, List, Literal

from constants.chat_db_constants import CHAT_DB_PATH
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from model.sub_class import TimestampedSQLChatMessageHistory
from utils import chroma_ops, envvar, error, text_processing
from utils.gemini import build_keyword_promt, build_prompt

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=envvar.GOOGLE_API_KEY,
)

retriever = chroma_ops.chroma_retriever()


def get_memory(session_id: str) -> ConversationBufferMemory:
    """
    Get conversation memory for a given session ID.
    This memory is used to store chat history and context for the session.

    Args:
        session_id (str): Unique identifier for the chat session.
    Returns:
        ConversationBufferMemory: Memory instance for the session.
    """
    history = TimestampedSQLChatMessageHistory(
        session_id=session_id,
        connection=CHAT_DB_PATH,
    )
    return ConversationBufferMemory(
        chat_memory=history,
        return_messages=True,
        memory_key="chat_history",
    )


def ask_gemini(
    user_query: str,
    mode:  Literal['YAPLESS', 'BRIEF', 'DETAILED', 'AUTO'] = "AUTO",
    session_id: str | None = None
) -> Dict[str, Any]:
    """
    Ask a question using Gemini LLM with a custom prompt.

    Args:
        user_query (str): The user's question.
        mode (YaplessMode): The mode of the Yapless application. "YAPLESS", "BRIEF", "DETAILED", or "AUTO".
        session_id (str | None): Unique chat session ID for memory. If None, a new ID is generated.

    Returns:
        str: The generated answer based on the context and chat history.
    """
    if not user_query:
        raise error.APIErrorResponse(
            "user_query is empty",
            status=400,
            success=False
        )
    if session_id is None:
        session_id = str(uuid.uuid4())

    docs = retriever.invoke(user_query)
    prompt = build_prompt(docs, user_query, mode=mode)

    # Optional: use memory if needed
    memory = get_memory(session_id)
    output = llm.invoke(prompt)

    # Save this in memory
    memory.chat_memory.add_user_message(user_query)
    memory.chat_memory.add_ai_message(output)
    return {"response": output.content or "", "session_id": session_id, "metadata": [d.metadata for d in docs]}


def get_search_keywords(user_query: str) -> List[str]:
    """
    Generate search keywords from a user's query using a specific prompt.
    Args:
        user_query (str): The user's question to generate keywords from.
    Returns:
        dict: A JSON object containing an array of keywords.
    """
    if not user_query:
        raise error.APIErrorResponse(
            "user_query is empty",
            status=400,
            success=False
        )

    prompt = build_keyword_promt(user_query=user_query)
    output = llm.invoke(prompt)

    str_json = output.content
    json_data = text_processing.parse_llm_json_response(str_json)

    return json_data.get("keywords", []) or []
