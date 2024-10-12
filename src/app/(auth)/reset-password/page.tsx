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
            await updateDoc(userDoc.ref, { password: hashedPassword });

            setMessage('Password has been reset successfully. You can now log in with your new password.');

        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('An error occurred while resetting your password. Please try again.');
        }
    };

    return (
        <div className="font-rubik flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 dark:from-slate-900 dark:via-slate-500 dark:to-slate-900" style={{ paddingTop: '2rem' }}>
            <div className='flex-row flex-wrap justify-center my-auto '>
                <div className="flex-row dark:bg-[#151b23] dark:shadow-blue-800 rounded-[0.5rem] shadow-custom dark:shadow-custom bg-[#ffffff] sm:m-2" style={{ position: 'relative', padding: '4rem', width: '100%', minWidth: '20rem', marginBottom: '3rem' }}>
                    <div className="head text-lg sm:text-3xl  font-bold flex justify-between mb-8 text-gray-900 dark:text-gray-200 ">
                        Reset Password
                        <div>icon</div>
                    </div>

                    <div className="sub-head text-sm flex-col flex-wrap">
                        <div style={{ maxWidth: '20rem', margin: '0 auto' }}>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label htmlFor="password" className='text-gray-900 dark:text-gray-200' style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    New Password  <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className='bg-gray-200 dark:bg-gray-300 text-gray-900 mt-2'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out' }}
                                    placeholder="Enter Password"
                                    required
                                />
                            </div>

                        </div>

                        <div className='mt-8 '>
                            <button
                                className='bg-blue-500'
                                type="submit"
                                onClick={handleSubmit}
                                style={{ width: '100%', padding: '0.75rem', color: '#ffffff', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }}
                            >
                                Confirm Password
                            </button>
                        </div>
                    </div>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
}