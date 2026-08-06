from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.projects import router as projects_router
from app.routers.users import router as users_router
from app.routers.hardware import router as hardware_router

app = FastAPI(title="Hardware Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://appad-assignment-frontend-9e814d800605.herokuapp.com/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(hardware_router,prefix="/api")



@app.get("/")
async def root() -> dict:
    return {"message": "Hardware Management API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
