//add the button from components/common/Button.tsx to the ProjectDetail.tsx file
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/hardware/HardwareTable';

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate();
    const [requestQuantities, setRequestQuantities] = useState<Record<string, number>>({
        'Hardware 1': 0,
        'Hardware 2': 0,
    });

    const handleQuantityChange = (hardwareName: string, value: number) => {
        setRequestQuantities((prev) => ({
            ...prev,
            [hardwareName]: value,
        }));
        console.log(`Request quantity for ${hardwareName} changed to ${value}`);
    };

    const handleBackClick = () => {
        navigate('/projectmanagement');
    };

    const handleLogoutClick = () => {
        navigate('/');
    }

    const handleCellChange = (rowIndex: number, column: string, value: string | number) => {
        if (column !== 'Request/Return Capacity') {
            return;
        }

        const hardwareName = rowIndex === 0 ? 'Hardware 1' : 'Hardware 2';
        handleQuantityChange(hardwareName, Number(value));
    };

    const handleButtonClick = () => {
        console.log('Button clicked!');
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <Button onClick={handleBackClick} style={{ margin: '10px' }}>Back</Button>
                <h1 style={{ margin: 50 }}>Project Detail</h1>
                <Button onClick={handleLogoutClick} style={{ margin: '10px' }}>Logout</Button>
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <DynamicTable
                        data={[
                            {
                                Name: 'Hardware 1',
                                Available: '100',
                                Capacity: '20',
                                "Request/Return Capacity": requestQuantities['Hardware 1'],
                            },
                            {
                                Name: 'Hardware 2',
                                Available: '50',
                                Capacity: '30',
                                "Request/Return Capacity": requestQuantities['Hardware 2'],
                            },
                        ]}
                        editableColumns={['Request/Return Capacity']}
                        onCellChange={handleCellChange}
                    />
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                        <Button onClick={handleButtonClick} style={{ margin: '10px' }}>
                            Request
                        </Button>
                        <Button onClick={handleButtonClick} style={{ margin: '10px' }}>
                            Return
                        </Button>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <DynamicTable
                        data={[
                            { Name: 'Hardware 1', TotalCheckedoutForProject: '20' },
                            { Name: 'Hardware 2', TotalCheckedoutForProject: '30' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;