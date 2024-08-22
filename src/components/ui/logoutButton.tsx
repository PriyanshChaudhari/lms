// src/app/components/LogoutButton.tsx

'use client'; // This ensures the component is rendered on the client side

import React from 'react';

const LogoutButton: React.FC = () => {
    const handleLogout = () => {
        // Perform logout action, like clearing local storage or making an API call
        localStorage.removeItem('authToken');
        console.log('Logged out');
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
