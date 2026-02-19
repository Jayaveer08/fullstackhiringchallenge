from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


# 🔹 Create Post Schema
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1)
    content: Dict[str, Any]
    status: Optional[str] = "draft"


# 🔹 Update Post Schema
class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)  # ❌ remove min_length
    content: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

