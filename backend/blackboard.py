"""
RailGuard 5000 — Blackboard (Shared Memory)
A simple, bulletproof shared store. All data stored here is guaranteed 
to be JSON-serializable at write time, so the WS endpoint never crashes.
"""
import asyncio
import time
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("Blackboard")


def _sanitize(obj):
    """Recursively convert any value into a JSON-safe primitive."""
    if obj is None or isinstance(obj, (bool, int, float, str)):
        return obj
    if isinstance(obj, (list, tuple)):
        return [_sanitize(i) for i in obj]
    if isinstance(obj, dict):
        return {str(k): _sanitize(v) for k, v in obj.items()}
    # Fallback: convert to string
    return str(obj)


class Blackboard:
    """
    6-layer shared memory space for 50 agents.
    All writes are sanitized, so reads are always JSON-safe.
    """

    LAYER_NAMES = {
        1: "RAW_SENSOR",
        2: "ENHANCED_DATA",
        3: "COMPONENT_HEALTH",
        4: "PREDICTIONS",
        5: "DECISIONS",
        6: "NETWORK_STATE",
    }

    def __init__(self):
        # Each layer: { agent_id: payload_dict }
        self._store: Dict[int, Dict[str, Any]] = {i: {} for i in range(1, 7)}
        self._locks = {i: asyncio.Lock() for i in range(1, 7)}

    async def write(self, layer: int, agent_id: str, data: dict):
        """Write JSON-safe data. Sanitizes on the way in."""
        if layer not in self._store:
            return
        safe_data = _sanitize(data)
        payload = {
            "agent_id": agent_id,
            "timestamp": time.time(),
            "data": safe_data,
        }
        async with self._locks[layer]:
            self._store[layer][agent_id] = payload

    async def read(self, layer: int, agent_id: Optional[str] = None):
        """Read from a layer. Returns dict or None."""
        if layer not in self._store:
            return {}
        async with self._locks[layer]:
            if agent_id:
                return self._store[layer].get(agent_id)
            # Return a shallow copy so callers can't mutate the store
            return dict(self._store[layer])

    def get_status(self) -> dict:
        """Returns JSON-safe status summary."""
        return {
            str(l_id): {
                "name": self.LAYER_NAMES.get(l_id, "UNKNOWN"),
                "agents_reporting": len(self._store[l_id]),
            }
            for l_id in range(1, 7)
        }

    def get_all_health(self) -> dict:
        """Returns a flat, JSON-safe snapshot of layer 3 (component health)."""
        result = {}
        for agent_id, payload in self._store[3].items():
            result[agent_id] = payload.get("data", {})
        return result
