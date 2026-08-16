import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token, get_current_user, hash_password
from ..db import get_db
from ..models import User
from ..schemas import Token, UserCreate, UserRead

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/auth/register")
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        existing = await db.execute(select(User).where(User.email == user_in.email))
        if existing.scalars().first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(
            name=user_in.name,
            email=user_in.email,
            hashed_password=hash_password(user_in.password),
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_active": user.is_active,
        }
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        logger.exception("Failed to register user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
