## API Endpoints

### ### `GET /keywords` — **Query expansion for search**

> Generate focused search keywords from a user’s natural-language query.

**Use Case:**

-   User types: _“Why does my laptop shut down while gaming?”_
-   This returns: `["laptop thermal shutdown", "overheating while gaming", "gpu temperature limit"]`

**Inputs:**

```http
GET /keywords?query=Why does my laptop shut down while gaming?
```

**Output:**

```json
{
    "keywords": [
        "laptop overheating",
        "thermal shutdown",
        "gaming laptop issues"
    ]
}
```

> ✅ Can be prompt-based internally:
> _“Extract 3–5 short, Google-searchable keywords from this question…”_

---

### `POST /rag/query` — **Main RAG interaction**

> Handles multiple modes: fresh prompt, follow-up, hybrid RAG.

---

## Smart Behavior Based on Payload

### 🔹 Case 1: **prompt only**

-   → This is a **fresh normal query**
-   Do:

    -   Call Gemini with prompt

---

### 🔹 Case 2: **prompt + searchResults**

-   → This is a **fresh RAG query**
-   Do:

    -   Embed new docs
    -   Store them (optional)
    -   Retrieve most relevant
    -   Call Gemini with prompt + retrieved context

---

### 🔹 Case 3: **prompt + chatId**

-   → This is a **follow-up message**
-   Do:

    -   Fetch chat history
    -   Rebuild context window
    -   Continue thread (w/ Gemini multi-turn prompt)

---

### 🔹 Case 4: **prompt + chatId + searchResults**

-   → Follow-up + new RAG evidence
-   Do:

    -   Vectorize new results
    -   Merge retrieved vectors with chat context
    -   Respond in-context

---

## Chat history Implementaion

| Step                | What happens                                                               |
| ------------------- | -------------------------------------------------------------------------- |
| Load `chat_history` | Pulls all messages for this session from SQLite                            |
| Rephrase query      | If it's a follow-up, it rewrites it using `create_history_aware_retriever` |
| Retrieve context    | Uses Chroma retriever to get top‑K relevant docs                           |
| Combine prompt      | Passes: `{context}` + `{chat_history}` + `{question}` to Gemini            |
| LLM answers         | Gemini generates response using all that context                           |
| Save back to memory | Adds both user & AI message to chat history for next time                  |

---

## Chat flow

| Step                    | Function                    | Purpose                                         |
| ----------------------- | --------------------------- | ----------------------------------------------- |
| User starts a new topic | `ask_gemini`                | Controlled prompt generation with optional mode |
| User asks follow-ups    | `ask_with_history`          | Automatically rephrased + contextual            |
| Repeats                 | `ask_with_history`          | Keeps context growing and meaningful            |
| All messages saved      | via `SQLChatMessageHistory` | Persisted per `session_id`                      |
