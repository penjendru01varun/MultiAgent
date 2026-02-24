import asyncio
import json
import logging
import sys
import os
import time as time_module  # Use an alias to avoid any shadowing
import traceback

# ── Logging Setup ──────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RailGuard")

# ── FastAPI ────────────────────────────────────────────────
from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="RailGuard 5000 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Path & Import Fix ──────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# ── Global System Containers ────────────────────────────────
# Using names that don't conflict with filenames
CORE_BLACKBOARD = None
CORE_ORCHESTRATOR = None
CORE_CHATBOT = None
INIT_STATUS = "PENDING"
INIT_ERROR = None

def boot_engine():
    global CORE_BLACKBOARD, CORE_ORCHESTRATOR, CORE_CHATBOT, INIT_STATUS, INIT_ERROR
    try:
        # Import inside function to avoid top-level path issues
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

        CORE_BLACKBOARD = Blackboard()
        CORE_ORCHESTRATOR = Orchestrator(CORE_BLACKBOARD)
        CORE_CHATBOT = ChatbotEngine(CORE_BLACKBOARD)

        for agent in ALL_AGENTS:
            CORE_ORCHESTRATOR.register_agent(agent)
            
        INIT_STATUS = "SUCCESS"
        logger.info("SYSTEM BOOT SEQUENCE COMPLETE")
    except Exception as e:
        INIT_STATUS = "FAILED"
        INIT_ERROR = f"{str(e)}\n{traceback.format_exc()}"
        logger.error(f"BOOT ERROR: {INIT_ERROR}")

# Run boot
boot_engine()

# ── Routes ──────────────────────────────────────────────────

@app.get("/")
async def root():
    # Get time safely
    try:
        current_time = time_module.time()
    except Exception:
        current_time = 0
        
    return {
        "status": "online",
        "version": "8.2.7-LOCKED",
        "boot_status": INIT_STATUS,
        "boot_error": INIT_ERROR,
        "telemetry": {
            "time": current_time,
            "agents": len(CORE_ORCHESTRATOR.agents) if CORE_ORCHESTRATOR else 0
        }
    }

@app.post("/chat")
async def chat_http(request: Request):
    if INIT_STATUS != "SUCCESS":
        return JSONResponse(status_code=500, content={"error": "Engine Not Booted", "detail": INIT_ERROR})
    
    try:
        body = await request.json()
        query = str(body.get("query", ""))
        result = await CORE_CHATBOT.process_query(query)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e), "trace": traceback.format_exc()})

@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
    await websocket.accept()
    if INIT_STATUS != "SUCCESS":
        await websocket.send_text(json.dumps({"type": "error", "message": "Engine not booted"}))
        await websocket.close()
        return

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw) if "{" in raw else {"query": raw}
                query = str(msg.get("query", raw))
            except Exception:
                query = raw

            if not query: continue

            # Notify thinking
            selected = CORE_CHATBOT.select_agents(query)
            await websocket.send_text(json.dumps({
                "type": "thinking",
                "active_agents": selected,
            }))

            await asyncio.sleep(0.5)

            # Process & Send
            result = await CORE_CHATBOT.process_query(query)
            result["type"] = "response"
            await websocket.send_text(json.dumps(result))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WS CHAT ERROR: {e}")

@app.websocket("/ws/updates")
async def ws_updates(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if INIT_STATUS == "SUCCESS":
                payload = {
                    "blackboard": CORE_BLACKBOARD.get_status(),
                    "health": CORE_BLACKBOARD.get_all_health(),
                    "agents": [{"id": a.agent_id, "status": a.status} for a in CORE_ORCHESTRATOR.agents]
                }
                await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2)
    except Exception:
        pass

@app.on_event("startup")
async def startup_event():
    if INIT_STATUS == "SUCCESS":
        logger.info("Sparking all 50 agents into life...")
        await CORE_ORCHESTRATOR.start_all()
        logger.info("All agents are now running in background.")

# ── Entry point ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
