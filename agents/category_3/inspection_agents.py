import asyncio
import random
from agents.base_agent import BaseAgent

class WheelFlatDetector(BaseAgent):
    def __init__(self, blackboard): super().__init__("A20", "Wheel Flat Detector", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"wheel_flats": random.random() < 0.01})
            await asyncio.sleep(2)

class AxleCrackTracker(BaseAgent):
    def __init__(self, blackboard): super().__init__("A21", "Axle Crack Tracker", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"micro_cracks": []})
            await asyncio.sleep(5)

class BrakeThicknessEstimator(BaseAgent):
    def __init__(self, blackboard): super().__init__("A22", "Brake Pad Estimator", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"pad_thickness": 12.4})
            await asyncio.sleep(10)

class SuspensionMonitor(BaseAgent):
    def __init__(self, blackboard): super().__init__("A23", "Suspension Monitor", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"damping_ratio": 0.7})
            await asyncio.sleep(5)

class CouplerIntegrityAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A24", "Coupler Integrity", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"stress": "NOMINAL"})
            await asyncio.sleep(10)

class RailWheelContactAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A25", "Rail-Wheel Contact", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"conicity": 0.1})
            await asyncio.sleep(2)

class LubricationDetector(BaseAgent):
    def __init__(self, blackboard): super().__init__("A26", "Lubrication Deficiency", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"status": "ADEQUATE"})
            await asyncio.sleep(10)

class FastenerLoosenessAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A27", "Fastener Looseness", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"loose_bolts": []})
            await asyncio.sleep(60)

class CorrosionSeverityAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A28", "Corrosion Severity", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"rust_index": 0.05})
            await asyncio.sleep(3600)

class FatigueLifeEstimator(BaseAgent):
    def __init__(self, blackboard): super().__init__("A29", "Fatigue Life Estimator", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"cycles_remaining": 1500000})
            await asyncio.sleep(30)

class GeometricDistortionAgent(BaseAgent):
    def __init__(self, blackboard): super().__init__("A30", "Geometric Distortion", blackboard)
    async def run(self):
        self.set_status("RUNNING")
        while True:
            await self.write_to_blackboard(3, {"warping": None})
            await asyncio.sleep(60)
