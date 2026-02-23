import asyncio
import random
from agents.base_agent import BaseAgent

class BearingWearPredictor(BaseAgent):
    """
    Detects wear in bearings using multi-modal data (Simulated).
    """
    def __init__(self, blackboard):
        super().__init__("A19", "Bearing Wear Predictor", blackboard)
        self.health_history = [100.0] * 8  # 8 bearings
        
    async def run(self):
        self.set_status("RUNNING")
        while True:
            # Read potential sensor data from Layer 1/2 (Mocking the read)
            # visual_data = await self.read_from_blackboard(1, "A1")
            
            # Simulate bearing degradation
            degradations = []
            for i in range(8):
                # Small random wear
                self.health_history[i] -= random.uniform(0.001, 0.005)
                # Ensure it doesn't go below 0
                self.health_history[i] = max(0, self.health_history[i])
                
                status = "HEALTHY"
                if self.health_history[i] < 30: status = "CRITICAL"
                elif self.health_history[i] < 70: status = "WARNING"
                
                degradations.append({
                    "bearing_id": f"BRG_{i+1}",
                    "health": round(self.health_history[i], 2),
                    "status": status,
                    "temperature": 40 + (100 - self.health_history[i]) * 0.5 + random.uniform(-1, 1)
                })
            
            # Write to Blackboard Layer 3 (Component Health)
            await self.write_to_blackboard(3, {"bearings": degradations})
            
            await asyncio.sleep(2) 
