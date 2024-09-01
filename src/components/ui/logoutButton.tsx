'use client';

import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation'

const LogoutButton: React.FC = () => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const res = await axios.get('/api/auth/logout')
            router.replace('/login')
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <button className='bg-red-500 hover:bg-red-600 p-3 rounded-2xl' onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
