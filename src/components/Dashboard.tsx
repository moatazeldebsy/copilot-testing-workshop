import React from 'react';

const Dashboard: React.FC = () => {
    // Sample data for testing results
    const testResults = [
        { id: 1, name: 'Test A', status: 'Passed', duration: '2s' },
        { id: 2, name: 'Test B', status: 'Failed', duration: '3s' },
        { id: 3, name: 'Test C', status: 'Passed', duration: '1s' },
    ];

    return (
        <div className="dashboard">
            <h1>Testing Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Test Name</th>
                        <th>Status</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {testResults.map((result) => (
                        <tr key={result.id}>
                            <td>{result.name}</td>
                            <td>{result.status}</td>
                            <td>{result.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;