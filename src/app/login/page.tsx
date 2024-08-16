"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState, ChangeEvent } from 'react'



const LoginPage = () => {
    const [user, setUser] = React.useState({
        username: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    }
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    }

    return (

        <div className="font-rubik flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 dark:from-slate-900 dark:via-slate-500 dark:to-slate-900" style={{ paddingTop: '2rem', marginTop: '4rem' }}>

                <div className='flex-row flex-wrap justify-center my-auto '>
                    <div className="flex-row dark:bg-neutral-900 dark:shadow-blue-800 rounded-[0.5rem] shadow-custom dark:shadow-custom bg-[#ffffff] sm:m-2" style={{ position: 'relative', padding: '4rem', width: '100%', minWidth: '20rem', marginBottom: '3rem' }}>
                        <div className="head text-xl sm:text-4xl  font-bold flex justify-center mb-8 text-gray-900 dark:text-gray-200">
                            Login your Account
                        </div>

                        <div className="sub-head text-sm flex-col flex-wrap">
                            <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label htmlFor="fname" className='text-gray-900 dark:text-gray-200' style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500',  marginBottom: '0.5rem' }}>
                                        Enter Username <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fname"
                                        className='bg-gray-200 dark:bg-gray-300 text-gray-900'
                                        name="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out' }}
                                        placeholder="Enter Your Username"
                                        required
                                    />
                                </div>


                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label htmlFor="lname" className='text-gray-900 dark:text-gray-200' style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
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

                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <Link href='/forgot-password' className='text-red-600 text-right font-medium'>forgot password?</Link>
                                
                                </div>


                            </div>

                           

                            <div className='mt-2 mx-3'>
                                <button
                                  className='bg-blue-500'
                                    type="submit"
                                   onClick={handleSubmit}   
                                    style={{ width: '100%', padding: '0.75rem', color: '#ffffff', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }}
                                >
                                    Submit
                                </button>
                            </div>

                        </div>
                    </div>


                </div>
            </div>

    )
}

export default LoginPage
