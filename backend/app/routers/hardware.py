from fastapi import APIRouter, HTTPException, status

from app.database import projects_collection, hardware_sets_collection
from app.models import CheckinRequest, CheckoutRequest, TotalCheckoutForProject

router = APIRouter(prefix="/projectdetails", tags=["projectdetails"])

@router.get("/{projectid}")
async def show_availability(hardware_set_name: str) -> int:
    hardware_set = await hardware_sets_collection.find_one({"name": hardware_set_name})

    if not hardware_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hardware '{hardware_set_name.name}' does not exist",
        )
    availability = hardware_set["quantity"]

    return availability


