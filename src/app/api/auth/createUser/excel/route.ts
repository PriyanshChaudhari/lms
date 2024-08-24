// app/api/auth/createUser/route.ts

import { NextResponse } from 'next/server';
import { createUsersWithPRNBatch } from '@/lib/createUser'; // Update the import path based on your project structure

export async function POST(request: Request) {
    try {
        // Parse the request body
        const jsonData = await request.json();


        // Call the createUser function from lib/createUser.ts
        const userRecord = await createUsersWithPRNBatch(jsonData);

        // Return the created user record as a response
        return NextResponse.json({ user: userRecord }, { status: 201 });
    } catch (error) {
        console.error('Error during user creation:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
