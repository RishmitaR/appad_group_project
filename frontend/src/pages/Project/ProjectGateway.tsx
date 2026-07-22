import {useForm, type SubmitHandler} from 'react-hook-form'; 
import React from 'react';

type CreateProjectFormFields = {
    projectId: number;
    name: string;
    description: string; 
};

type EnterProjectFormField = {
    projectId: number;
}


function ProjectManagementPage(): React.ReactElement {

    
    // Create Project Form
    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
    } = useForm<CreateProjectFormFields>(); 

    const onSubmitCreate: SubmitHandler<CreateProjectFormFields> = (data) =>{
        console.log(data)
    };


    // Enter Project Form
    const {
        register: registerEnter,
        handleSubmit: handleSubmitEnter,
    } = useForm<EnterProjectFormField>();

    const onSubmitEnter: SubmitHandler<EnterProjectFormField> = (data) =>{
        console.log(data)
    };

    return(
        <>
            <section className="container">
                <div className="left-panel">
                    <h1>Create Project</h1>
                    <form className="stacked-form" onSubmit={handleSubmitCreate(onSubmitCreate)}>
                        <input {...registerCreate("projectId")} type="number" placeholder="Project ID"/> 
                        <input {...registerCreate("name")} type="text" placeholder="Project Name"/>
                        <input {...registerCreate("description")} type="text" placeholder="Project Description"/> 
                        <button type="submit">Create Project</button>
                    </form>
                </div>
                <div className="right-panel">
                    <h1>Enter Existing Project</h1>
                    <form className="stacked-form" onSubmit={handleSubmitEnter(onSubmitEnter)}>
                        <input {...registerEnter("projectId")} type="number" placeholder="Project ID"></input>
                        <button type="submit">Enter Project</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default ProjectManagementPage;

