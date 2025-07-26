from typing import Any, Dict, List, Literal

from constants.chat_db_constants import CHAT_DB_PATH
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.history_aware_retriever import \
    create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.documents import Document
from langchain_core.messages import AIMessage, HumanMessage
from model.gemini import get_memory, llm, retriever
from model.sub_class import TimestampedSQLChatMessageHistory
from utils.prompt import CONDENSE_PROMPT, QA_PROMPT

# History-aware retriever (query rewriter → retriever)
# condenses chat history into a single standalone question before passing it to the retriever
history_aware_retriever = create_history_aware_retriever(
    llm=llm,
    retriever=retriever,
    prompt=CONDENSE_PROMPT,
)

# --- Answer Prompt (Docs + History + Question) ---
combine_docs_chain = create_stuff_documents_chain(
    llm=llm,
    prompt=QA_PROMPT,
)

# Combine history-aware retriever + answer generator
retrieval_chain = create_retrieval_chain(
    retriever=history_aware_retriever,
    combine_docs_chain=combine_docs_chain
)


def ask_with_history(user_query: str, session_id: str, mode: Literal['YAPLESS', 'BRIEF', 'DETAILED', 'AUTO'] = "AUTO") -> Dict[str, Any]:
    """
    Ask a question using the history-aware retriever and answer generator.

    Args:
        user_query (str): The user's question.
        session_id (str): Unique chat session ID for memory.

    Returns:
        str: The generated answer based on the context and chat history.
    """

    if not user_query:
        raise ValueError("Query is empty")

    memory = get_memory(session_id)
    chat_history = memory.load_memory_variables({}).get("chat_history", [])
    chat_history = [
        {
            "role": (
                "user" if isinstance(msg, HumanMessage)
                else "assistant" if isinstance(msg, AIMessage)
                else "system"
            ),
            "content": msg.content
        }
        for msg in chat_history
    ]

    # # Run chain with memory + user question
    output = retrieval_chain.invoke(
        input={
            "input": f"Chat History:\n{chat_history}\n\nFollow Up Input:\n{user_query}",
            "question": user_query,
            "chat_history": chat_history,
            "mode": mode
        },
    )

    docs: List[Document] = output.get("context", None)

    memory.chat_memory.add_user_message(user_query)
    memory.chat_memory.add_ai_message(output.get("answer", "") or "")

    return {"response": output.get("answer", "") or "", "session_id": session_id, "metadata": [d.metadata for d in docs] if docs else []}


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
