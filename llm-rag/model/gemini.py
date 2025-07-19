from constants.gemini_constants import YaplessMode
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from utils import chroma_ops, envvar, gemini

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", google_api_key=envvar.GOOGLE_API_KEY)

retriever = chroma_ops.get_chroma().as_retriever()


def ask_gemini_with_custom_prompt(user_query: str, mode: YaplessMode) -> str:
    docs = retriever.invoke(user_query)
    prompt = gemini.build_prompt(docs, user_query, mode=mode)
    output = llm.invoke(prompt)
    return output.content  # or use `StrOutputParser()(output)` if needed
