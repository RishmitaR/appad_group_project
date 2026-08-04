import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router-dom"

type CreateProjectFormFields = {
    projectId: Number;
    name: string;
    description: string;
};

type EnterProjectFormField = {
    projectId: Number;
};

type ProjectItem = {
    project_id: number;
    project_name: string;
    project_desc: string;
};

type ProjectItem = {
    project_id: number;
    project_name: string;
    project_desc: string;
};

function ProjectManagementPage(): React.ReactElement {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const currentUser = localStorage.getItem('currentUser') || '';

    const loadProjects = async () => {
        try {
            const response = await fetch(`/api/project/?userid=${encodeURIComponent(currentUser)}`);
            if (!response.ok) {
                throw new Error('Unable to load projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load projects');
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    // Get the UserId
    const { userId } = useParams<{ userId: string }>();
    const userIdStr = userId ? String(userId) : undefined;

    // Load users projects
    const loadProjects = async () => {
        try {
            const projectRes = await fetch(`/api/project/?userid=${userIdStr}`);
            if(!projectRes.ok){
                throw new Error("Unable to load projects")
            }
            const data = await projectRes.json()
            setProjects(data)
        } catch(error){
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load projects');
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);


    // Create Project Form
    const {
        register: registerCreate,
        reset: resetCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
    } = useForm<CreateProjectFormFields>();

    const onSubmitCreate: SubmitHandler<CreateProjectFormFields> = async (data) =>{
        setMessage(""); 
        setErrorMessage("");
        try {
            const projectCreationRes = await fetch("/api/project/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    project_id: data.projectId,
                    userid: userIdStr 
                }),
            });

            const responseData = await projectCreationRes.json();

            if (!projectCreationRes.ok) {
                if(projectCreationRes.status == 409){
                    setErrorMessage(
                        responseData.detail || "A project with this ID already exists."
                    );
                } else{
                    setErrorMessage(
                        responseData?.detail ||
                        responseData?.message ||
                        "Failed to create project. Please try again"
                    );
                }
                return;
            }

            // success: reset form
            setMessage(responseData.message || 'Project created successfully');
            resetCreate();
            await loadProjects();

        } catch(error){
             console.error("Create Project request failed:", error);
             setErrorMessage("Network error — please check your connection and try again.");
        } 

    };

            const responseData = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(responseData.detail || 'Unable to create project');
            }

            setMessage(responseData.message || 'Project created successfully');
            resetCreate();
            await loadProjects();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to create project');
        }
    };


    // Enter Project Form
    const {
        register: registerEnter,
        handleSubmit: handleSubmitEnter,
        reset: resetEnter,
    } = useForm<EnterProjectFormField>();

    const onSubmitEnter: SubmitHandler<EnterProjectFormField> = async (data) =>{
        setErrorMessage("");
        console.log(data.projectId)
        try {
            const projectEnterRes = await fetch("/api/project/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_id: data.projectId,
                    userid: userIdStr
                }),
            });

            const responseData = await projectEnterRes.json();

            if(!projectEnterRes.ok){
                if (projectEnterRes.status == 409){
                    setErrorMessage(
                        responseData.detail || "A project with this ID does not exist"
                    );
                } else {
                    setErrorMessage(
                        responseData?.detail ||
                        responseData?.message ||
                        "Failed to enter project. Please try again"
                    )
                }
                return; 
            }

            // sucess: navigate
            navigate(`/projectdetails/${userIdStr}/${data.projectId}`);

        } catch(error){
            console.error("Enter project request failed", error);
            setErrorMessage("Network error — please check your connection and try again.");
        } 
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <section className="container">
                <div className="left-panel">
                    <h1>Create Project</h1>
                    <form className="stacked-form" onSubmit={handleSubmitCreate(onSubmitCreate)}>
                        <input {...registerCreate("projectId",{valueAsNumber: true})} type="number" placeholder="Project ID"/> 
                        <input {...registerCreate("name")} type="text" placeholder="Project Name"/>
                        <input {...registerCreate("description")} type="text" placeholder="Project Description"/> 
                        <button type="submit">Create Project</button>
                    </form>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>

                <div className="right-panel">
                    <h1>Enter Existing Project</h1>
                    <form className="stacked-form" onSubmit={handleSubmitEnter(onSubmitEnter)}>
                        <input {...registerEnter("projectId", {valueAsNumber: true})} type="number" placeholder="Project ID"></input>
                        <button type="submit">Enter Project</button>
                    </form>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
            </section>

            <section className="project-display" style={{marginTop: '24px'}}>
                <h2>{userIdStr}'s Projects</h2>
                <div style={{display: 'grid', gap: '12px'}}>
                    {projects.length === 0 ? (
                        <p>No projects yet.</p>
                    ) : (
                        projects.map((project) => (
                            <div 
                                key={project.project_id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '12px'
                                }}
                            >
                                <strong>{project.project_name}</strong>
                                <div>Project ID: {project.project_id}</div>
                                <div>Description: {project.project_desc}</div>
                            </div>
                        ))
                    )}
                </div>

            </section>

            <section className="container" style={{ marginTop: '24px' }}>
                <h2>Visible Projects</h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                    {projects.length === 0 ? (
                        <p>No projects yet.</p>
                    ) : (
                        projects.map((project) => (
                            <div
                                key={project.project_id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '12px',
                                }}
                            >
                                <strong>{project.project_name}</strong>
                                <div>Project ID: {project.project_id}</div>
                                <div>Description: {project.project_desc}</div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );
}

export default ProjectManagementPage;

