# backend/app/models.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    userid: str
    password: str

class UserLogin(BaseModel):
    userid: str
    password: str

class ProjectCreate(BaseModel):
    name: str
    description: str
    project_id: int
    userid: str

class ProjectsDashboard(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    project_id: int
    members: List[str]
    checkouts: dict = {}   # {"HWSet1": 0, "HWSet2": 0}

class JoinProject(BaseModel):
    project_id: int
    userid: str

class CheckoutRequest(BaseModel):
    hwset: str            # "HWSet1" or "HWSet2"
    quantity: int = Field(gt=0)

class CheckinRequest(BaseModel):
    hwset: str            # "HWSet1" or "HWSet2"
    quantity: int = Field(gt=0)

class TotalCheckoutForProject(BaseModel):
    project_id: str
    total_checkouts: dict = {}   # {"HWSet1": 0, "HWSet2": 0}
