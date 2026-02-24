import asyncio
import json
import logging
import sys
import os
import time
import traceback
from datetime import datetime

# ── Logging Setup ──────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RailGuard")

# ── FastAPI ────────────────────────────────────────────────
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="RailGuard 5000 API")

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"GLOBAL ERROR: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "type": type(exc).__name__,
            "trace": traceback.format_exc()
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Path & Import Fix ──────────────────────────────────────
# Try to figure out where we are
PWD = os.getcwd()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, PWD)

# ── System State ───────────────────────────────────────────
_INIT_STATUS = "Not Started"
_INIT_ERROR = None

try:
    # Attempt imports with fallback
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

    # Register all agents
    for agent in ALL_AGENTS:
        orchestrator.register_agent(agent)
    
    _INIT_STATUS = "Success"
except Exception as e:
    _INIT_STATUS = "Failed"
    _INIT_ERROR = f"{str(e)}\n{traceback.format_exc()}"
    logger.error(f"INIT ERROR: {_INIT_ERROR}")

# ── Routes ──────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "status": "online",
        "version": "8.2.4-PRODUCTION",
        "init_status": _INIT_STATUS,
        "init_error": _INIT_ERROR,
        "environment": {
            "python": sys.version,
            "pwd": PWD,
            "base_dir": BASE_DIR,
            "sys_path": sys.path[:5],
            "files": os.listdir(BASE_DIR)
        },
        "timestamp": time.time()
    }

@app.post("/chat")
async def chat_http(body: dict):
    if _INIT_STATUS != "Success":
        return {"error": "Initialization failed", "detail": _INIT_ERROR}
    query = str(body.get("query", ""))
    return await chatbot.process_query(query)

@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
    await websocket.accept()
    if _INIT_STATUS != "Success":
        await websocket.send_text(json.dumps({"error": "Init failed", "detail": _INIT_ERROR}))
        await websocket.close()
        return

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw) if "{" in raw else {"query": raw}
                query = str(msg.get("query", raw))
            except:
                query = raw

            if not query: continue

            # Stage 1: Thinking
            selected = chatbot.select_agents(query)
            await websocket.send_text(json.dumps({
                "type": "thinking",
                "active_agents": selected,
            }))

            await asyncio.sleep(0.5)

            # Stage 2: Response
            result = await chatbot.process_query(query)
            result["type"] = "response"
            await websocket.send_text(json.dumps(result))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WS error: {e}")

@app.websocket("/ws/updates")
async def ws_updates(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if _INIT_STATUS == "Success":
                payload = {
                    "blackboard": blackboard.get_status(),
                    "health": blackboard.get_all_health(),
                    "agents": [{"id": a.agent_id, "status": a.status} for a in orchestrator.agents]
                }
                await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2)
    except:
        pass

# ── Startup Logic ───────────────────────────────────────────
# We don't use @app.on_event("startup") to avoid blocking the server boot if agents fail
# Instead, we just have them registered. Live status will come from blackboard.
