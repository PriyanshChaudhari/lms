'use client';

import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation'

const LogoutButton: React.FC = () => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            // const res = await axios.get('/api/auth/login')
            router.replace('/login')
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <button className='bg-red-500 hover:bg-red-600 p-3 rounded-xl text-white text-sm' onClick={handleLogout}>
            Login
        </button>
    );
};

export default LogoutButton;
