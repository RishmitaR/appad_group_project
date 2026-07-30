from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, status, HTTPException
from fastapi.responses import FileResponse


app = FastAPI()

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("frontend/dist/index.html")