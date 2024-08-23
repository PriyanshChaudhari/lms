"use client";
import { useState } from 'react';

export default function ForgotPassword() {
    const [username, setUsername] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prn: username }),
            });

            // Check if the response is OK and handle accordingly
            if (!response.ok) {
                const errorText = await response.text(); // Use text() to handle cases where JSON might be missing
                const errorMessage = errorText || 'An error occurred';
                setMessage(errorMessage);
                return;
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error handling submit:', error);
            setMessage('An error occurred while processing your request.');
        }
    };


    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
