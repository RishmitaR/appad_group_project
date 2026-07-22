from fastapi import FastAPI

USER_AUTHENTICATED = False

app = FastAPI()


# function to authenticate user

# function to create a new project

# function to get all projects

# function to join a project by project id

# function to get all items in the project by using project id

# function to add a new item to the project by using project id

# function to update an item in the project by using project id and item id




@app.get("/")
async def root():
    return {"message": "Hello World"}
