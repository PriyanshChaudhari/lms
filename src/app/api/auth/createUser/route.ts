// app/api/auth/createUser/route.ts

import { NextResponse } from 'next/server';
import { createUserWithPRN } from '@/lib/createUser'; // Update the import path based on your project structure

export async function POST(request: Request) {
    try {
        // Parse the request body
        const { userId, password, email } = await request.json();

        // Validate inputs
        if (!userId || !password) {
            return NextResponse.json({ message: 'PRN and password are required' }, { status: 400 });
        }

        // Call the createUser function from lib/createUser.ts
        const userRecord = await createUserWithPRN(userId, password, email);

        // Return the created user record as a response
        return NextResponse.json({ user: userRecord }, { status: 201 });
    } catch (error) {
        console.error('Error during user creation:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
