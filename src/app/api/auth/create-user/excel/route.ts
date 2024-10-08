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

// export async function batchUsersCreation(jsonData: UserData[]) {
//     const batch = writeBatch(db);

//     try {
//         for (const user of jsonData) {
//             const { userId, password, email, firstName, lastName, role, /*profile_pic, dob*/ } = user;

//             // Validate inputs
//             if (!userId || !password) {
//                 throw new Error('PRN and password are required');
//             }

//             const userRef = doc(db, String("users"), String(userId));
//             const userSnap = await getDoc(userRef);

//             if (userSnap.exists()) {
//                 throw new Error(`User with userId ${userId} already exists`);
//             }

//             const passwordHash = await bcrypt.hash(password, 10);

//             batch.set(userRef, {
//                 first_name: firstName,
//                 last_name: lastName,
//                 email: email,
//                 password_hash: passwordHash,
//                 role: role,
//             });
//         }

//         await batch.commit();
//         console.log("Batch user creation successful");
//         return jsonData.map(user => ({ userId: user.userId, email: user.email || `${user.userId}@example.com` }));
//     } catch (error) {
//         console.error('Error creating users in batch:', error);
//         throw new Error('Error creating users in batch');
//     }
// }


//checking is remain
export async function batchUsersCreation(jsonData: UserData[]) {
    const batch = writeBatch(db);

    try {
        for (const user of jsonData) {
            const { userId, password, email, firstName, lastName, role } = user;

            // Validate inputs
            if (!userId || !password) {
                throw new Error('User ID and password are required');
            }

            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            // Hash the password (always hash the password, regardless of whether the user is new or existing)
            const passwordHash = await bcrypt.hash(password, 10);

            if (userSnap.exists()) {
                // Update the existing user if they already exist
                console.log(`User with userId ${userId} already exists. Updating data...`);

                batch.update(userRef, {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password_hash: passwordHash,
                    role: role,
                });
            } else {
                // Create a new user if they do not exist
                console.log(`Creating a new user with userId ${userId}...`);

                batch.set(userRef, {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password_hash: passwordHash,
                    role: role,
                });
            }
        }

        await batch.commit();
        console.log("Batch user creation/update successful");

        // Return success with user information
        return jsonData.map(user => ({
            userId: user.userId,
            email: user.email || `${user.userId}@example.com`
        }));

    } catch (error) {
        console.error('Error creating/updating users in batch:', error);
        throw new Error('Error creating/updating users in batch');
    }
}
