from constants import chroma_db_constants
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from utils import envvar

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=envvar.GOOGLE_API_KEY
)

vectorstore = Chroma(
    embedding_function=embedding_model,
    persist_directory=chroma_db_constants.CHROMA_PERSIST_DIRECTORY,
    collection_name=chroma_db_constants.COLLECTION_NAME
)


def embed_doc(data: list[str]):
    return embedding_model.embed_documents(data)


def embed_query(data: str):
    return embedding_model.embed_query(data)
