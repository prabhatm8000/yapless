from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

chat_db_file = BASE_DIR / "../db/chat/chat_history.db"
chat_db_file.parent.mkdir(parents=True, exist_ok=True)
chat_db_file.touch(exist_ok=True)

CHAT_DB_PATH = f"sqlite:///{chat_db_file}"


CHAT_DB_PATH = f"sqlite:///{BASE_DIR}/../db/chat/chat_history.db"
