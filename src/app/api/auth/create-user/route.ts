import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { userId, firstName, lastName, email, password, role, } = await req.json();

        if (!userId || !firstName || !lastName || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            // If the user already exists, return an error response
            return NextResponse.json({ error: 'User with this ID already exists' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        console.log('passwordHash', passwordHash);

        await setDoc(doc(db, 'users', userId), {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password_hash: passwordHash,
            role: role,
        });
        console.log("added");
        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
