"""
RailGuard 5000 — Main FastAPI Application
Bulletproof WebSocket server that NEVER closes client connections due to data errors.
"""

import asyncio
import json
import logging
import sys
import os
import time
import re

# ── Path setup ──────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("RailGuard")

# ── FastAPI ──────────────────────────────────────────────────
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# ── Internal modules ─────────────────────────────────────────
try:
    from backend.blackboard import Blackboard
    from backend.orchestrator import Orchestrator
    from backend.all_agents import ALL_AGENTS
    from backend.chatbot import ChatbotEngine
except ImportError:
    from blackboard import Blackboard
    from orchestrator import Orchestrator
    from all_agents import ALL_AGENTS
    from chatbot import ChatbotEngine

# ── App setup ────────────────────────────────────────────────
app = FastAPI(title="RailGuard 5000 API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global singletons ────────────────────────────────────────
blackboard  = Blackboard()
orchestrator = Orchestrator(blackboard)
chatbot     = ChatbotEngine(blackboard)

@app.get("/")
async def root():
    # Dynamic route listing for debugging
    routes = []
    for route in app.routes:
        methods = getattr(route, "methods", ["WS"])
        routes.append(f"{list(methods)} {route.path}")
    
    return {
        "status": "online", 
        "version": "8.2",
        "timestamp": time.time(),
        "message": "RailGuard 5000 API is operational",
        "registered_routes": routes
    }

# Register all 50 agents with the orchestrator
for agent in ALL_AGENTS:
    orchestrator.register_agent(agent)


# ── Startup ──────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("RailGuard 5000 starting — launching 50 agents...")
    await orchestrator.start_all()
    logger.info("All agents launched. API ready.")


# ── REST endpoint ─────────────────────────────────────────────
@app.post("/chat")
async def chat_http(body: dict):
    """Simple HTTP chat endpoint for testing."""
    query = str(body.get("query", ""))
    if not query:
        return {"error": "No query provided"}
    result = await chatbot.process_query(query)
    return result


# ── WebSocket: CHAT ──────────────────────────────────────────
@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
    await websocket.accept()
    logger.info("Chat WS client connected")
    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
                query = str(msg.get("query", ""))
            except Exception:
                query = raw

            if not query:
                continue

            # Phase 1 — notify frontend which agents are "thinking"
            selected = chatbot.select_agents(query)
            await websocket.send_text(json.dumps({
                "type": "thinking",
                "active_agents": selected,
            }))

            # Dramatic pause for cinematic effect
            await asyncio.sleep(1.2)

            # Phase 2 — full response
            result = await chatbot.process_query(query)
            result["type"] = "response"
            await websocket.send_text(json.dumps(result))

    except WebSocketDisconnect:
        logger.info("Chat WS client disconnected")
    except Exception as e:
        logger.error(f"Chat WS error: {e}")


# ── WebSocket: SYSTEM UPDATES ────────────────────────────────
@app.websocket("/ws/updates")
async def ws_updates(websocket: WebSocket):
    """
    Streams live system status every second.
    This loop NEVER breaks on data errors — it just logs and retries.
    The only way this connection closes is if the client disconnects.
    """
    await websocket.accept()
    logger.info("Updates WS client connected")

    try:
        while True:
            try:
                # Build payload — all data was sanitized at write time
                health_snapshot = blackboard.get_all_health()

                payload = {
                    "blackboard": blackboard.get_status(),
                    "agents": [
                        {
                            "id":     a.agent_id,
                            "name":   a.name,
                            "status": a.status,
                        }
                        for a in orchestrator.agents
                    ],
                    "health": health_snapshot,
                }

                # json.dumps will NEVER fail here because blackboard
                # sanitizes all data at write time
                await websocket.send_text(json.dumps(payload))

            except WebSocketDisconnect:
                raise  # re-raise so the outer handler catches it
            except Exception as e:
                # Log the error but DO NOT break — keep the connection alive
                logger.warning(f"Transient WS update error (skipping): {e}")

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        logger.info("Updates WS client disconnected normally")
    except Exception as e:
        logger.error(f"Updates WS fatal error: {e}")

    logger.info("Updates WS handler exiting")


# ── Entry point ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
