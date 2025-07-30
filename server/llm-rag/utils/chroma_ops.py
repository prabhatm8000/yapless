from langchain_core.documents import Document
from model.vectorize import vectorstore
from utils.type_classes import ContextData


def add_to_chroma(data: list[ContextData]):
    """
    Adds a list of ContextData objects to the Chroma database.
    Each ContextData object is converted to a Document with its text and metadata.

    Args:
        data (list[ContextData]): A list of ContextData objects to be added to the Chroma database.
    Returns:
        Chroma: The Chroma instance after adding the documents.
    """
    db = vectorstore.add_documents(
        documents=[Document(page_content=item.text, metadata=dict(item.meta)) for item in data])
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
    results = vectorstore.similarity_search(query, k=k)
    return results


def chroma_retriever():
    """
    Returns a retriever instance from the Chroma database.
    This retriever can be used to fetch documents based on similarity to a query.
    """
    return vectorstore.as_retriever()
