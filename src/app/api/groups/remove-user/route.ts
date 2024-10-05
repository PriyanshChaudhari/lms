import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, where, query, getDocs, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const { groupId, userId } = await req.json();
        if (!groupId || !userId) {
            return NextResponse.json({ success: false, message: 'Both group_id and user_id are required' }, { status: 400 });
        }

        // Find the document in group_members with matching group_id and user_id
        const groupMembersRef = collection(db, 'group_members');
        const q = query(groupMembersRef, where('group_id', '==', groupId), where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);

        // Delete the matched document
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        return NextResponse.json({ success: true, message: 'User removed from group successfully' });
    } catch (error) {
        console.error('Error removing user from group:', error);
        return NextResponse.json({ success: false, message: 'Failed to remove user from group' }, { status: 500 });
    }
}
