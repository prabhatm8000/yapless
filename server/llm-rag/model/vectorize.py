from langchain_google_genai import GoogleGenerativeAIEmbeddings
from utils import envvar

embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=envvar.GOOGLE_API_KEY
)


def embed_doc(data: list[str]):
    return embeddings_model.embed_documents(data)


def embed_query(data: str):
    return embeddings_model.embed_query(data)
