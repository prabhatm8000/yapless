# Yapless

Yapless is a multi-mode AI chat system with integrated Web Search (Web, Reddit, Wikipedia) and Retrieval-Augmented Generation (RAG) capabilities.  
It follows a microservice + macroservice architecture for scalability and modularity.

---

### Services Overview

| Service            | Tech Stack                | Role                        |
| ------------------ | ------------------------- | --------------------------- |
| Client             | React.js + TypeScript     | Frontend UI                 |
| Main Service       | Node.js + TypeScript      | API Gateway & Orchestration |
| Web Search Service | Node.js + TypeScript      | Search + Scraping           |
| LLM Service        | Python + FastAPI + Chroma | Vectorization + Gemini LLM  |

---

## Features

-   Multiple chat modes: `detailed`, `sarcastic`, `auto`
-   Web, Reddit, and Wikipedia search
-   Multi-tier scraping (Readability → Cheerio → Puppeteer)
-   Vector storage & retrieval with Chroma DB
-   Fully containerized (Docker Compose)
-   Can also run without Docker for development or debugging

---

## Prerequisites

Choose one setup method:

### Docker Method (Recommended)

-   Docker >= 20.x
-   Docker Compose >= 2.x

### Manual Method (No Docker)

-   Node.js >= 18
-   Python >= 3.10
-   npm / yarn
-   pip

---

## Environment Setup

Each service requires its own `.env` file.

For each service, there is a `.env.sample` file that can be used as a template for setting up your environment variables.
Copy the `.env.sample` to `.env` (or `.env.local` for the client) and update it with your own values.

---

## Running with Docker (Recommended)

1. Clone the repository

```bash
git clone https://github.com/yourusername/yapless.git
cd yapless
```

2. Set up environment variables for all services using the provided `.env.sample` files.

3. Run the stack

```bash
docker compose up --build
```

4. Access the app
   Frontend: `http://localhost:3000`
   Main API: `http://localhost:8080`

---

## Running Without Docker

Run each service in its own terminal:

### 1. Start Chroma DB

```bash
pip install chromadb
chromadb run --path ./data/chroma
```

### 2. Web Search Service

```bash
cd services/web-search
cp .env.sample .env
npm install
npm run dev
```

### 3. LLM Service

```bash
cd services/llm-service
cp .env.sample .env
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 4. Main Service

```bash
cd services/main-service
cp .env.sample .env
npm install
npm run dev
```

### 5. Client

```bash
cd client
cp .env.sample .env.local
npm install
npm run dev
```

---

## API Endpoints

### Main Service

-   `POST /chat` → Chat with AI (with/without search)
-   `GET /health` → Health check

### Web Search Service

-   `POST /search` → Web/Reddit/Wikipedia search
-   `POST /scrape` → Scrape and clean a URL

### LLM Service

-   `POST /vectorize` → Store document vectors
-   `POST /query` → Query LLM with retrieval
