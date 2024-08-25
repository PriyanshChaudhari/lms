// import { NextApiRequest, NextApiResponse } from "next";
// import { db } from "@/lib/firebaseConfig";
// import { doc, setDoc } from 'firebase/firestore'
// import bcrypt from 'bcryptjs'

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         try {
//             const { userId, firstName, lastName, email, password, role, profile_pic, dob, } = await req.body;

//             const passwordHash = await bcrypt.hash(password, 10);
//             console.log('passwordHash', passwordHash)
//             await setDoc(doc(db, 'users', userId), {
//                 first_name: firstName,
//                 last_name: lastName,
//                 email: email,
//                 password: passwordHash,
//                 role: role,
//                 profile_pic: profile_pic,
//                 dob: dob
//             });
//             console.log("added")
//             return res.status(201).json({ message: 'User created' });
//         }
//         catch (error) {
//             return res.status(500).json({ error: 'Failed to create user' });
//         }
//     }
//     else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, setDoc, writeBatch } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

// Define the type for user data
interface UserData {
    userId: string;
    password: string;
    email?: string;
    firstName: string;
    lastName: string;
    role: string;
    profile_pic: string;
    dob: string; // Assuming dob is a string in the input JSON
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();

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
            const { userId, password, email, firstName, lastName, role, profile_pic, dob } = user;

            // Validate inputs
            if (!userId || !password) {
                throw new Error('PRN and password are required');
            }

            const formattedDate = new Date(dob);
            const firestoreDate = Timestamp.fromDate(formattedDate);

            const passwordHash = await bcrypt.hash(password, 10);

            const userRef = doc(db, "users", userId);
            batch.set(userRef, {
                first_name: firstName,
                last_name: lastName,
                email: email || `${userId}@example.com`, // Use a dummy email if not provided
                password: passwordHash,
                role: role,
                profile_pic: profile_pic,
                dob: firestoreDate
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