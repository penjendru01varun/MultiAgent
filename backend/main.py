import asyncio
import json
import logging
import sys
import os
import time
import re

# Standard logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RailGuard")

# FastAPI Setup
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Force path for Render
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Simple imports
try:
    from blackboard import Blackboard
    from orchestrator import Orchestrator
    from all_agents import ALL_AGENTS
    from chatbot import ChatbotEngine
except ImportError:
    from backend.blackboard import Blackboard
    from backend.orchestrator import Orchestrator
    from backend.all_agents import ALL_AGENTS
    from backend.chatbot import ChatbotEngine

app = FastAPI(title="RailGuard 5000 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Systems
blackboard = Blackboard()
orchestrator = Orchestrator(blackboard)
chatbot = ChatbotEngine(blackboard)

# Register agents
for agent in ALL_AGENTS:
    orchestrator.register_agent(agent)

@app.get("/")
async def root():
    return {
        "status": "online",
        "version": "8.2.2",
        "timestamp": time.time(),
        "agents_registered": len(orchestrator.agents)
    }

@app.post("/chat")
async def chat_http(body: dict):
    query = body.get("query", "")
    return await chatbot.process_query(query)

@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw = await websocket.receive_text()
            msg = json.loads(raw) if "{" in raw else {"query": raw}
            query = msg.get("query", raw)
            
            selected = chatbot.select_agents(query)
            await websocket.send_text(json.dumps({"type": "thinking", "active_agents": selected}))
            await asyncio.sleep(0.5)
            
            result = await chatbot.process_query(query)
            result["type"] = "response"
            await websocket.send_text(json.dumps(result))
    except:
        pass

@app.websocket("/ws/updates")
async def ws_updates(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_text(json.dumps({
                "blackboard": blackboard.get_status(),
                "health": blackboard.get_all_health()
            }))
            await asyncio.sleep(1)
    except:
        pass

# Skip startup auto-launching of all 50 agents for now to isolate the crash
# @app.on_event("startup")
# async def startup():
#    await orchestrator.start_all()


# ── Entry point ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
