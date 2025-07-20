from constants import gemini_constants
from langchain_core.documents import Document
from utils.type_classes import YaplessMode


def build_prompt(docs: list[Document], user_query: str, mode: YaplessMode):
    context = "\n\n".join([doc.page_content for doc in docs])
    prompt = f"""
You are a helpful assistant. Follow the instructions and Use the context below(if it's there) to answer the user's question.

Instructions:
{gemini_constants.PROMPT_INSTRUCTIONS}

Mode: {mode}

Context:
{context}

User Query:
{user_query}
"""
    return prompt


def build_keyword_promt(user_query: str):
    prompt = f"""
You are a helpful assistant. Follow the instructions to answer the user's question.

Instructions:
{gemini_constants.SEARCH_KEYWORD_PROPMT}

User Query:
{user_query}
"""
    return prompt
