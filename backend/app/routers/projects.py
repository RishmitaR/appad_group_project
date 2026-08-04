from fastapi import APIRouter, HTTPException, status

from app.database import projects_collection, hardware_sets_collection
from app.models import ProjectCreate, ProjectsDashboard, JoinProject, CheckoutRequest, CheckinRequest

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
        "hardware_sets": {}
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

@router.post("/checkout/{project_id}")
async def checkout_hardware(checkout: CheckoutRequest):
    hardware_set = await hardware_sets_collection.find_one({"name": checkout.hwset})

    if not hardware_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hardware '{checkout.hwset}' does not exist",
        )

    availability = hardware_set["quantity"]

    if checkout.quantity > availability:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity ({checkout.quantity}) exceeds available stock ({availability})"
        )

    project = await projects_collection.find_one({"project_id": checkout.project_id})

    await projects_collection.update_one(
            {"_id": project["_id"]},
            {"$inc": {f"hardware_sets.{checkout.hwset}": checkout.quantity}},
        )

    await hardware_sets_collection.update_one(
        {"_id": hardware_set["_id"]},
        {"$inc": {"quantity": -checkout.quantity}}
    )

    return {
        "message": "Checkout is successful",
        "project_id": project["project_id"],
        "checkout_amount": checkout.quantity,
    }

@router.post("/checkin/{project_id}")
async def checkin_hardware(checkin: CheckinRequest):
    hardware_set = await hardware_sets_collection.find_one({"name": checkin.hwset})

    if not hardware_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hardware '{checkin.hwset}' does not exist",
        )

    project = await projects_collection.find_one({"project_id": checkin.project_id})
    print(repr(checkin.hwset), type(checkin.hwset))
    project_availability =  project.get("hardware_sets", {}).get(checkin.hwset)

    if project_availability is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{checkin.hwset}' not found in project hardware set"
        )


    if checkin.quantity > project_availability:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity of ({checkin.quantity}) exceeds current amount of stock checked out ({project_availability})"
        )

    await projects_collection.update_one(
            {"_id": project["_id"]},
            {"$inc": {f"hardware_sets.{checkin.hwset}": -checkin.quantity}},
        )

    await hardware_sets_collection.update_one(
        {"_id": hardware_set["_id"]},
        {"$inc": {"quantity": checkin.quantity}}
    )
    
    return {
        "message": "Checkin is successful",
        "project_id": project["project_id"],
        "checkin_amount": checkin.quantity,
    }

@router.get("/project-dashboard/{project_id}")
async def show_project_details(project_id: int):
    project = await projects_collection.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' does not exist",
        )
    
    name = project["project_name"]
    description = project["project_desc"]
    members =  project["members"]
    hardware_sets = project["hardware_sets"]

    return {
        "project_id": project_id,
        "project_name": name,
        "project_desc": description,
        "members": members,
        "hardware_sets": hardware_sets
    }

