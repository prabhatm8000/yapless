from constants import chroma_db_constants
from langchain_chroma import Chroma
from langchain_core.documents import Document
from model.vectorize import embeddings_model
from utils.type_classes import ContextData


def get_chroma():
    return Chroma(
        embedding_function=embeddings_model,
        persist_directory=chroma_db_constants.CHROMA_PERSIST_DIRECTORY,
        collection_name=chroma_db_constants.COLLECTION_NAME
    )


def add_to_chroma(data: list[ContextData]):
    documents = [
        Document(page_content=d.text, metadata=dict(d.meta))
        for d in data
    ]
    db = get_chroma().add_documents(
        documents=documents
    )
    return db


def get_relevant_context(query: str, k: int = 5):
    db = get_chroma()
    results = db.similarity_search(query, k=k)
    return results


def chroma_retriever():
    r = get_chroma()
    return r.as_retriever()
