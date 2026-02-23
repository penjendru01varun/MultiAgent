import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    """
    Abstract Base Class for all 50 RailGuard agents.
    Provides common functionality for blackboard interaction and lifecycle management.
    """
    def __init__(self, agent_id: str, name: str, blackboard: Any):
        self.agent_id = agent_id
        self.name = name
        self.blackboard = blackboard
        self.status = "INITIALIZING"
        self.logger = logging.getLogger(f"Agent_{agent_id}")
        logging.basicConfig(level=logging.INFO)

    @abstractmethod
    async def run(self):
        """Main execution loop for the agent, to be implemented by subclasses."""
        pass

    async def write_to_blackboard(self, layer: int, data: Dict[str, Any], priority: int = 1):
        """Helper to write data to the shared blackboard."""
        await self.blackboard.write(layer, self.agent_id, data, priority)

    async def read_from_blackboard(self, layer: int, agent_id: str = None):
        """Helper to read data from the shared blackboard."""
        return await self.blackboard.read(layer, agent_id)

    def set_status(self, status: str):
        self.status = status
        self.logger.info(f"Status changed to: {status}")

    async def stop(self):
        self.set_status("STOPPING")
        # Cleanup logic here
        self.set_status("STOPPED")
