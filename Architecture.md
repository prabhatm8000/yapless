## Architecture (3-Service Model)

### 1. **Web Search Service** (Node.js)

-   Takes a query
-   Performs web search or gets form cache db
-   Scrapes and returns full raw search result JSON

#### **API enndpoints**

-   search `/?q=<query>`

---

### 2. **LLM Service** (Python/FastAPI)

-   Vectorizes `text`
-   Stores in Chroma
-   Retrieves similar chunks
-   Calls Gemini with chunked context
-   Returns: final answer + sources

---

### 3. **Main Orchestrator** (Node.js)

-   Takes user query (e.g. from your front-end)
-   Calls Web Search service
-   Clean up, pre process for LLM
-   Sends cleaned array of:

    ```ts
    {
      text: string;
      metadata: {
        title?: string;
        url?: string;
        description?: string;
        icon?: string;
      }
    }[]
    ```

    to the LLM service

```

```
