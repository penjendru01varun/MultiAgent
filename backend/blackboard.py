import asyncio
import time
from typing import Dict, List, Any, Callable, Optional
from datetime import datetime

class Blackboard:
    """
    Shared memory space with 6 priority layers for agent communication.
    Implements Publisher-Subscriber and Request-Reply patterns.
    """
    def __init__(self):
        self.layers = {
            1: {'name': 'RAW_SENSOR', 'data': {}, 'subscribers': []},
            2: {'name': 'ENHANCED_DATA', 'data': {}, 'subscribers': []},
            3: {'name': 'COMPONENT_HEALTH', 'data': {}, 'subscribers': []},
            4: {'name': 'PREDICTIONS', 'data': {}, 'subscribers': []},
            5: {'name': 'DECISIONS', 'data': {}, 'subscribers': []},
            6: {'name': 'NETWORK_STATE', 'data': {}, 'subscribers': []}
        }
        self.locks = {i: asyncio.Lock() for i in range(1, 7)}
        self.history = []
    
    async def write(self, layer: int, agent_id: str, data: dict, priority: int = 1):
        """Write data with timestamp, versioning, and TTL"""
        if layer not in self.layers:
            raise ValueError(f"Invalid layer: {layer}")
            
        async with self.locks[layer]:
            payload = {
                'agent_id': agent_id,
                'timestamp': datetime.utcnow().isoformat(),
                'data': data,
                'priority': priority,
                'version': len(self.layers[layer]['data'].get(agent_id, [])) + 1
            }
            
            # Update current state
            if agent_id not in self.layers[layer]['data']:
                self.layers[layer]['data'][agent_id] = []
            
            self.layers[layer]['data'][agent_id].append(payload)
            
            # Keep only last 10 versions per agent to prevent memory bloat
            if len(self.layers[layer]['data'][agent_id]) > 10:
                self.layers[layer]['data'][agent_id].pop(0)

            # Notify subscribers
            for callback in self.layers[layer]['subscribers']:
                asyncio.create_task(callback(layer, payload))

    async def read(self, layer: int, agent_id: Optional[str] = None, filter_func: Callable = None):
        """Read data from a specific layer, optionally filtered by agent_id or a custom function"""
        if layer not in self.layers:
            raise ValueError(f"Invalid layer: {layer}")
            
        async with self.locks[layer]:
            data = self.layers[layer]['data']
            if agent_id:
                return data.get(agent_id, [])[-1] if agent_id in data else None
            
            latest_data = {aid: versions[-1] for aid, versions in data.items()}
            if filter_func:
                return {aid: val for aid, val in latest_data.items() if filter_func(aid, val)}
            return latest_data

    async def subscribe(self, layer: int, callback: Callable):
        """Subscribe to updates on a specific layer"""
        if layer not in self.layers:
            raise ValueError(f"Invalid layer: {layer}")
        self.layers[layer]['subscribers'].append(callback)

    def get_status(self):
        """Returns the current status of all layers for UI monitoring"""
        return {
            l_id: {
                'name': info['name'],
                'agent_count': len(info['data']),
                'subscriber_count': len(info['subscribers'])
            }
            for l_id, info in self.layers.items()
        }
