import asyncio
import random
from agents.base_agent import BaseAgent

class VisualAcquisitionAgent(BaseAgent):
    """
    Captures high-speed video frames at 200fps (Simulated).
    Handles auto-exposure in varying light conditions.
    """
    def __init__(self, blackboard):
        super().__init__("A1", "Visual Acquisition", blackboard)
        self.fps = 200
        self.light_level = 100.0  # Simulated lux
        
    async def run(self):
        self.set_status("RUNNING")
        while True:
            # Simulate environment changes
            self.light_level += random.uniform(-5, 5)
            self.light_level = max(0, min(1000, self.light_level))
            
            # Simulate frame metadata
            frame_data = {
                "timestamp": asyncio.get_event_loop().time(),
                "fps_actual": self.fps + random.uniform(-2, 2),
                "light_level": self.light_level,
                "exposure_setting": "AUTO" if self.light_level > 50 else "NIGHT_MODE",
                "cameras": [
                    {"id": "CAM_01", "position": "Underbody-Left", "status": "OK"},
                    {"id": "CAM_02", "position": "Underbody-Right", "status": "OK"},
                    {"id": "CAM_03", "position": "Bogie-Front", "status": "OK"}
                ],
                "frame_id": random.randint(1000, 9999)
            }
            
            # Write to Blackboard Layer 1 (Raw Sensor Data)
            await self.write_to_blackboard(1, frame_data)
            
            # Simulated delay (in reality 200fps is 5ms, but we'll slow it down for demo stability)
            await asyncio.sleep(0.1) 
