import requests
from utils.envvar import WEB_SEARCH_SERVICE_URL
from utils.error import APIErrorResponse

def get_web_search_results(query: str):
    url = f'{WEB_SEARCH_SERVICE_URL}/?q={query}'
    response = requests.get(url)

    if (not response.ok):
        raise APIErrorResponse('Error while fetching search results')

    search_result_json = response.json()
    search_result =  dict(search_result_json)
    return search_result
