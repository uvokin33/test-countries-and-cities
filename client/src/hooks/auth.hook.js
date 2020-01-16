import { useState, useCallback, useEffect } from "react";

const STORAGE_NAME = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [ready, setReady] = useState(false);

    const login = useCallback((jwtToken, userEmail) => {
        setToken(jwtToken);
        setEmail(userEmail);

        localStorage.setItem(STORAGE_NAME, JSON.stringify({
            token: jwtToken,
            email: userEmail,
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);

        localStorage.removeItem(STORAGE_NAME);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME));

        if (data && data.token) {
            login(data.token, data.email);
        }
        setReady(true);
    }, [login]);

    return { login, logout, token, email, ready };
}