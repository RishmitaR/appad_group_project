from fastapi import APIRouter, HTTPException, status

from app.database import users_collection
from app.models import UserLogin, UserRegister
from app.auth import verify_password, hash_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}")
async def get_user(user_id: str) -> dict:
    user = await users_collection.find_one({"userid": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{user_id}' not found",
        )

    user["_id"] = str(user["_id"])
    return user

@router.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"userid": user.userid})
    if not db_user or not verify_password(db_user["password"], user.password):
        raise HTTPException(status_code=401, detail="Invalid user ID or password")

    return {"message": "Login successful", "userid": db_user["userid"]}

@router.post("/register")
async def register(user: UserRegister):
    # Check if user already exists
    existing = await users_collection.find_one({"userid": user.userid})
    if existing:
        raise HTTPException(status_code=400, detail="User ID already exists")
    hashed_pw = hash_password(user.password)
    new_user = {"userid": user.userid, "password": hashed_pw}
    await users_collection.insert_one(new_user)
    return {"message": "User created successfully"}
