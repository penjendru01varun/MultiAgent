from fastapi import FastAPI
import time

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "bare_minimum_online", "time": time.time()}
