//add the button from components/common/Button.tsx to the ProjectDetail.tsx file
import React from 'react';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/hardware/HardwareTable';

const ProjectDetail: React.FC = () => {
    const handleButtonClick = () => {
        console.log('Button clicked!');
    };
    return (
        <div>
            <h1>Project Detail</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <DynamicTable data={[
                        { Name: 'Hardware 1', Available: '100', Capacity: '20' },
                        { Name: 'Hardware 2', Available: '50', Capacity: '30' },
                    ]} />
                </div>
                <div style={{ flex: 1 }}>
                    <DynamicTable data={[
                        { Name: 'Hardware 1', TotalCheckedoutForProject: '20' },
                        { Name: 'Hardware 2', TotalCheckedoutForProject: '30' },
                    ]} />
                </div>
            </div>
            <div style={{ marginTop: '20px' }}></div>
            <Button onClick={handleButtonClick}>
                Request
            </Button>
            <Button onClick={handleButtonClick}>
                Return
            </Button>
        </div>
    );
};

export default ProjectDetail;