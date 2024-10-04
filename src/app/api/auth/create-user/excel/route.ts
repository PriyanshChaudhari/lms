import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

// Define the type for user data
interface UserData {
    userId: string;
    password: string;
    email?: string;
    firstName: string;
    lastName: string;
    role: string;
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log(jsonData);
        
        // Call the batch creation function
        const userRecords = await batchUsersCreation(jsonData);

        console.log("Batch user creation successful");
        return NextResponse.json({ message: 'Users created', users: userRecords }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create users' }, { status: 500 });
    }
}

export async function batchUsersCreation(jsonData: UserData[]) {
    const batch = writeBatch(db);

    try {
        for (const user of jsonData) {
            const { userId, password, email, firstName, lastName, role, /*profile_pic, dob*/ } = user;

            // Validate inputs
            if (!userId || !password) {
                throw new Error('PRN and password are required');
            }

            const userRef = doc(db, String(process.env.USERS_DB), String(userId));
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                throw new Error(`User with userId ${userId} already exists`);
            }

            const passwordHash = await bcrypt.hash(password, 10);

            batch.set(userRef, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password_hash: passwordHash,
                role: role,
            });
        }

        await batch.commit();
        console.log("Batch user creation successful");
        return jsonData.map(user => ({ userId: user.userId, email: user.email || `${user.userId}@example.com` }));
    } catch (error) {
        console.error('Error creating users in batch:', error);
        throw new Error('Error creating users in batch');
    }
}