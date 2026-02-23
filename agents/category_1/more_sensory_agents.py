import asyncio
import random
import math
from agents.base_agent import BaseAgent

class AcousticEmissionAgent(BaseAgent):
    """
    Analyzes ultrasonic frequencies for early-stage crack formation (Simulated).
    """
    def __init__(self, blackboard):
        super().__init__("A3", "Acoustic Emission", blackboard)
        
    async def run(self):
        self.set_status("RUNNING")
        while True:
            # Simulate acoustic events
            events = []
            if random.random() > 0.95:  # Rare event
                events.append({
                    "frequency": random.uniform(20, 100), # kHz
                    "amplitude": random.uniform(40, 80), # dB
                    "type": "MICRO_CRACK_POSSIBLE",
                    "location": "AXLE_CENTER"
                })
            
            await self.write_to_blackboard(1, {"acoustic_events": events})
            await asyncio.sleep(1)

class VibrationSpectrumAgent(BaseAgent):
    """
    FFT analysis of accelerometer data for frequency-domain anomalies (Simulated).
    """
    def __init__(self, blackboard):
        super().__init__("A4", "Vibration Spectrum", blackboard)
        
    async def run(self):
        self.set_status("RUNNING")
        while True:
            # Simulate vibration peaks
            peaks = [
                {"freq": 12.5, "amp": random.uniform(0.1, 0.5), "desc": "WHEEL_ROTATION"},
                {"freq": 450.2, "amp": random.uniform(0.01, 0.05), "desc": "BEARING_BPFO"}
            ]
            
            await self.write_to_blackboard(1, {"vibration_peaks": peaks})
            await asyncio.sleep(0.5)

class GPSSpeedSyncAgent(BaseAgent):
    """
    Aligns sensor data with precise location and velocity metrics (Simulated).
    """
    def __init__(self, blackboard):
        super().__init__("A7", "GPS/Speed Sync", blackboard)
        self.speed = 120.0
        self.lat = 59.9139
        self.lon = 10.7522
        
    async def run(self):
        self.set_status("RUNNING")
        while True:
            # Simulate movement
            self.speed += random.uniform(-1, 1)
            self.lat += 0.0001
            self.lon += 0.0001
            
            await self.write_to_blackboard(1, {
                "speed": round(self.speed, 2),
                "location": {"lat": self.lat, "lon": self.lon},
                "track_id": "SECTION_B_42"
            })
            await asyncio.sleep(1)
