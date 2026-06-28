import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const useCloudTests = () => {
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchTestResults = async () => {
        setLoading(true);
        try {
            const results = await apiClient.get('/tests/results');
            setTestResults(results.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const runTests = async () => {
        await fetchTestResults();
    };

    useEffect(() => {
        fetchTestResults();
    }, []);

    return { runTests, testResults, loading, error };
};

export default useCloudTests;