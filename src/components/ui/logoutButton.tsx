'use client';

import axios from 'axios';
import React from 'react';

const LogoutButton: React.FC = () => {
    const handleLogout = async () => {
        try {
            const res = await axios.get('/api/auth/logout')

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
