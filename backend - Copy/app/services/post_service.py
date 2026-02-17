from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
from app.database import collection


# 🔹 Convert Mongo _id → string
def serialize(post):
    post["_id"] = str(post["_id"])
    return post


# 🔹 Validate ObjectId safely
def validate_object_id(post_id: str):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post ID")
    return ObjectId(post_id)


# ➕ Create Post
async def create_post(data, user_id: str):
    post = data.dict()

    post["user_id"] = user_id
    post["status"] = "draft"
    post["created_at"] = datetime.utcnow()
    post["updated_at"] = datetime.utcnow()

    result = collection.insert_one(post)
    new_post = collection.find_one({"_id": result.inserted_id})

    return serialize(new_post)


# ✏️ Update Post (Autosave)
async def update_post(post_id: str, data, user_id: str):
    object_id = validate_object_id(post_id)

    post = collection.find_one({
        "_id": object_id,
        "user_id": user_id
    })

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    update_data = {}

    if data.title is not None:
        update_data["title"] = data.title

    if data.content is not None:
        update_data["content"] = data.content

    if data.status is not None:
        update_data["status"] = data.status

    update_data["updated_at"] = datetime.utcnow()

    collection.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )

    updated_post = collection.find_one({"_id": object_id})
    return serialize(updated_post)


# 🚀 Publish Post
async def publish_post(post_id: str, user_id: str):
    object_id = validate_object_id(post_id)

    post = collection.find_one({
        "_id": object_id,
        "user_id": user_id
    })

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": "published",
                "updated_at": datetime.utcnow()
            }
        }
    )

    updated_post = collection.find_one({"_id": object_id})
    return serialize(updated_post)


# 📄 Get All Posts (Only user posts)
async def get_all_posts(user_id: str):
    posts = list(
        collection.find({"user_id": user_id})
        .sort("created_at", -1)
    )

    return [serialize(post) for post in posts]


# 📄 Get Single Post
async def get_post_by_id(post_id: str, user_id: str):
    object_id = validate_object_id(post_id)

    post = collection.find_one({
        "_id": object_id,
        "user_id": user_id
    })

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return serialize(post)
