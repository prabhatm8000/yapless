from dotenv import load_dotenv
import os

load_dotenv()

WEB_SEARCH_SERVICE_URL = os.getenv("WEB_SEARCH_SERVICE_URL")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")