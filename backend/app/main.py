from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, candidates

app = FastAPI()

# ---------------------------
# CORS FIX (IMPORTANT)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# ROUTES
# ---------------------------
app.include_router(auth.router)
app.include_router(candidates.router)

@app.get("/")
def home():
    return {"message": "Backend running"}