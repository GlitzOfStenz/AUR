import os
from google import genai
from google.genai import types
from fastapi import APIRouter, HTTPException
from schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])

API_KEY = os.getenv("CHAT_BOT_API_KEY")

SYSTEM_PROMPT = """You are the AI assistant for AUR (Asia University Rankings), an independent university ranking platform (this specific web application), not affiliated with Times Higher Education. You help users with 
                AUR's tools: institution rankings, university comparisons, 
                methodology, tuition, admission, and AUR tools. Keep answers concise (2-4 sentences 
                unless a list is needed)."""

@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest):
    if not API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Chat service unavailable."
        )

    client = genai.Client(api_key=API_KEY)

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=body.message,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=200,
                temperature=0.2,
            ),
        )
        return ChatResponse(reply=response.text)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=502, detail=str(e))
