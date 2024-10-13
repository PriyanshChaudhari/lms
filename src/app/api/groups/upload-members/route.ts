import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, writeBatch, query, where, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Define the type for group members
interface GroupMembers {
    userId: string;
    group_name: string;
}

// DELETE endpoint to handle removing group members
export async function DELETE(request: NextRequest) {
    try {
        const { members } = await request.json();
        console.log(members)
        const updatedMembers = members.map((mem:any) => ({
            userId: String(mem.userId),
            ...mem,
        }));
        console.log(updatedMembers);

        await batchGroupsDeletion(updatedMembers);

        return NextResponse.json({ message: 'Group members removed successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error deleting group members in batch:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST endpoint to handle adding group members
export async function POST(request: NextRequest) {
    try {
        const { members } = await request.json();
        console.log(members)
        const updatedMembers = members.map((mem:any) => ({
            userId: String(mem.userId),
            ...mem,
        }));
        console.log(updatedMembers);

        await batchGroupsCreation(updatedMembers);

        return NextResponse.json({ message: 'Group member created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding group members:', error);
        return NextResponse.json({ error: 'Failed to add group members' }, { status: 500 });
    }
}

// Function to batch process group members deletion
async function batchGroupsDeletion(members: GroupMembers[]) {
    const batch = writeBatch(db);

    for (const member of members) {
        const { userId, group_name } = member;

        // Validate inputs
        if (!userId || !group_name) {
            throw new Error('UserId and group_name are required');
        }

        // Get the group ID using the group name
        const groupId = await getGroupIdFromGroupName(group_name);
        if (!groupId) {
            console.log(`Group with name ${group_name} does not exist`);
            continue;  // Skip if the group doesn't exist
        }
        console.log(`groupId: ${groupId}, userId: ${userId}`);

        // Check if the user is in the group
        const userInGroup = await checkIfUserInGroup(String(userId), groupId);
        if (!userInGroup) {
            console.log(`User with userId ${userId} is not in group ${group_name}, skipping deletion`);
            continue;
        }

        // Query to find the group member
        const groupMembersRef = collection(db, 'group_members');
        const q = query(groupMembersRef, where('group_id', '==', String(groupId)), where('user_id', '==', String(userId)));
        const querySnapshot = await getDocs(q);

        console.log(`Number of documents found for deletion: ${querySnapshot.size}`);

        if (querySnapshot.empty) {
            console.log(`No documents found for groupId: ${groupId}, userId: ${userId}`);
            continue; // Skip if no documents are found
        }

        // Queue the deletion of each matching document
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
            console.log(`Queued deletion for document with ID: ${doc.id}`);
        });
    }

    // Commit the batch deletion
    try {
        await batch.commit();
        console.log("Batch deletion committed successfully");
    } catch (error) {
        console.error("Error committing batch deletion:", error);
    }
}

// Function to batch process group members creation
async function batchGroupsCreation(members: GroupMembers[]) {
    const batch = writeBatch(db);

    for (const member of members) {
        const { userId, group_name } = member;

        // Validate inputs
        if (!userId || !group_name) {
            throw new Error('UserId and group_name are required');
        }

        // Check if the user exists
        const userExists = await checkIfUserExists(String(userId));
        if (!userExists) {
            console.log(`User with userId ${userId} does not exist`);
            continue;
        }

        // Get the group ID using the group name
        const groupId = await getGroupIdFromGroupName(group_name);
        if (!groupId) {
            throw new Error(`Group with name ${group_name} does not exist`);
        }

        // Check if the user is already in the group
        const userInGroup = await checkIfUserInGroup(String(userId), groupId);
        if (userInGroup) {
            console.log(`User with userId ${userId} is already in group ${group_name}`);
            continue;
        }

        // Add the user to the group
        const newMemberRef = doc(collection(db, 'group_members'));
        batch.set(newMemberRef, {
            group_id: groupId,
            user_id: String(userId),
            added_at: new Date(),
        });
    }

    // Commit the batch creation
    await batch.commit();
}

// Helper function to check if a user exists
async function checkIfUserExists(userId: string): Promise<boolean> {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.exists();
}

// Helper function to get group ID from group name
async function getGroupIdFromGroupName(group_name: string): Promise<string | null> {
    const groupQuery = query(collection(db, 'groups'), where('group_name', '==', group_name.toUpperCase()));
    const groupSnapshot = await getDocs(groupQuery);

    if (groupSnapshot.empty) {
        return null;
    }

    let groupId = '';
    groupSnapshot.forEach((doc) => {
        groupId = doc.id;  // Assuming the document ID is the groupId
    });

    return groupId;
}

// Helper function to check if a user is already in a group
async function checkIfUserInGroup(userId: string, groupId: string): Promise<boolean> {
    const groupMembersQuery = query(
        collection(db, 'group_members'),
        where('user_id', '==', userId),
        where('group_id', '==', groupId)
    );
    const groupMembersSnapshot = await getDocs(groupMembersQuery);
    return !groupMembersSnapshot.empty;
}
