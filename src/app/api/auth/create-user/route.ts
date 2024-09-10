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

// for adding single user using frontend.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { userId, firstName, lastName, email, password, role, /*profile_pic, dob*/ } = await req.json();

        // const formattedDate = new Date(dob);
        // const firestoreDate = Timestamp.fromDate(formattedDate);

        const passwordHash = await bcrypt.hash(password, 10);
        console.log('passwordHash', passwordHash);
        await setDoc(doc(db, 'users', userId), {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: passwordHash,
            role: role,
            // profile_pic: profile_pic,
            // dob: firestoreDate
        });
        console.log("added");
        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
