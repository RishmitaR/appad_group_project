import motor.motor_asyncio
from dotenv import load_dotenv
import os

load_dotenv()  # load .env for local dev

MONGODB_CONN_STRING = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_CONN_STRING)
db = client.hardwareManagement

# Collections
users_collection = db.users
projects_collection = db.projects
hardware_sets_collection = db.hardware_sets