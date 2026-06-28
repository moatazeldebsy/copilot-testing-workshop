import React from 'react';
import useCloudTests from '../hooks/useCloudTests';

const TestRunner: React.FC = () => {
    const { runTests, testResults, loading, error } = useCloudTests();

    const handleRunTests = () => {
        runTests();
    };

    return (
        <div>
            <h1>Test Runner</h1>
            <button onClick={handleRunTests} disabled={loading}>
                {loading ? 'Running Tests...' : 'Run Tests'}
            </button>
            {error && <p>Error: {error}</p>}
            {testResults && (
                <div>
                    <h2>Test Results</h2>
                    <pre>{JSON.stringify(testResults, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default TestRunner;