//add the button from components/common/Button.tsx to the ProjectDetail.tsx file
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/hardware/HardwareTable';

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate();
    const [requestQuantities, setRequestQuantities] = useState<Record<string, number>>({
        'HWS1': 0,
        'HWS2': 0,
    });

    // Get the UserId
    const { userId } = useParams<{ userId: string }>();
    const userIdStr = userId ? String(userId) : undefined;

    // Get the ProjectId
    const { projectId } = useParams<{ projectId: string }>();
    console.log("projectId from URL:", JSON.stringify(projectId));
    const projectIdNum = projectId ? Number(projectId) : undefined;

    const [projectName, setProjectName] = useState<string>("");
    const [projectDesc, setProjectDesc] = useState<string>("");
    const [hardwareSets, setHardwareSets] = useState<Record<string,number>>({})

    const [allHardwareSetNames, setAllHardwareSetNames] = useState<string[]>([]);
    const [hardwareAvailability, setHardwareAvailability] = useState<Record<string, number>>({});
    const [hardwareCapacity, setHardwareCapacity] = useState<Record<string, number>>({});

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleQuantityChange = (hardwareName: string, value: number) => {
        setRequestQuantities((prev) => ({
            ...prev,
            [hardwareName]: value,
        }));
        console.log(`Request quantity for ${hardwareName} changed to ${value}`);
    };

    const handleBackClick = () => {
        navigate(`/projectmanagement/${userIdStr}`);
    };

    const handleLogoutClick = () => {
        navigate('/');
    }

    const handleCellChange = (rowIndex: number, column: string, value: string | number) => {
        if (column !== 'Request/Return Amount') {
            return;
        }

        const hardwareName = rowIndex === 0 ? 'HWS1' : 'HWS2';
        handleQuantityChange(hardwareName, Number(value));
    };


    // Get the project details
    const loadProjectDetails = async () => {
        try {
            const projectRes = await fetch(`/api/project/project-dashboard/${projectIdNum}`);
            if(!projectRes.ok){
                throw new Error("Unable to load project details")
            }
            const data = await projectRes.json()
            const projName = data["project_name"]
            const projDesc = data["project_desc"]
            const projHardware = data["hardware_sets"]

            setProjectName(projName)
            setProjectDesc(projDesc)
            setHardwareSets(projHardware)

        } catch(error){
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load project details');
            setMessage("");
        }
    };

    useEffect(() => {
        loadProjectDetails();
    }, [projectIdNum]);


    const loadAllHardwareSets = async () => {
        try {
            const res = await fetch(`/api/hardware/`);
            if (!res.ok) throw new Error("Unable to load hardware sets");
            const names: string[] = await res.json();
            setAllHardwareSetNames(names);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load hardware sets');
            setMessage("");
        }
    };

    const loadHardwareAvailability = async () => {
        try {

            const results = await Promise.all(
                allHardwareSetNames.map(async (hwsetId) => {
                    const res = await fetch(`/api/hardware/availability/${hwsetId}`);
                    if (!res.ok) {
                        throw new Error(`Unable to load availability for ${hwsetId}`)
                    }
                    const availability = await res.json();
                    return [hwsetId, availability] as [string,number]
                })
            );

            setHardwareAvailability(Object.fromEntries(results))
        }catch(error){
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load hardware availability')
            setMessage("");

        }
    }

    
    const loadHardwareCapacity = async () => {
        try {

            const results = await Promise.all(
                allHardwareSetNames.map(async (hwsetId) => {
                    const res = await fetch(`/api/hardware/capacity/${hwsetId}`);
                    if (!res.ok) {
                        throw new Error(`Unable to load capacity for ${hwsetId}`)
                    }
                    const capacity = await res.json();
                    return [hwsetId, capacity] as [string,number]
                })
            );

            setHardwareCapacity(Object.fromEntries(results))
        }catch(error){
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load hardware capacity')
            setMessage("");

        }
    }


    useEffect(() => {
        loadAllHardwareSets();
    }, []);

    useEffect(() => {
        if (allHardwareSetNames.length > 0) {
            loadHardwareAvailability();
        }
    }, [allHardwareSetNames]);

    useEffect(() => {
        if (allHardwareSetNames.length > 0) {
            loadHardwareCapacity();
        }
    }, [allHardwareSetNames]);

    const handleCheckOut = async () => {
        setErrorMessage("");
        try{
            const itemsToCheckOut = Object.entries(requestQuantities).filter(
                ([,qty]) => qty > 0
            ); 

            if(itemsToCheckOut.length === 0){
                setErrorMessage("Enter a quantity before checking out")
                setMessage("");
                return;
            }

            for (const [hwSetId,quantity] of itemsToCheckOut){
                const checkoutRes = await fetch(`/api/project/checkout/${projectIdNum}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hwset: hwSetId,
                        quantity: quantity,
                        project_id: projectIdNum,
                    }),
                });

            

                if (!checkoutRes.ok) {
                    const err = await checkoutRes.json().catch(() => null);
                
                    if (checkoutRes.status === 404) {
                        setErrorMessage(err?.detail || `Hardware set '${hwSetId}' does not exist.`);
                        setMessage("");
                    } else if (checkoutRes.status === 400) {
                        setErrorMessage(err?.detail || `Requested quantity for '${hwSetId}' exceeds available stock.`);
                        setMessage("");
                    }else{
                        setErrorMessage(err?.detail || `Failed to check out ${hwSetId}.`);
                        setMessage("");
                    }
                    return;
                }
            }
            setMessage("Hardware Sucessfully Requested")
            setErrorMessage("");
            await loadProjectDetails();
            await loadHardwareAvailability(); 
            setRequestQuantities(
                Object.fromEntries(allHardwareSetNames.map((name) => [name,0]))
            );
        }catch(error){
            setErrorMessage(error instanceof Error ? error.message : 'Unable to check out hardware');
            setMessage("");
        }
    }


    const handleCheckIn = async () => {
        setErrorMessage("");
        try{
            const itemsToCheckIn = Object.entries(requestQuantities).filter(
                ([,qty]) => qty > 0
            ); 

            if(itemsToCheckIn.length === 0){
                setErrorMessage("Enter a quantity before checking in")
                setMessage("");
                return;
            }

            for (const [hwSetId,quantity] of itemsToCheckIn){
                const checkinRes = await fetch(`/api/project/checkin/${projectIdNum}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hwset: hwSetId,
                        quantity: quantity,
                        project_id: projectIdNum,
                    }),
                });

            

                if (!checkinRes.ok) {
                    const err = await checkinRes.json().catch(() => null);
                
                    if (checkinRes.status === 404) {
                        setErrorMessage(err?.detail || `Hardware set '${hwSetId}' does not exist`);
                        setMessage("");
                    } else if (checkinRes.status === 400) {
                        setErrorMessage(err?.detail || `Requested check in quantity for '${hwSetId}' exceeds amount checked in.`);
                        setMessage("");
                    }else{
                        setErrorMessage(err?.detail || `Failed to check in ${hwSetId}.`);
                        setMessage("");
                    }
                    return;
                }
            }
            setMessage("Hardware Sucessfully Returned")
            setErrorMessage("");
            await loadProjectDetails();
            await loadHardwareAvailability(); 
            setRequestQuantities(
                Object.fromEntries(allHardwareSetNames.map((name) => [name,0]))
            );
        }catch(error){
            setErrorMessage(error instanceof Error ? error.message : 'Unable to check in hardware');
            setMessage("");
        }
    }



    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <Button onClick={handleBackClick} style={{ margin: '10px' }}>Back</Button>
                <div className="projects-section">
                    {projectName && <h1 style={{ marginBottom: 4 }}>{projectName}</h1>}
                    {projectDesc && <h2 style={{ marginTop: 0 }}>{projectDesc}</h2>}
                </div>
                <Button onClick={handleLogoutClick} style={{ margin: '10px' }}>Logout</Button>
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    { hardwareAvailability &&
                    <DynamicTable
                        data={allHardwareSetNames.map((name) => ({
                            Name: name,
                            Available: hardwareAvailability[name],
                            Capacity: hardwareCapacity[name],
                            "Request/Return Amount": requestQuantities[name]
                        }))}
                        editableColumns={["Request/Return Amount"]}
                        onCellChange={handleCellChange}
                    />}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                        <Button onClick={handleCheckOut} style={{ margin: '10px' }}>
                            Request
                        </Button>
                        <Button onClick={handleCheckIn} style={{ margin: '10px' }}>
                            Return
                        </Button>
                    </div>
                    {message && !errorMessage && <p style={{ color: 'green' }}>{message}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
                <div style={{ flex: 1 }}>
                    {hardwareSets &&    
                    <DynamicTable
                        data={Object.entries(hardwareSets).map(([name,quantity]) => ({
                            Name: name,
                            TotalCheckedOut: quantity
                        }))}
                        emptyMessage="Checked out hardware will show here"
                    />}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;