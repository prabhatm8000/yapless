from fastapi import FastAPI, Request
from model.chat_history import get_recent_chat_messages
from model.gemini import ask_gemini, get_search_keywords
from utils.chroma_ops import add_to_chroma
from utils.envvar import PORT
from utils.type_classes import ContextData

app = FastAPI()


@app.get("/keywords")
async def keywords(q: str):
    try:
        if not q:
            return {"error": "Query is empty", "status": 400, "success": False}
        keywords = get_search_keywords(q)
        return {
            "output": {
                "keywords": keywords,
                "query": q
            },
            "status": 200,
            "success": True
        }
    except Exception as e:
        return {"error": str(e), "status": 500, "success": False}


@app.post("/context-provider")
async def context(
    request: Request,
):
    try:
        jsonBody = await request.json()
        data = jsonBody.get("context", None)
        if not data:
            return {"error": "No context provided", "status": 400, "success": False}

        context = [ContextData(**item) for item in data]

        add_to_chroma(data=context)
        return {"message": "Context added to Chroma", "status": 200, "success": True}
    except Exception as e:
        return {"error": str(e), "status": 500, "success": False}


@app.get("/chat")
async def chat(
    request: Request
):
    try:
        query = dict(request.query_params)
        user_query = query.get("q", None)
        mode = query.get("mode", "AUTO")
        use_context = query.get("use_context", False)
        if not user_query:
            return {"error": "Query is empty", "status": 400, "success": False}

        session_id = query.get("session_id", None)
        output = ask_gemini(
            user_query=user_query,
            mode=mode,
            session_id=session_id,
            use_context=use_context
        )
        return {"output": output, "status": 200, "success": True}

    except Exception as e:
        print(e)
        return {"error": str(e), "status": 500, "success": False}


@app.get("/messages")
async def messages(
    request: Request
):
    try:
        query = dict(request.query_params)
        session_id = query.get("session_id", None)
        if not session_id:
            return {"error": "Session ID is required", "status": 400, "success": False}

        skip = int(query.get("skip", 0))
        limit = int(query.get("limit", 6))
        messages = get_recent_chat_messages(
            session_id=session_id,
            skip=skip,
            limit=limit
        )
        return {
            "output": {
                "messages": messages,
                "session_id": session_id,
                "skip": skip,
                "limit": limit
            },
            "status": 200,
            "success": True
        }
    except Exception as e:
        return {"error": str(e), "status": 500, "success": False}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(PORT),
        reload=True,
    )
