import asyncio
import json
import logging
import sys
import os
import time

# Ultra-stable logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RailGuard")

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RailGuard 5000 Recovery")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global placeholders
blackboard = None
orchestrator = None
chatbot = None
init_error = None

def initialize_systems():
    global blackboard, orchestrator, chatbot, init_error
    try:
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        
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
            
        return "Success"
    except Exception as e:
        import traceback
        init_error = f"{str(e)}\n{traceback.format_exc()}"
        return f"Error: {init_error}"

# Initialize on module load, but don't let it crash the whole app
init_status = initialize_systems()

@app.get("/")
async def root():
    return {
        "status": "online",
        "version": "8.2.3-RECOVERY",
        "init_status": init_status,
        "init_error": init_error,
        "timestamp": time.time()
    }

@app.post("/chat")
async def chat_http(body: dict):
    if not chatbot: return {"error": "System not initialized", "detail": init_error}
    query = body.get("query", "")
    return await chatbot.process_query(query)

@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
    await websocket.accept()
    if not chatbot:
        await websocket.send_text(json.dumps({"error": "System not initialized"}))
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
    except: pass


# ── Entry point ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
