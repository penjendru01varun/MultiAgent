import asyncio
from agents.base_agent import BaseAgent

class SelfHealingMonitor(BaseAgent):
    """
    Restarts failed agents, maintains system integrity, and ensures continuous operation (Simulated).
    """
    def __init__(self, blackboard, orchestrator):
        super().__init__("A50", "Self-Healing Monitor", blackboard)
        self.orchestrator = orchestrator
        
    async def run(self):
        self.set_status("RUNNING")
        while True:
            # Check for failed agents (simulated check)
            healthy_count = 0
            for agent in self.orchestrator.agents:
                if agent.status == "RUNNING":
                    healthy_count += 1
            
            integrity_score = (healthy_count / len(self.orchestrator.agents)) * 100 if self.orchestrator.agents else 100
            
            await self.write_to_blackboard(6, {
                "system_integrity": round(integrity_score, 2),
                "healthy_agents": healthy_count,
                "total_agents": len(self.orchestrator.agents),
                "last_incident": "None",
                "recovery_status": "IDLE"
            })
            
            await asyncio.sleep(5)
