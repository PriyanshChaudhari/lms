"use client";
import Link from 'next/link';
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter()
    const [user, setUser] = React.useState({
        userId: "",
        password: ""
    });

    const [userIdError, setUserIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;

        if (user.userId.length === 0) {
            setUserIdError('UserId required');
            valid = false;
        } else {
            setUserIdError('');
        }

        if (user.password.length === 0) {
            setPasswordError('Password required');
            valid = false;
        } else {
            setPasswordError('');
        }


        if (valid) {
            try {
                const res = await axios.post('/api/auth/signIn', user);
                const data = res.data;
                console.log('Response data:', data);  // Debugging line

                if (data.success) {
                    const { role, userId } = data;
                    console.log("ROLE in LOGIN:" + role)

                    sessionStorage.setItem('userId', userId);

                    if (role === 'student') {
                        router.push(`/student/${user.userId}/dashboard`);
                    } else if (role === 'teacher') {
                        router.push(`/teacher/${user.userId}/dashboard`);
                    } else if (role === 'admin') {
                        router.push(`/admin/dashboard`);
                    } else {
                        console.error('Unknown role:', role);
                        alert('An unexpected error occurred');
                    }
                } else {
                    console.error('Login failed:', data.message);
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error during sign-in:', error);
                alert('An unexpected error occurred');
            }
        }
    };


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="font-rubik flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 dark:from-slate-900 dark:via-slate-500 dark:to-slate-900" style={{ paddingTop: '2rem' }}>
            <div className='flex-row flex-wrap justify-center my-auto '>
                <div className="flex-row dark:bg-neutral-900 dark:shadow-blue-800 rounded-[0.5rem] shadow-custom dark:shadow-custom bg-[#ffffff] sm:m-2" style={{ position: 'relative', padding: '4rem', width: '100%', minWidth: '20rem', marginBottom: '3rem' }}>
                    <div className="head text-xl sm:text-4xl  font-bold flex justify-between mb-8 text-gray-900 dark:text-gray-200 ">
                        Log in
                        <div>icon</div>
                    </div>

                    <div className="sub-head text-sm flex-col flex-wrap">
                        <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <label htmlFor="prn" className='text-gray-900 dark:text-gray-200' style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    User ID <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    className='bg-gray-200 dark:bg-gray-300 text-gray-900'
                                    name="userId"
                                    value={user.userId}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out' }}
                                    placeholder="Enter Your User Id"
                                    required
                                />
                                <div className='flex-row text-xs'>
                                    {userIdError && <p style={{ color: '#ef4444', marginTop: '0.25rem' }}>{userIdError}</p>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label htmlFor="password" className='text-gray-900 dark:text-gray-200' style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    Password  <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className='bg-gray-200 dark:bg-gray-300 text-gray-900'
                                    value={user.password}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out' }}
                                    placeholder="Enter Password"
                                    required
                                />
                                <div className='flex-row text-xs'>
                                    {passwordError && <p style={{ color: '#ef4444', marginTop: '0.25rem' }}>{passwordError}</p>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <Link href='/forgot-password' className='text-red-600 text-right font-medium'>forgot password?</Link>
                            </div>
                        </div>

                        <div className='mt-2 '>
                            <button
                                className='bg-blue-500 text-white w-full font-medium text-sm  hover:bg-blue-600 transition-colors duration-200 ease-in-out'
                                type="submit"
                                onClick={handleSubmit}
                                // style={{ width: '100%', padding: '0.75rem', color: '#ffffff', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }}
                                style={{ padding: '0.75rem', cursor: 'pointer',borderRadius: '0.375rem' }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;