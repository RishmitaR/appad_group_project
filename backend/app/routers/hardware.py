from fastapi import APIRouter, HTTPException, status

from app.database import projects_collection, hardware_sets_collection
from app.models import CheckinRequest, CheckoutRequest, TotalCheckoutForProject

router = APIRouter(prefix="/hardware", tags=["Hardware"])

@router.get("/")
async def list_hardware_sets():
    sets = await hardware_sets_collection.find().to_list(length=None)
    return [s["name"] for s in sets]

@router.get("/availability/{hardware_set_name}")
async def show_specific_availability(hardware_set_name: str) -> int:
    hardware_set = await hardware_sets_collection.find_one({"name": hardware_set_name})

    if not hardware_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hardware '{hardware_set_name}' does not exist",
        )
    availability = hardware_set["availability"]

    return availability

@router.get("/capacity/{hardware_set_name}")
async def show_specific_capactiy(hardware_set_name: str) -> int:
    hardware_set = await hardware_sets_collection.find_one({"name": hardware_set_name})

    if not hardware_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hardware '{hardware_set_name}' does not exist",
        )
    capacity = hardware_set["capacity"]

    return capacity


