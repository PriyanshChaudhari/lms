import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, writeBatch, query, where, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Define the type for user data
interface GroupMembers {
    userId: string;
    group_name: string;
}

// DELETE endpoint to handle removing group members
export async function POST(request: Request) {
    try {
        const { members } = await request.json();

        // Check if members is an array
        if (!Array.isArray(members)) {
            throw new Error('Invalid data format: members should be an array');
        }

        await batchGroupsDeletion(members); // Assuming this function handles batch deletion

        return new Response(JSON.stringify({ message: 'Group members removed successfully' }), { status: 201 });
    } catch (error: any) {
        console.error('Error deleting group members in batch:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Function to batch process group members deletion
export async function batchGroupsDeletion(members: Array<{ userId: string; group_name: string }>) {
    const batch = writeBatch(db);

    try {
        for (const member of members) {
            const { userId, group_name } = member;

            // Validate inputs
            if (!userId || !group_name) {
                throw new Error('UserID and group_name are required');
            }

            // Get the group ID using the group name
            const groupId = await getGroupIdFromGroupName(group_name);
            console.log(`groupId:${groupId}`)
            if (!groupId) {
                console.log(`Group with name ${group_name} does not exist`);
                continue;  // Skip if group doesn't exist
            }

            // Check if user is in the group
            const userInGroup = await checkIfUserInGroup(userId, groupId);
            if (userInGroup == false) {  // If the user is not in the group, skip deletion
                console.log(`User with userId ${userId} is not in group ${group_name}, skipping deletion`);
                continue;
            }

            const groupMembersRef = collection(db, 'group_members');
            const q = query(groupMembersRef, where('group_id', '==', String(groupId)), where('user_id', '==', String(userId)));
            const querySnapshot = await getDocs(q);

            console.log(`query : ${querySnapshot}`)

            // Delete the matched document within the batch
            querySnapshot.forEach((doc) => {
                const memberRef = doc.ref; // Get a reference to the document
                batch.delete(memberRef); // Queue the deletion in the batch
            });

            console.log(`Removing userId ${userId} from group ${group_name}...`);
        }

        // Commit the batch
        await batch.commit();
        console.log("Batch group member deletion successful");

        return members.map(user => ({
            userId: user.userId,
            groupName: user.group_name,
        }));
    } catch (error) {
        console.error('Error deleting group members in batch:', error);
        throw new Error('Error deleting group members in batch');
    }
}


// Helper function to get group ID from group name
async function getGroupIdFromGroupName(group_name: string): Promise<string | null> {
    console.log("getGIDFromGName start")
    const groupQuery = query(collection(db, 'groups'), where('group_name', '==', group_name));
    const groupSnapshot = await getDocs(groupQuery);

    if (groupSnapshot.empty) {
        console.log("getGIDFromGName end return null")
        return null;
    }

    let groupId = '';
    groupSnapshot.forEach(doc => {
        groupId = doc.id; // Assuming groupId is the document ID
    });

    console.log("getGIDFromGName end", groupId)
    return groupId;
}

// Helper function to check if user is already in the group
async function checkIfUserInGroup(userId: string, groupId: string): Promise<boolean> {
    console.log(`Checking if user with ID ${userId} is in group with ID ${groupId}`);

    const groupMembersQuery = query(
        collection(db, 'group_members'),
        where('user_id', '==', String(userId)),
        where('group_id', '==', String(groupId)),
    );

    const groupMembersSnapshot = await getDocs(groupMembersQuery);

    if (groupMembersSnapshot.empty) {
        console.log(`No user found in group with ID ${groupId} for user ID ${userId}`);
        return false;
    }

    console.log(`User with ID ${userId} found in group with ID ${groupId}`);
    return true;
}

