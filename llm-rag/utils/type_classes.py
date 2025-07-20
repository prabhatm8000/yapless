from enum import Enum

from pydantic import BaseModel


class YaplessMode(Enum):
    YAPLESS = "YAPLESS"
    BRIEF = "BRIEF"
    DETAILED = "DETAILED"
    AUTO = "AUTO"


class ContextMeta(BaseModel):
    url: str | None = None
    icon: str | None = None
    title: str | None = None
    description: str | None = None


class ContextData(BaseModel):
    text: str | None = None
    meta: ContextMeta | None = None
