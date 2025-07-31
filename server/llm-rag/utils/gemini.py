from typing import Any, Dict, List, Literal

from langchain_core.documents import Document
from utils.prompt import PROMPT_INSTRUCTIONS, SEARCH_KEYWORD_PROPMT


def build_prompt(docs: List[Document], chat_history: List[Dict[str, Any]], user_query: str, mode:  Literal['YAPLESS', 'SARCASTIC', 'DETAILED', 'AUTO'] = "AUTO"):
    context = "\n\n".join([doc.page_content for doc in docs])
    prompt = f"""
You are a helpful assistant. Follow the instructions and Use the context below(if it's there) to answer the user's question.

Instructions:
{PROMPT_INSTRUCTIONS}

Mode: {mode}

Chat History:
{chat_history}

Context:
{context}

User Query:
{user_query}
"""
    return prompt


def build_keyword_promt(user_query: str, chat_history: List[Dict[str, Any]]):
    prompt = f"""
You are a helpful assistant. Follow the instructions to answer the user's question.

Instructions:
{SEARCH_KEYWORD_PROPMT}

chat History:
{chat_history}

User Query:
{user_query}
"""
    return prompt
