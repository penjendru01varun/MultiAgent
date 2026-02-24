import asyncio
import logging
from abc import ABC, abstractmethod

logging.basicConfig(level=logging.INFO)

class BaseAgent(ABC):
    """
    Abstract Base Class for all 50 RailGuard agents.
    """
    def __init__(self, agent_id: str, name: str):
        self.agent_id = agent_id
        self.name = name
        self.status = "idle"
        self.logger = logging.getLogger(f"Agent_{agent_id}")

    @abstractmethod
    async def run(self):
        """Main execution loop for the agent"""
        pass

    def set_status(self, status: str):
        self.status = status
        self.logger.info(f"Agent {self.agent_id}: {status}")

    async def stop(self):
        self.set_status("STOPPING")
        self.set_status("STOPPED")
