"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, ChangeEvent } from 'react';

export default function ForgotPassword() {
    const [userId, setUserId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [userIdError, setUserIdError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;

        if (userId.length === 0) {
            setUserIdError('UserId is required');
            valid = false;
        } else {
            setUserIdError('');
        }

        if (valid) {
            try {
                const response = await fetch('/api/auth/request-password-reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId }),
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
        }
    };


    return (

        <div className="font-rubik flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 dark:from-[#212830] dark:via-[#212830] dark:to-[#212830]" style={{ paddingTop: '2rem' }}>
            <div className='flex-row flex-wrap justify-center my-auto '>
                <div className="flex-row dark:bg-[#151b23] dark:shadow-blue-800 rounded-lg-[0.5rem] shadow-custom dark:shadow-custom bg-[#ffffff] sm:m-2" style={{ position: 'relative', padding: '4rem', width: '100%', minWidth: '20rem', marginBottom: '3rem' }}>
                    <div className="head text-lg sm:text-3xl  font-bold flex justify-between mb-8 text-gray-900 dark:text-gray-200 ">
                        Forget Password
                        <div>icon</div>
                    </div>

                    <div className="sub-head text-sm flex-col flex-wrap">
                        <div className='mb-4' style={{ maxWidth: '20rem', margin: '0 auto' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="prn" className='text-gray-900 dark:text-gray-200' style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    Enter User Id <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    className='bg-gray-200 dark:bg-gray-300 text-gray-900 mt-2'
                                    name="userId"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out' }}
                                    placeholder="Enter Your userId"
                                    required
                                />
                                <div className='flex-row text-sm'>
                                    {userIdError && <p style={{ color: '#ef4444', marginTop: '0.30rem' }}>{userIdError}</p>}
                                </div>
                            </div>

                        </div>

                        <div className='mt-8'>
                            <button
                                className='bg-blue-500'
                                type="submit"
                                onClick={handleSubmit}
                                style={{ width: '100%', padding: '0.75rem', color: '#ffffff', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }}
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                    {message && <p className='mt-2'>{message}</p>}
                </div>
            </div>
        </div>
    );
}
