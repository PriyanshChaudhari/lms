"use client"
import { useState, FormEvent } from 'react';
import { sendPasswordReset } from '@/lib/auth';

const ForgotPassword = () => {
    const [username, setUsername] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Await the result of sendPasswordReset and set the message
        const resultMessage = await sendPasswordReset(username);
        setMessage(resultMessage);
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
};

export default ForgotPassword;
