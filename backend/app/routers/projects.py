from fastapi import APIRouter, HTTPException, status

from app.database import projects_collection
from app.models import ProjectCreate, ProjectsDashboard, JoinProject

router = APIRouter(prefix="/project", tags=["project"])


@router.get("/")
async def list_projects(userid: str | None = None) -> list[dict]:
    projects = []
    query = {}
    if userid:
        query = {"members": {"$in": [userid]}}

    async for project in projects_collection.find(query):
        project["_id"] = str(project["_id"])
        projects.append(project)
    return projects


@router.post("/create")
async def create_project(project: ProjectCreate):
    existing = await projects_collection.find_one({"project_id": project.project_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project '{project.project_id}' already exists",
        )

    new_project = {
        "project_id": project.project_id,
        "project_name": project.name,
        "project_desc": project.description,
        "members": [project.userid],
    }
    insert_result = await projects_collection.insert_one(new_project)

    return {
        "message": "Project created successfully",
        "project": {
            "project_id": new_project["project_id"],
            "project_name": new_project["project_name"],
            "project_desc": new_project["project_desc"],
        },
        "inserted_id": str(insert_result.inserted_id),
    }


@router.post("/join")
async def join_project(project: JoinProject):
    existing = await projects_collection.find_one({"project_id": project.project_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project.project_id}' not found",
        )

    if project.userid not in existing.get("members", []):
        await projects_collection.update_one(
            {"_id": existing["_id"]},
            {"$addToSet": {"members": project.userid}},
        )

    return {
        "message": "Joined project successfully",
        "project_id": existing["project_id"],
        "project_name": existing["project_name"],
        "project_desc": existing["project_desc"],
    }
