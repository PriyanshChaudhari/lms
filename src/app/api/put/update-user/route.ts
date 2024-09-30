import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

export async function PUT(req: NextRequest) {
    try {
        const { userId, firstName, lastName, email, role, profile_pic, dob } = await req.json();
        console.log(userId);
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updateData: any = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: role,
        };

        if (profile_pic) {
            updateData.profile_pic = profile_pic;
        }

        if (dob) {
            const formattedDate = new Date(dob);
            updateData.dob = Timestamp.fromDate(formattedDate);
        }


        await updateDoc(userRef, updateData);

        console.log("User updated");
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}