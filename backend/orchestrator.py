"""
RailGuard 5000 — Orchestrator
Starts all 50 agents and keeps them running forever with auto-restart.
"""
import asyncio
import logging

logger = logging.getLogger("Orchestrator")


class Orchestrator:
    def __init__(self, blackboard):
        self.blackboard = blackboard
        self.agents = []

    def register_agent(self, agent):
        self.agents.append(agent)

    async def start_all(self):
        logger.info(f"Starting {len(self.agents)} agents...")
        for agent in self.agents:
            asyncio.create_task(self._run_forever(agent))

    async def _run_forever(self, agent):
        """Run an agent, restarting it automatically if it ever crashes."""
        agent.status = "running"
        while True:
            try:
                await agent.run(self.blackboard)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.warning(f"Agent {agent.agent_id} crashed: {e}. Restarting in 2s.")
                agent.status = "restarting"
                await asyncio.sleep(2)
                agent.status = "running"
