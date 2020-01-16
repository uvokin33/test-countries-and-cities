import { 
    useState, 
    useCallback,
    useContext,
} from 'react';
import { AuthContext } from '../context/AuthContext';

export const useHttp = () => {
    const { logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-type'] = 'application/json';
            }

            const response = await fetch(url, { method, body, headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            if (e.message === 'Unauthenticated' || e.status === 401) {
                logout();
            }
            throw e;
        }
    }, [logout]);

    const clearErorr = useCallback(() => setError(null), []);

    return { loading, request, error, clearErorr };
};