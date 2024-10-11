import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        // Destructure the user data from the request
        const { userId, firstName, lastName, email, role } = await req.json();

        // Validate input fields
        if (!userId || !firstName || !lastName || !email || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if the user already exists in the database
        const userRef = doc(db, 'users', String(userId));  // Convert userId to string if it's a number
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            return NextResponse.json({ error: 'User with this ID already exists' }, { status: 400 });
        }

        // Generate the password using userId and firstName
        const password = createPassword(String(userId), capitalizeName(firstName));
        console.log(`Generated password: ${password} for userId: ${userId}`);

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Set the default profile picture URL
        const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        const defaultProfilePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-profile-pic.png?alt=media`;

        // Save the user to the database
        await setDoc(userRef, {
            first_name: capitalizeName(firstName),
            last_name: capitalizeName(lastName),
            email: email,
            password: passwordHash,
            role: capitalizeName(role),
            profilePicUrl: defaultProfilePicUrl, // Store the default profile pic URL
        });

        return NextResponse.json({ message: 'User created' }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// Capitalizes the first letter of a name and makes the rest lowercase
const capitalizeName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Creates a password by combining the last 5 digits of userId and the first 3 letters of the firstName
const createPassword = (userId: string, firstName: string): string => {
    const userIdPart = userId.slice(-5);
    const firstNamePart = firstName.slice(0, 3);
    let password = `${userIdPart}${firstNamePart}`;

    return password;
};