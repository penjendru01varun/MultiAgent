import asyncio
import logging
from typing import List
from agents.base_agent import BaseAgent
from backend.blackboard import Blackboard

class Orchestrator:
    """
    Manages the lifecycle of all 50 agents.
    Handles startup, shutdown, and health monitoring.
    """
    def __init__(self, blackboard: Blackboard):
        self.blackboard = blackboard
        self.agents: List[BaseAgent] = []
        self.tasks = []
        self.logger = logging.getLogger("Orchestrator")

    def register_agent(self, agent: BaseAgent):
        self.agents.append(agent)
        self.logger.info(f"Registered agent: {agent.name} ({agent.agent_id})")

    async def start_all(self):
        self.logger.info("Starting all agents...")
        for agent in self.agents:
            task = asyncio.create_task(agent.run())
            self.tasks.append(task)
        
        # Self-healing monitor (Agent A50 concept)
        asyncio.create_task(self.monitor_health())

    async def monitor_health(self):
        while True:
            # Check for failed tasks/agents
            for i, task in enumerate(self.tasks):
                if task.done():
                    try:
                        task.result()
                    except Exception as e:
                        agent = self.agents[i]
                        self.logger.error(f"Agent {agent.agent_id} failed: {e}. Restarting...")
                        self.tasks[i] = asyncio.create_task(agent.run())
            
            await asyncio.sleep(5)

    async def stop_all(self):
        self.logger.info("Stopping all agents...")
        for task in self.tasks:
            task.cancel()
        await asyncio.gather(*self.tasks, return_exceptions=True)
