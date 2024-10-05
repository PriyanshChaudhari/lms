import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, where, query, getDocs, doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;

        // Step 1: Fetch members for the group from 'group_members'
        const groupMembersRef = collection(db, 'group_members');
        const groupMembersQuery = query(groupMembersRef, where('group_id', '==', groupId));
        const groupMembersSnapshot = await getDocs(groupMembersQuery);

        // Collect user IDs from group_members
        const userIds: string[] = [];
        groupMembersSnapshot.forEach((doc) => {
            const data = doc.data();
            userIds.push(data.user_id);  // Collect user_id from group_members
        });

        if (userIds.length === 0) {
            return NextResponse.json({ success: true, users: [] });
        }

        // Step 2: Fetch detailed user info from 'users' using userIds
        const usersRef = collection(db, 'users');
        const userDetails = [];

        for (const userId of userIds) {
            const userDocRef = doc(usersRef, userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                userDetails.push({
                    userId: userDoc.id,
                    ...userDoc.data(),
                });
            }
        }

        return NextResponse.json({ success: true, users: userDetails });
    } catch (error) {
        console.error('Error fetching group members and user details:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch group members' }, { status: 500 });
    }
}
