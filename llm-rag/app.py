from fastapi import FastAPI, Request
from model.gemini import ask_gemini_with_custom_prompt, get_search_keywords
from utils.chroma_ops import add_to_chroma
from utils.type_classes import ContextData

app = FastAPI()


@app.get("/keywords")
async def keywords(q: str):
    keywords = get_search_keywords(q)
    return {"keywords": keywords}
    # return {"keywords": ['monsoon season', 'green vegetables', 'food safety']}


@app.post("/llm/context")
async def chat(
    request: Request,
):
    query = request.query_params
    q = query.get("q", "")
    mode = query.get("mode", "")
    jsonBody = await request.json()
    data = jsonBody.get("context", None)
    if not data:
        return {"error": "No context provided"}

    context = [ContextData(**item) for item in data]

    add_to_chroma(data=context)
    output = ask_gemini_with_custom_prompt(
        user_query=q,
        mode=mode,
    )
    return output


@app.post("/llm/chat")
async def chat(
    request: Request
):
    data = request.query_params
    q = data.get("q", "")
    mode = data.get("mode", "")
    output = ask_gemini_with_custom_prompt(
        query=q,
        mode=mode,
    )
    return output
