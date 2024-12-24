import React, { useState } from 'react';

const API_URL = 'http://localhost:8080';

//toDo: tõstsin hetkel LoginScreen'i eraldi komponendiks. vist hea praktika ?

export function LoginScreen({ keyType, onAuthenticated }) {
    const [accessKey, setAccessKey] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/verify-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: accessKey.trim(),
                    keyType: keyType
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                handleErrorResponse(data);
                return;
            }

            const data = await response.json();
            if (data.status === 'success') {

                const authData = {
                    key: accessKey,
                    timestamp: Date.now(),
                    expiresIn: 3 * 60
                };
                localStorage.setItem(keyType, JSON.stringify(authData));
                //toDo: change to localStorage because localStorage persists even after a page refresh,
                // making it more suitable for access key storage.
                onAuthenticated();
            }
        } catch (err) {
            console.error('LoginScreen error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleErrorResponse = (data) => {
        switch (data.code) {
            case 'ACCOUNT_LOCKED':
                setError(
                    <div>
                        <p>{data.message}</p>
                        <p className="text-sm mt-1">
                            Time remaining: {Math.ceil(data.details.remainingSeconds / 60)} minutes
                        </p>
                    </div>
                );
                break;

            case 'RATE_LIMIT':
                setError(data.message);
                setTimeout(() => setError(''), data.details.retryAfter);
                break;

            case 'INVALID_KEY':
                setError(
                    <div>
                        <p>{data.message}</p>
                        {data.details.attemptsRemaining > 0 && (
                            <p className="text-sm mt-1">
                                Attempts remaining: {data.details.attemptsRemaining}
                            </p>
                        )}
                    </div>
                );
                break;

            default:
                setError(data.message || 'An unexpected error occurred');
        }
    };

    const getInterfaceName = () => {
        switch (keyType) {
            case 'RECEPTIONIST': return 'Front Desk';
            case 'SAFETY': return 'Race Control';
            case 'OBSERVER': return 'Lap-line Tracker';
            default: return 'Interface';
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">{getInterfaceName()} Login</h2>
                <p className="login-subtitle">Please enter your access key to continue</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        id="accessKey"
                        type="password"
                        value={accessKey}
                        onChange={(e) => {
                            setAccessKey(e.target.value);
                            if (error) setError('');
                        }}
                        className={`input-field ${error ? 'error-input' : ''}`}
                        placeholder="Enter access key"
                        required
                        autoComplete="current-password"
                        disabled={isLoading}
                    />

                    {error && (
                        <div className="error-alert" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !accessKey.trim()}
                        className="submit-button"
                    >
                        {isLoading ? 'Verifying...' : 'LoginScreen'}
                    </button>
                </form>
            </div>
        </div>
    );
}