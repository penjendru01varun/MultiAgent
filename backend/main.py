import os
import sys

# Extremely aggressive path fixing
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, PARENT_DIR)

import asyncio
import json
import logging
import time
import traceback

from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Initialize App EARLY
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Systems (Placeholders)
blackboard = None
orchestrator = None
chatbot = None
_INIT_ERR = None

def load_systems():
    global blackboard, orchestrator, chatbot, _INIT_ERR
    try:
        # Delayed Imports
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

        blackboard = Blackboard()
        orchestrator = Orchestrator(blackboard)
        chatbot = ChatbotEngine(blackboard)

        for agent in ALL_AGENTS:
            orchestrator.register_agent(agent)
        
        return True
    except Exception as e:
        _INIT_ERR = f"LOAD ERROR: {str(e)}\n{traceback.format_exc()}"
        return False

# Run load
_LOADED = load_systems()

import time

@app.get("/")
async def root():
    now = 0
    try:
        now = time.time()
    except:
        pass
        
    return {
        "status": "online",
        "version": "8.2.6",
        "loaded": _LOADED,
        "error": _INIT_ERR,
        "timestamp": now,
        "debug": {
            "current_dir": CURRENT_DIR,
            "sys_path": sys.path[:3]
        }
    }

@app.post("/chat")
async def chat(request: Request):
    if not _LOADED:
        return JSONResponse(status_code=500, content={"error": "System not loaded", "detail": _INIT_ERR})
    data = await request.json()
    query = data.get("query", "")
    res = await chatbot.process_query(query)
    return res

@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
    await websocket.accept()
    if not _LOADED:
        await websocket.send_text(json.dumps({"error": "Init failed", "detail": _INIT_ERR}))
        await websocket.close()
        return
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
            if _LOADED:
                await websocket.send_text(json.dumps({
                    "blackboard": blackboard.get_status(),
                    "health": blackboard.get_all_health()
                }))
            await asyncio.sleep(1)
    except:
        pass
