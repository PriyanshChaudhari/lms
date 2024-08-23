"use client"

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { query, where, getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import bcrypt from 'bcryptjs'

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const resetToken = searchParams.get('token');
        console.log(resetToken);
        if (!resetToken) {
            setMessage('Invalid or missing password reset token.');
            return;
        }

        try {
            // Query users collection for document with the matching resetToken
            const q = query(collection(db, 'users'), where('resetToken', '==', resetToken));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage('Invalid or expired token.');
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const resetTokenExpires = userData.resetTokenExpires;

            if (Date.now() > resetTokenExpires) {
                setMessage('Token has expired.');
                return;
            }
            console.log(`new pass : ${newPassword}`)
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            console.log(hashedPassword)
            // Update the password in the user's document with the hashed password
            await updateDoc(userDoc.ref, { passwordHash: hashedPassword });

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
}
