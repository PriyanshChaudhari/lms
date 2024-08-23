"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const oobCode = searchParams.get('oobCode'); // Get the oobCode from the URL

        if (!oobCode) {
            setMessage('Invalid or missing password reset code.');
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setMessage('Password has been reset successfully. You can now log in with your new password.');
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('An error occurred while resetting your password. Please try again.');
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPassword">New Password:</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
