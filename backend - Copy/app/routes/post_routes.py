from fastapi import APIRouter, Depends
from app.schemas.post_schema import PostCreate, PostUpdate
from app.services.post_service import (
    create_post,
    update_post,
    publish_post,
    get_all_posts,
    get_post_by_id,
)
from app.utils.security import get_current_user

router = APIRouter(
    prefix="/api/posts",
    tags=["Posts"],
)


# ➕ Create New Draft
@router.post("/")
async def create(
    data: PostCreate,
    current_user: dict = Depends(get_current_user)
):
    return await create_post(data, current_user["user_id"])


# ✏️ Update Post (Auto-save + Title update)
@router.patch("/{post_id}")
async def update(
    post_id: str,
    data: PostUpdate,
    current_user=Depends(get_current_user),
):
    return await update_post(post_id, data, current_user["user_id"])



# 🚀 Publish Post
@router.post("/{post_id}/publish")
async def publish(
    post_id: str,
    current_user=Depends(get_current_user),
):
    return await publish_post(post_id, current_user["user_id"])


# 📄 Get All Posts (Only User's Posts)
@router.get("/")
async def get_posts(current_user: dict = Depends(get_current_user)):
    return await get_all_posts(current_user["user_id"])



# 📄 Get Single Post (Only If Owner)
@router.get("/{post_id}")
async def get_post(
    post_id: str,
    current_user=Depends(get_current_user),
):
    return await get_post_by_id(post_id, current_user["user_id"])
