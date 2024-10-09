import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, writeBatch, query, where, collection, getDocs } from 'firebase/firestore';

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

        console.log("batch start")
        // Call the batch creation function
        const groupRecords = await batchGroupsCreation(jsonData.members);
        console.log("batch end")

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
            console.log("validationfuncs start")
            // Check if user exists
            const userExists = await checkIfUserExists(userId);
            console.log("checkIfUserExists returned")
            if (!userExists) {
                // return NextResponse.json({ success: false, message: `User with userId ${userId} not found in the system` }, { status: 404 });
                console.log(`User with userId ${userId} not found in the system`)
                continue;
            }

            // Get the group ID using the group name
            const groupId = await getGroupIdFromGroupName(group_name);
            console.log("getGIDFromGName returned")
            if (!groupId) {
                throw new Error(`Group with name ${group_name} does not exist`);
            }

            // Check if user is already in the group
            const userInGroup = await checkIfUserInGroup(userId, groupId);
            if (userInGroup) {
                console.log(`User with userId ${userId} is already in group ${group_name}`);
                continue;
            }

            console.log("validation funcs end")
            console.log(groupId, userId);
            // Add user to the group
            const newMemberRef = doc(collection(db, 'group_members')); // Auto-generates an ID
            batch.set(newMemberRef, {
                group_id: groupId,
                user_id: String(userId),
                added_at: new Date(),
            });
        }

        // Commit the batch
        await batch.commit();
        console.log("Batch group member creation successful");

        return jsonData.map(user => ({
            userId: user.userId,
            groupName: user.group_name,
        }));
    } catch (error) {
        console.error('Error creating group members in batch:', error);
        throw new Error('Error creating group members in batch');
    }
}

// Helper function to check if user exists
async function checkIfUserExists(userId: string): Promise<boolean> {
    console.log("checkIfUserExists start")
    const userDoc = doc(db, String('users'), String(userId));
    const userSnapshot = await getDoc(userDoc);
    console.log("checkIfUserExists end")
    return userSnapshot.exists();
}

// Helper function to get group ID from group name
async function getGroupIdFromGroupName(group_name: string): Promise<string | null> {
    console.log("getGIDFromGName start")
    const groupQuery = query(collection(db, 'groups'), where('group_name', '==', group_name));
    const groupSnapshot = await getDocs(groupQuery);

    if (groupSnapshot.empty) {
        console.log("getGIDFromGName end")
        return null;
    }

    let groupId = '';
    groupSnapshot.forEach(doc => {
        groupId = doc.id; // Assuming groupId is the document ID
    });

    console.log("getGIDFromGName end")
    return groupId;
}

// Helper function to check if user is already in the group
async function checkIfUserInGroup(userId: string, groupId: string): Promise<boolean> {
    const groupMembersQuery = query(
        collection(db, 'group_members'),
        where('user_id', '==', userId),
        where('group_id', '==', groupId),
    );
    const groupMembersSnapshot = await getDocs(groupMembersQuery);

    return !groupMembersSnapshot.empty;
}
