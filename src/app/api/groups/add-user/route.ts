import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const { groupId, userId } = await req.json();
        console.log(groupId, userId);

        if (!groupId || !userId) {
            return NextResponse.json({ success: false, message: 'Both groupId and userId are required' }, { status: 400 });
        }

        // Check if the user document exists
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            // If the user does not exist in the users table, return an error
            return NextResponse.json({ success: false, message: 'User not found in the system' }, { status: 404 });
        }

        // Add user to the group_members table
        await addDoc(collection(db, 'group_members'), {
            group_id: groupId,
            user_id: userId,
            added_at: new Date(),
        });

        return NextResponse.json({ success: true, message: 'User added to group successfully' });
    } catch (error) {
        console.error('Error adding user to group:', error);
        return NextResponse.json({ success: false, message: 'Failed to add user to group' }, { status: 500 });
    }
}
