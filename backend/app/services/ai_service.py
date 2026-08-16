import os
from typing import Optional

import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_API_URL = os.getenv("CLAUDE_API_URL")


async def extract_invoice_embeddings(text: str) -> list[float]:
    if OPENAI_API_KEY:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/embeddings",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                json={"model": "text-embedding-3-large", "input": text},
            )
            response.raise_for_status()
            return response.json()["data"][0]["embedding"]

    return [0.0] * 1536


async def generate_recommendation(prompt: str) -> str:
    if ANTHROPIC_API_KEY:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/complete",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "model": "claude-3.5-opus",
                    "prompt": prompt,
                    "max_tokens": 250,
                },
            )
            response.raise_for_status()
            return response.json().get("completion", "")

    return "Review client payment terms and accelerate collections for receivables due in the next 30 days."
