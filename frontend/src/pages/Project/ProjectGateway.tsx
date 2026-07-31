import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import React from 'react';

type CreateProjectFormFields = {
    projectId: number;
    name: string;
    description: string;
};

type EnterProjectFormField = {
    projectId: number;
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

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
    } = useForm<CreateProjectFormFields>();

    const onSubmitCreate: SubmitHandler<CreateProjectFormFields> = async (data) => {
        setMessage('');
        setErrorMessage('');

        try {
            const response = await fetch('/api/project/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id: data.projectId,
                    name: data.name,
                    description: data.description,
                    userid: currentUser,
                }),
            });

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

    const {
        register: registerEnter,
        handleSubmit: handleSubmitEnter,
        reset: resetEnter,
    } = useForm<EnterProjectFormField>();

    const onSubmitEnter: SubmitHandler<EnterProjectFormField> = async (data) => {
        setMessage('');
        setErrorMessage('');

        try {
            const response = await fetch('/api/project/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id: data.projectId,
                    userid: currentUser,
                }),
            });

            const responseData = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(responseData.detail || 'Unable to join project');
            }

            setMessage(responseData.message || 'Joined project successfully');
            resetEnter();
            await loadProjects();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to join project');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

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
                        <input {...registerCreate('projectId')} type="number" placeholder="Project ID" />
                        <input {...registerCreate('name')} type="text" placeholder="Project Name" />
                        <input {...registerCreate('description')} type="text" placeholder="Project Description" />
                        <button type="submit">Create Project</button>
                    </form>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>

                <div className="right-panel">
                    <h1>Enter Existing Project</h1>
                    <form className="stacked-form" onSubmit={handleSubmitEnter(onSubmitEnter)}>
                        <input {...registerEnter('projectId')} type="number" placeholder="Project ID" />
                        <button type="submit">Join Project</button>
                    </form>
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

