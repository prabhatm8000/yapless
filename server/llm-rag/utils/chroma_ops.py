from constants import chroma_db_constants
from langchain_chroma import Chroma
from langchain_core.documents import Document
from model.vectorize import embeddings_model
from utils.type_classes import ContextData


def get_chroma():
    """
    Returns a Chroma instance configured with the embedding function and persistence directory.
    """
    return Chroma(
        embedding_function=embeddings_model,
        persist_directory=chroma_db_constants.CHROMA_PERSIST_DIRECTORY,
        collection_name=chroma_db_constants.COLLECTION_NAME
    )


def add_to_chroma(data: list[ContextData]):
    """
    Adds a list of ContextData objects to the Chroma database.
    Each ContextData object is converted to a Document with its text and metadata.

    Args:
        data (list[ContextData]): A list of ContextData objects to be added to the Chroma database.
    Returns:
        Chroma: The Chroma instance after adding the documents.
    """
    documents = [
        Document(page_content=d.text, metadata=dict(d.meta))
        for d in data
    ]
    db = get_chroma().add_documents(
        documents=documents
    )
    return db


def get_relevant_context(query: str, k: int = 5):
    """
    Retrieves the most relevant context from the Chroma database based on a query.

    Args:
        query (str): The query string to search for.
        k (int): The number of top results to return. Defaults to 5.

    Returns:
        list[Document]: A list of Document objects that are the most relevant to the query.
    """
    db = get_chroma()
    results = db.similarity_search(query, k=k)
    return results


def chroma_retriever():
    """
    Returns a retriever instance from the Chroma database.
    This retriever can be used to fetch documents based on similarity to a query.
    """
    r = get_chroma()
    return r.as_retriever()
