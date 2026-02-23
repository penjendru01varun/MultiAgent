# 🚆 RAILGUARD 5000: Multi-Agent AI System

### Real-Time Railway Predictive Maintenance with 50 specialized AI agents.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## 🧠 System Architecture
- **Blackboard Architecture**: 6-layer priority shared memory for agent communication.
- **Agent Orchestrator**: Manages the lifecycle and health of all 50 agents.
- **3D Visualization**: Real-time Interactive 3D wagon monitoring using Three.js.
- **distributed Intelligence**: Agents range from sensory perception to predictive modeling and resilience.

## 🛠️ Agents Implemented
- **A1: Visual Acquisition**: High-speed frame capture simulation.
- **A3: Acoustic Emission**: Ultrasonic crack detection simulation.
- **A4: Vibration Spectrum**: FFT analysis simulation.
- **A7: GPS/Speed Sync**: Location and velocity tracking.
- **A19: Bearing Wear**: Predictive health monitoring for 8 bearings.
- **A50: Self-Healing**: System integrity and auto-recovery.

---
© 2050 RailGuard Industries | Predictive Excellence
