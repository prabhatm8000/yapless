from langchain.chat_models import init_chat_model
from langchain_google_genai import ChatGoogleGenerativeAI
from utils import chroma_ops, envvar, error, text_processing
from utils.gemini import build_keyword_promt, build_prompt
from utils.type_classes import YaplessMode

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=envvar.GOOGLE_API_KEY
)

retriever = chroma_ops.chroma_retriever()


def ask_gemini_with_custom_prompt(user_query: str, mode: YaplessMode):
    if not user_query:
        raise error.APIErrorResponse(
            "user_query is empty",
            status=400,
            success=False
        )

    docs = retriever.invoke(user_query)
    prompt = build_prompt(docs, user_query, mode=mode)
    output = llm.invoke(prompt)
    return output


def get_search_keywords(user_query: str):
    if not user_query:
        raise error.APIErrorResponse(
            "user_query is empty", status=400, success=False)
    prompt = build_keyword_promt(user_query=user_query)
    output = llm.invoke(prompt)
    strJson = output.content
    json = text_processing.parse_llm_json_response(raw_response=strJson)
    return json
