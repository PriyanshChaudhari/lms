import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        console.log("start: ", req.body)
        const { userId } = params;
        const { first_name, last_name, email, role, } = await req.json();
        console.log("userId: ", userId);
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updateData = {
            email: email,
            first_name: first_name,
            last_name: last_name,
            role: role,
        };
        console.log("updated data: ",updateData)

        await updateDoc(userRef, updateData);

        console.log("User updated");
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}