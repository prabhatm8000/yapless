from constants import chroma_db_constants
from langchain_chroma import Chroma
from langchain_core.documents import Document
from model.vectorize import embeddings_model


def add_to_chroma(texts: list[str], metadatas: list[dict]):
    documents = [
        Document(page_content=text, metadata=meta)
        for text, meta in zip(texts, metadatas)
    ]

    db = Chroma.from_documents(
        documents=documents,
        embedding=embeddings_model,
        persist_directory=chroma_db_constants.CHROMA_PERSIST_DIRECTORY,
        collection_name=chroma_db_constants.COLLECTION_NAME
    )

    return db


def get_chroma():
    return Chroma(
        embedding_function=embeddings_model,
        persist_directory=chroma_db_constants.CHROMA_PERSIST_DIRECTORY,
        collection_name=chroma_db_constants.COLLECTION_NAME
    )


def get_relevant_context(query: str, k: int = 5):
    db = get_chroma()
    results = db.similarity_search(query, k=k)
    return results


def chroma_retriever():
    r = get_chroma()
    return r.as_retriever()
