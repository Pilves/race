import React, { useState, useEffect } from 'react';
import { auth } from '../utils/auth.jsx';
import {LoginScreen} from '../components/LoginScreen/LoginScreen.jsx'

const API_URL = 'http://localhost:8080';

export default function AuthGuard({ keyType, children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const verifyAuth = async () => {
        const storedKey = auth.getStoredKey(keyType);
        if (!storedKey) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/verify-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: storedKey, keyType }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok && data.status === 'success') {
                setIsAuthenticated(true);
            } else {
                auth.logout(keyType);
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error('Auth verification error:', err);
            auth.logout(keyType);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        verifyAuth();
    }, [keyType]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <LoginScreen
                keyType={keyType}
                onAuthenticated={() => setIsAuthenticated(true)}
            />
        );
    }


    return <>{children}</>;
}
