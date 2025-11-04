import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseFetchOptions<T> {
    initialData?: T;
    immediate?: boolean;
}

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFetch<T>(
    fetchFn: () => Promise<T>,
    options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
    const { initialData = null, immediate = true } = options;
    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            const axiosError = err as AxiosError<any>;
            setError(axiosError.response?.data?.message || 'An error occurred');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate, fetchData]);

    return { data, loading, error, refetch: fetchData };
}
