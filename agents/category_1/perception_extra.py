import asyncio
import random
from agents.base_agent import BaseAgent

class ThermalImagingAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A2", "Thermal Imaging", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(1, {"thermal_map": [[random.randint(20, 80) for _ in range(5)] for _ in range(5)]})
            await asyncio.sleep(2)

class LoadDistributionAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A5", "Load Distribution", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(1, {"axle_loads": [20.5, 20.2, 21.0, 20.8]})
            await asyncio.sleep(1)

class EnvironmentalAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A6", "Environmental Context", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(1, {"temp": 22, "humidity": 45, "precip": 0.0})
            await asyncio.sleep(5)

class PowerManagerAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A8", "Power Management", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(6, {"battery": 98.2, "usage": "LOW"})
            await asyncio.sleep(10)

class DataIntegrityAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A9", "Data Integrity", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(1, {"checksum": "VALID", "quality": 0.99})
            await asyncio.sleep(3)

class MultiSpectralFusionAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A10", "Multi-Spectral Fusion", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(2, {"fused_signature": "SYNCED"})
            await asyncio.sleep(2)
