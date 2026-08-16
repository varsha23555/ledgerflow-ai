import os
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ledgerflow.db")

engine = create_async_engine(DATABASE_URL, future=True, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

def _ensure_users_name_column(sync_conn) -> None:
    inspector = inspect(sync_conn)
    if "users" not in inspector.get_table_names():
        return
    columns = [column["name"] for column in inspector.get_columns("users")]
    if "name" not in columns:
        sync_conn.execute(
            text(
                "ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT 'Business User'"
            )
        )

async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_ensure_users_name_column)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
