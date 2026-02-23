---
description: How to run the RailGuard 5000 System
---

1. Start the Backend API
// turbo
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

2. Start the Frontend Dashboard
// turbo
```bash
cd frontend
npm install
npm run dev
```

3. Open the Dashboard
Open [http://localhost:5173](http://localhost:5173) in your browser.
