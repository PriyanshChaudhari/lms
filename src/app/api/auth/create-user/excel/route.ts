import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

// Define the type for user data
interface UserData {
    userId: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log(jsonData);

        const formattedJsonData = jsonData.map((user: any) => ({
            ...user,
            userId: String(user.userId),
        }));

        const userRecords = await batchUsersCreation(formattedJsonData);

        console.log("Batch user creation successful");
        return NextResponse.json({ message: 'Users created', users: userRecords }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create users' }, { status: 500 });
    }
}

async function batchUsersCreation(jsonData: UserData[]) {
    const batch = writeBatch(db);

    try {
        for (const user of jsonData) {
            console.log(user)
            const { userId, email, first_name, last_name, role } = user;

            // Validate inputs
            if (!userId) {
                throw new Error('User ID is required');
            }

            const formatUser = {
                ...user, // Spread the existing user properties
                first_name: capitalizeName(user.first_name), // Capitalize first_name
                last_name: capitalizeName(user.last_name),   // Capitalize last_name
                role: capitalizeName(user.role),             // Capitalize role
            };
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            const password = createPassword(userId, formatUser.first_name);
            console.log(password + userId + " : userId")

            const passwordHash = await bcrypt.hash(password, 10);

            const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
            const defaultProfilePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-profile-pic.png?alt=media`;

            if (userSnap.exists()) {
                console.log(`User with userId ${userId} already exists. Updating data...`);

                batch.update(userRef, {
                    first_name: formatUser.first_name,
                    last_name: formatUser.last_name,
                    email: formatUser.email,
                    password: passwordHash,
                    role: formatUser.role,
                    profilePicUrl: defaultProfilePicUrl
                });
            } else {
                // Create a new user if they do not exist
                console.log(`Creating a new user with userId ${userId}...`);

                batch.set(userRef, {
                    first_name: formatUser.first_name,
                    last_name: formatUser.last_name,
                    email: formatUser.email,
                    password: passwordHash,
                    role: formatUser.role,
                    profilePicUrl: defaultProfilePicUrl
                });
            }
        }

        await batch.commit();
        console.log("Batch user creation/update successful");

        // Return success with user information
        return jsonData.map(user => ({
            userId: Number(user.userId), // Return userId as a number
            email: user.email
        }));

    } catch (error) {
        console.error('Error creating/updating users in batch:', error);
        throw new Error('Error creating/updating users in batch');
    }
}


const createPassword = (userId: string, firstName: string): string => {
    const userIdPart = userId.slice(-5);
    const firstNamePart = firstName.slice(0, 3);
    let password = `${userIdPart}${firstNamePart}`;

    return password;
};

const capitalizeName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};