import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, setDoc, writeBatch, query, where, collection, getDocs } from 'firebase/firestore';

// Define the type for user data
interface GroupMembers {
    userId: string;
    group_name: string;
}

// POST endpoint to handle adding group members
export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log(jsonData);

        // Call the batch creation function
        const groupRecords = await batchGroupsCreation(jsonData);

        console.log("Batch Group member creation successful");
        return NextResponse.json({ message: 'Group member created', group: groupRecords }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to add group members.' }, { status: 500 });
    }
}

// Function to batch process group members creation
export async function batchGroupsCreation(jsonData: GroupMembers[]) {
    const batch = writeBatch(db);

    try {
        for (const user of jsonData) {
            const { userId, group_name } = user;

            // Validate inputs
            if (!userId || !group_name) {
                throw new Error('UserID and group_name are required');
            }

            const userDoc = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userDoc);

            if (!userSnapshot.exists()) {
                // If the user does not exist in the users table, return an error
                return NextResponse.json({ success: false, message: 'User not found in the system' }, { status: 404 });
            }

            // Fetch the group ID using the group name
            const groupQuery = query(collection(db, 'groups'), where('group_name', '==', group_name));
            const groupSnapshot = await getDocs(groupQuery);

            if (groupSnapshot.empty) {
                throw new Error(`Group with name ${group_name} does not exist`);
            }

            let groupId = "";
            groupSnapshot.forEach(doc => {
                groupId = doc.id; // Assuming groupId is the document ID
            });

            // Check if user is already in the group
            const groupMembersQuery = query(
                collection(db, 'group_members'),
                where('user_id', '==', userId),
                where('group_id', '==', groupId)
            );
            const groupMembersSnapshot = await getDocs(groupMembersQuery);

            if (!groupMembersSnapshot.empty) {
                // User already exists in the group, skip adding
                console.log(`User with userId ${userId} is already in group ${group_name}`);
                return NextResponse.json({ message: `User with userId ${userId} is already in group ${group_name}` }, { status: 400 });
            }

            // Add user to the group
            const newMemberRef = doc(collection(db, 'group_members'));
            batch.set(newMemberRef, {
                group_id: groupId,
                user_id: userId,
                added_at: Timestamp.now()
            });
        }

        // Commit the batch
        await batch.commit();
        console.log("Batch group member creation successful");

        return jsonData.map(user => ({
            userId: user.userId,
            groupName: user.group_name
        }));
    } catch (error) {
        console.error('Error creating group members in batch:', error);
        throw new Error('Error creating group members in batch');
    }
}
