from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import post_routes
from app.routes import auth_routes
from app.routes import ai


# ✅ Create app FIRST
app = FastAPI()


# ✅ Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Register routers AFTER app creation
app.include_router(post_routes.router)
app.include_router(auth_routes.router)
app.include_router(ai.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Smart Blog API Running"}
