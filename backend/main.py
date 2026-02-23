import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.blackboard import Blackboard
from backend.orchestrator import Orchestrator
import json

app = FastAPI(title="RailGuard 5000 API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.agent_loader import load_all_agents

blackboard = Blackboard()
orchestrator = Orchestrator(blackboard)

@app.on_event("startup")
async def startup_event():
    # Load and register all agents
    load_all_agents(orchestrator, blackboard)
    asyncio.create_task(orchestrator.start_all())

@app.get("/")
async def root():
    return {"status": "RailGuard 5000 Active", "agents_registered": len(orchestrator.agents)}

@app.get("/blackboard/{layer}")
async def read_layer(layer: int):
    return await blackboard.read(layer)

@app.get("/system/status")
async def system_status():
    return {
        "blackboard": blackboard.get_status(),
        "agents": [{"id": a.agent_id, "name": a.name, "status": a.status} for a in orchestrator.agents]
    }

@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send system state updates every second
            status = {
                "blackboard": blackboard.get_status(),
                "agents": [{"id": a.agent_id, "name": a.name, "status": a.status} for a in orchestrator.agents],
                # Add sample raw data for UI from layer 3 (health)
                "health": await blackboard.read(3)
            }
            await websocket.send_text(json.dumps(status))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("Client disconnected")
