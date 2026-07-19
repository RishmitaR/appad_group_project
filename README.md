# HAAS (Hardware Management Software)

A full stack web app that uses **FastAPI** for backend and **ReactJS** for frontend.

This readme file will guide you through the setup of the project.

## Please check if you have these installed in your system before starting

| Tool | Check if installed | Download link |
|------|--------------------|----------------|
| Python (3.9+) | `python3 --version` | https://www.python.org/downloads/ |
| Node.js (18+) | `node --version` | https://nodejs.org/ |
| npm (comes with Node.js) | `npm --version` | — |
| Git (optional, for cloning) | `git --version` | https://git-scm.com/downloads |

Run the code in "Check if installed column to see if you have everything you need.

## Project structure
 
```
project-root/
├── backend/          # FastAPI app
│   ├── main.py
│   └── requirements.txt
├── frontend/          # React app
│   ├── package.json
│   └── src/
└── README.md
```

## 1. Clone the repository

If you are a part of this project you are already added as a collaborator. Hence, you can start by cloning the repository(You do not need to fork it.)

### Step 1 - Open terminal and past the following command

```bash
git clone https://github.com/RishmitaR/appad_group_project.git
```

## 2. Backend setup (FastAPI)

### Step 1 - Open terminal and past the following command

```bash
cd backend
```

### Step 2 - Create a virtual environment(venv)

A **vitrual environment** is an isolated space for the project's python packages, so that they do not clash with anything else that is already present on your computer. It is recommended to use virtual environments even in workspaces. It essentially prevents conflicting package versions between projects to keep your global python installation clean. It also makes it easy to share the exact project requirements with others.

```bash
python3 -m venv venv
```

This creates a folder called `venv` inside `backend/`. You only need to do this **once** per project.

You need to do this **every time** you open a new terminal to work on the backend.
 
**On Mac / Linux:**
```bash
source venv/bin/activate
```
 
**On Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```
 
**On Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

If it worked, you'll see `(venv)` appear at the start of your terminal line. That means Python is now using the isolated environment instead of your system-wide Python.

> If PowerShell gives a "running scripts is disabled" error, run this once:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
 
To **deactivate** later (leave the virtual environment), just type:
```bash
deactivate
```

### Step 4 — Install backend dependencies
 
Usually, in the workplace every python project has a file called `requirements.txt` which tells you which packages you need to install. Here is a small analogy to understand what packages are:
- Line of code: A single, tiny lego brick
- A Function: A few bricks snapped together to make a small thing, like a Lego wheel.
- A Module: A single instruction booklet to build one toy, like a Lego car.
- A Package: The giant Lego Box you buy at the store. It holds the car booklet, the castle booklet, and all the specific bricks you need for both in one place.

With `(venv)` active, install the required packages:
 
```bash
pip install -r requirements.txt
```

'pip' is the standard python package installer - think of it as a person who buys the Lego Box for you from a toy store.

Usually pip is not upgraded to it's latest version. You can upgrade it to the latest version by refering the [notice] line after you run the above command or

```bash
python.exe -m pip install --upgrade pip
```

In the future if you do install any packages, use the below command to update the requirements.txt file:

```bash
pip freeze > requirements.txt
```

### Step 5 — Run the backend server
 
```bash
uvicorn main:app --reload
```
 
- `main` = the Python file name (`main.py`)
- `app` = the FastAPI instance inside that file (e.g. `app = FastAPI()`)
- `--reload` = automatically restarts the server when you save code changes (great for development)


Your backend should now be running at:
👉 **http://127.0.0.1:8000**
 
FastAPI also gives you free interactive API docs at:
👉 **http://127.0.0.1:8000/docs**
 
---

## 3. Frontend Setup (ReactJS)
 
### Step 1 — Open a **new** terminal tab/window and go to the frontend folder
 
Keep the backend terminal running, and open a separate one for the frontend.
 
```bash
cd frontend
```
 
### Step 2 — Install frontend dependencies
 
```bash
npm install
```
 
This reads `package.json` and downloads all the packages the React app needs into a `node_modules` folder.
 
### Step 3 — Run the frontend
 
```bash
npm run dev
```
 
Your frontend should now be running at something like:
👉 **http://localhost:5173**
 
---

## Common issues
 
| Problem | Likely fix |
|---|---|
| `command not found: python3` | Try `python` instead of `python3` |
| `(venv)` not showing after activation | Make sure you're inside the `backend` folder and used the right command for your OS |
| Backend runs but frontend can't reach it | Check the CORS setup above, and confirm the backend terminal is still running |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, then run `npm install` again |
| Port already in use | Another process is using that port — stop it, or run on a different port (e.g. `uvicorn main:app --reload --port 8001`) |
 
---
 
## Daily workflow (once everything is set up)
 
1. Open terminal 1 → `cd backend` → `source venv/bin/activate` (or Windows equivalent) → `uvicorn main:app --reload`
2. Open terminal 2 → `cd frontend` → `npm run dev`
3. Open your browser to the frontend URL and start coding!
---
